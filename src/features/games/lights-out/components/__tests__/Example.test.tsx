/**
 * @vitest-environment happy-dom
 */
import { render, screen, act, fireEvent } from '@testing-library/react';
import React from 'react';
import { vi, describe, it, expect } from 'vitest';

import { EXAMPLE_ANIMATION_DATA } from '../../utils/animationData';
import { Example } from '../Example';

// Mock calculator to avoid real implementation issues
vi.mock('../Calculator', () => ({
    getOutput: vi.fn(() => () => ({})),
    useHandler: vi.fn(() => ({})),
    getInput: vi.fn(() => () => ({})),
}));

// Mock hooks (useMobile requires a ThemeProvider; stub it out)
vi.mock('@/hooks', () => ({
    useMobile: vi.fn(() => false),
}));

// Mock icons (includes icons used by config.ts for INSTRUCTIONS)
vi.mock('@/components/icons', () => ({
    EmojiEventsRounded: () => <div data-testid="emoji-events-rounded" />,
    KeyboardArrowDown: () => <div data-testid="icon-arrow-down" />,
    Calculate: () => <div data-testid="icon-calculate" />,
    Replay: () => <div data-testid="icon-replay" />,
    ViewModuleRounded: () => <div data-testid="icon-board" />,
    NavigateBeforeRounded: () => <div data-testid="icon-step-back" />,
    NavigateNextRounded: () => <div data-testid="icon-step-next" />,
    PlayArrowRounded: () => <div data-testid="icon-play" />,
    PauseRounded: () => <div data-testid="icon-pause" />,
}));

vi.mock('./CanvasBoard', () => ({
    CanvasBoard: () => <div data-testid="canvas-board" />,
}));

vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
    AnimatePresence: ({ children }: any) => children,
}));

describe('Lights Out Example Component', () => {
    const mockPalette = { primary: 'red', secondary: 'blue' };

    it('automatically switches views based on animation phase', () => {
        vi.useFakeTimers();
        render(<Example size={100} palette={mockPalette} />);

        const { calculatorStart, secondChaseStart } =
            EXAMPLE_ANIMATION_DATA.phaseIndices;

        // Start phase
        expect(screen.queryByText('Input')).not.toBeInTheDocument();

        // Advance to Calculator phase
        act(() => {
            vi.advanceTimersByTime(2000 * calculatorStart);
        });
        expect(screen.getByText('Input')).toBeInTheDocument();

        // Advance to Second Board phase
        act(() => {
            vi.advanceTimersByTime(2000 * (secondChaseStart - calculatorStart));
        });
        expect(screen.queryByText('Input')).not.toBeInTheDocument();

        vi.useRealTimers();
    });

    it('pauses animation when manually switching views', () => {
        render(<Example size={100} palette={mockPalette} />);

        // Initially playing
        expect(screen.getByText('Pause')).toBeInTheDocument();

        // Switch view
        const switchBtn = screen.getByText('Calculator');
        fireEvent.click(switchBtn);

        // Should now be paused
        expect(screen.getByText('Play')).toBeInTheDocument();
    });

    it('renders board initially and can switch to calculator', () => {
        render(<Example size={100} palette={mockPalette} />);

        // Initially shows board (CanvasBoard)
        expect(screen.getByTestId('canvas-board')).toBeInTheDocument();

        // Switch to calculator
        const switchBtn = screen.getByText('Calculator');
        fireEvent.click(switchBtn);

        // Now should show Input and Result grids (CanvasBoard x2)
        const newGrids = screen.getAllByTestId('canvas-board');
        expect(newGrids).toHaveLength(2);
        expect(screen.getByText('Input')).toBeInTheDocument();
        expect(screen.getByText('Result')).toBeInTheDocument();
    });

    it('cycles through frames over time', () => {
        vi.useFakeTimers();
        render(<Example size={100} palette={mockPalette} />);

        expect(screen.getByTestId('canvas-board')).toBeInTheDocument();

        act(() => {
            vi.advanceTimersByTime(2000);
        });

        expect(screen.getByTestId('canvas-board')).toBeInTheDocument();
        vi.useRealTimers();
    });

    it('shows trophy on last frame', () => {
        vi.useFakeTimers();
        render(<Example size={100} palette={mockPalette} />);

        // Advance to last frame
        act(() => {
            vi.advanceTimersByTime(
                2000 * (EXAMPLE_ANIMATION_DATA.boardStates.length - 1),
            );
        });

        expect(screen.getByTestId('emoji-events-rounded')).toBeVisible();
        vi.useRealTimers();
    });
});
