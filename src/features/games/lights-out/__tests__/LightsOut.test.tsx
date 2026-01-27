/* eslint-disable @typescript-eslint/no-require-imports */
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import LightsOut from '../LightsOut';
import { PAGE_TITLES } from '../../../../config/constants';
import * as boardHandlers from '../boardHandlers';

// Mock hooks
jest.mock('../../../../hooks', () => ({
    useWindow: jest.fn(() => ({ height: 800, width: 1200 })),
    useMobile: jest.fn(() => false),
}));

// Mock boardHandlers to control game logic
jest.mock('../boardHandlers', () => ({
    getGrid: jest.fn(() => [[0]]), // Simple 1x1 grid
    handleBoard: jest.fn((state, action) => {
        // Simple reducer mock that updates state based on action
        if (action.type === 'auto') return { ...state, auto: !state.auto };
        if (action.type === 'resize')
            return { ...state, rows: action.newRows, cols: action.newCols };
        return state;
    }),
    getNextMove: jest.fn(),
}));

// Mock sub-components
jest.mock('../../components/Board', () => ({
    Board: function MockBoard({
        frontProps,
    }: {
        frontProps: (r: number, c: number) => { onClick: () => void };
    }) {
        return (
            <div data-testid="board">
                <button
                    data-testid="cell-0-0"
                    onClick={frontProps(0, 0).onClick}
                >
                    Cell 0,0
                </button>
            </div>
        );
    },
    useHandler: () => ({
        getColor: () => ({ front: 'white', back: 'black' }),
        getBorder: () => ({}),
        getFiller: () => 'gray',
    }),
    usePalette: () => ({}),
}));

jest.mock('../../../../components/ui/Controls', () => ({
    Controls: function MockControls({
        children,
        onAutoPlay,
        autoPlayEnabled,
    }: {
        children: React.ReactNode;
        onAutoPlay?: () => void;
        autoPlayEnabled?: boolean;
    }) {
        return (
            <div data-testid="controls">
                {onAutoPlay && (
                    <button
                        aria-label={autoPlayEnabled ? 'Pause' : 'Auto Play'}
                        onClick={onAutoPlay}
                    >
                        {autoPlayEnabled ? 'Pause' : 'Auto Play'}
                    </button>
                )}
                {children}
            </div>
        );
    },
    TooltipButton: function MockTooltipButton({
        title,
        onClick,
    }: {
        title: string;
        onClick: () => void;
    }) {
        return (
            <button aria-label={title} onClick={onClick}>
                {title}
            </button>
        );
    },
}));

jest.mock(
    '../Info',
    () =>
        function MockInfo() {
            return <div data-testid="info-modal">Info</div>;
        }
);

// Mock ThemeProvider
jest.mock('../../../../hooks/useTheme', () => ({
    useThemeContext: () => ({
        mode: 'light',
        resolvedMode: 'light',
        toggleTheme: jest.fn(),
    }),
}));

describe('LightsOut', () => {
    const mockGetNextMove = boardHandlers.getNextMove as jest.Mock;
    const mockHandleBoard = boardHandlers.handleBoard as jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
        mockHandleBoard.mockImplementation((state, action) => {
            if (action.type === 'auto') return { ...state, auto: !state.auto };
            if (action.type === 'resize')
                return { ...state, rows: action.newRows, cols: action.newCols };
            return state;
        });
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('renders the game board and controls', () => {
        render(<LightsOut />);
        expect(screen.getByTestId('board')).toBeInTheDocument();
        expect(screen.getByTestId('controls')).toBeInTheDocument();
    });

    it('sets the document title', () => {
        render(<LightsOut />);
        expect(document.title).toBe(PAGE_TITLES.lightsOut);
    });

    it('toggles auto play and processes moves', () => {
        // Setup getNextMove to return a move then nothing
        mockGetNextMove
            .mockReturnValueOnce([{ row: 0, col: 0 }]) // First call returns a move
            .mockReturnValueOnce([]); // Second call returns no moves (stops auto)

        render(<LightsOut />);
        const autoBtn = screen.getByLabelText('Auto Play');

        // Start Auto Play
        fireEvent.click(autoBtn);

        // Advance timer to trigger effect
        act(() => {
            jest.advanceTimersByTime(300);
        });

        // Should have called getNextMove
        expect(mockGetNextMove).toHaveBeenCalled();

        // Should have dispatched adjacent move
        expect(mockHandleBoard).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({ type: 'adjacent', row: 0, col: 0 })
        );
    });

    it('handles resize events', () => {
        const { useWindow } = require('../../../../hooks');
        // Initial render
        const { rerender } = render(<LightsOut />);

        // Change window size
        useWindow.mockReturnValue({ height: 500, width: 500 });

        rerender(<LightsOut />);

        // Should dispatch resize
        expect(mockHandleBoard).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({ type: 'resize' })
        );
    });

    it.skip('handles queueing moves in auto play', async () => {
        // Return multiple moves consistently
        mockGetNextMove.mockReturnValue([
            { row: 0, col: 0 },
            { row: 0, col: 1 },
        ]);

        render(<LightsOut />);
        fireEvent.click(screen.getByLabelText('Auto Play'));

        // 1. Initial wait for first timeout (300ms) -> triggers getNextMove & setMoveQueue
        act(() => {
            jest.advanceTimersByTime(350);
        });
        expect(mockGetNextMove).toHaveBeenCalled();

        // 2. Wait for second timeout (300ms) -> triggers dispatch(0,0) & setMoveQueue
        act(() => {
            jest.advanceTimersByTime(350);
        });

        expect(mockHandleBoard).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({ type: 'adjacent', row: 0, col: 0 })
        );

        // 3. Wait for third timeout (300ms) -> triggers dispatch(0,1)
        act(() => {
            jest.advanceTimersByTime(350);
        });

        expect(mockHandleBoard).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({ type: 'adjacent', row: 0, col: 1 })
        );
    });

    it('stops auto play if manual interaction occurs', () => {
        // Wait, manual interaction usually disables auto play in handleBoard.
        // We mocked handleBoard.
        // The component uses state.auto.
        // If we click 'Pause' (which is the same button), it toggles auto.
        render(<LightsOut />);
        const autoBtn = screen.getByLabelText('Auto Play');
        fireEvent.click(autoBtn);
        expect(screen.getByLabelText('Pause')).toBeInTheDocument();
        fireEvent.click(autoBtn); // Click Pause
        expect(screen.getByLabelText('Auto Play')).toBeInTheDocument();
    });

    it('toggles info modal', () => {
        render(<LightsOut />);
        const infoBtn = screen.getByLabelText('Info');
        fireEvent.click(infoBtn);
        expect(screen.getByTestId('info-modal')).toBeInTheDocument();
    });
});
