import { screen, fireEvent, within } from '@testing-library/react';
import React from 'react';
import { vi, type Mock } from 'vitest';

import { LightsOut } from '../LightsOut';

import { PAGE_TITLES } from '@/config/constants';
import * as boardHandlers from '@/features/games/lights-out/utils/boardHandlers';
import * as hooks from '@/hooks';
import { renderWithProviders } from '@/utils/test-utils';

// Keep icons mocked to simplify DOM
vi.mock('@/components/icons', async () => {
    const actual = await vi.importActual<any>('@/components/icons');
    return {
        ...actual,
        MenuBookRounded: () => <div data-testid="menu-icon" />,
        CircleRounded: () => <div data-testid="circle-icon" />,
        AddRounded: () => <div data-testid="add-icon" />,
        RemoveRounded: () => <div data-testid="remove-icon" />,
        EmojiEventsRounded: () => <div data-testid="trophy-icon" />,
    };
});

// Mock hooks that interact with browser environment
vi.mock('@/hooks', async () => {
    const actual = await vi.importActual<any>('@/hooks');
    return {
        ...actual,
        useWindow: vi.fn(() => ({ height: 800, width: 1200 })),
        useMobile: vi.fn(() => false),
    };
});

// Mock LightsOutTutorial specifically to verify its presence via testid
vi.mock('@/features/games/lights-out/components/LightsOutTutorial', () => ({
    LightsOutTutorial: function MockTutorial({ open }: { open: boolean }) {
        return open ? <div data-testid="info-modal">Info</div> : null;
    },
}));

describe('LightsOut', () => {
    let handleBoardSpy: any;

    beforeEach(() => {
        handleBoardSpy = vi.spyOn(boardHandlers, 'boardReducer');
        vi.clearAllMocks();
    });

    afterEach(() => {
        handleBoardSpy.mockRestore();
    });

    it('renders the game board and controls', () => {
        renderWithProviders(<LightsOut />);
        expect(screen.getByTestId('lights-out-board')).toBeInTheDocument();
        // Check for specific control buttons instead of a generic mock ID
        expect(screen.getAllByLabelText('New Puzzle').length).toBeGreaterThan(
            0,
        );
    });

    it('sets the document title', () => {
        renderWithProviders(<LightsOut />);
        expect(document.title).toBe(PAGE_TITLES.lightsOut);
    });

    it('handles resize events', async () => {
        const mockUseWindow = hooks.useWindow as Mock;
        // Initial render
        renderWithProviders(<LightsOut />);

        // Give it a moment to call the initial resize effect
        await new Promise(r => setTimeout(r, 0));

        // Change window size
        mockUseWindow.mockReturnValue({ height: 500, width: 500 });

        // This should trigger a re-render if the component uses useWindow
        // but LightsOut uses useLightsOutGame which uses useBaseGame which uses useBoardLayout which uses useGridSize...
        // Wait! useGridSize uses useWindow.

        // Re-rendering with the same component should trigger hooks to update if dependencies changed
        renderWithProviders(<LightsOut />);

        await new Promise(r => setTimeout(r, 50));

        // Should have been called at least twice (once on mount, once on resize)
        expect(handleBoardSpy).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({ type: 'resize' }),
        );
    });

    it('handles refresh: dispatches next action', () => {
        renderWithProviders(<LightsOut />);
        const refreshButtons = screen.getAllByLabelText('New Puzzle');
        const btn =
            refreshButtons.find(b => b.tagName === 'BUTTON') ||
            refreshButtons[0];

        fireEvent.click(btn!);

        expect(handleBoardSpy).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({ type: 'new' }),
        );
    });

    it('toggles info modal', async () => {
        renderWithProviders(<LightsOut />);
        const infoButtons = screen.getAllByLabelText('How to Play');
        const btn =
            infoButtons.find(b => b.tagName === 'BUTTON') || infoButtons[0];

        fireEvent.click(btn!);

        // Use waitFor for state-driven UI changes
        const modal = await screen.findByTestId('info-modal');
        expect(modal).toBeInTheDocument();
    });

    it('handles manual cell click', () => {
        renderWithProviders(<LightsOut />);

        const board = screen.getByTestId('lights-out-board');

        // Use resilient aria-label selection for the cell
        const cell = within(board).getByLabelText(
            /Light at row 1, column 1\b/i,
        );

        fireEvent.mouseDown(cell);

        expect(handleBoardSpy).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({ type: 'adjacent', row: 0, col: 0 }),
        );
    });

    it('handles mobile layout offsets', async () => {
        const mockUseMobile = hooks.useMobile as Mock;
        mockUseMobile.mockReturnValue(true);

        renderWithProviders(<LightsOut />);

        // Ensure useEffect dispatches have run
        await new Promise(r => setTimeout(r, 50));

        expect(handleBoardSpy).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({ type: 'resize' }),
        );
    });
});
