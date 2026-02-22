/**
 * @vitest-environment happy-dom
 */
import { render, screen, act, fireEvent } from '@testing-library/react';
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

// Mock CustomGrid to avoid complex rendering and animations
vi.mock('@/components/ui/CustomGrid', () => ({
    CustomGrid: vi.fn(
        ({
            cellProps,
            rows,
            cols,
        }: {
            cellProps: (
                r: number,
                c: number,
            ) => { backgroundColor?: string; color?: string };
            rows: number;
            cols: number;
        }) => (
            <div data-testid="custom-grid">
                {Array.from({ length: rows * cols }).map((_, i) => {
                    const r = Math.floor(i / cols);
                    const c = i % cols;
                    const props = cellProps(r, c);
                    const { backgroundColor, color, ...domProps } = props;

                    return (
                        <div
                            key={`${String(r)}-${String(c)}`}
                            data-testid={`cell-${String(r)}-${String(c)}`}
                            style={
                                {
                                    backgroundColor,
                                    color,
                                } as React.CSSProperties
                            }
                            {...domProps}
                        />
                    );
                })}
            </div>
        ),
    ),
}));

describe('Lights Out Example Component', () => {
    const mockPalette = { primary: 'red', secondary: 'blue' };
    const mockGetFrontProps = vi.fn(() => () => ({}));
    const mockGetBackProps = vi.fn(() => () => ({}));

    it('automatically switches views based on animation phase', () => {
        vi.useFakeTimers();
        render(
            <Example
                size={100}
                palette={mockPalette}
                getFrontProps={mockGetFrontProps}
                getBackProps={mockGetBackProps}
            />,
        );

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
        render(
            <Example
                size={100}
                palette={mockPalette}
                getFrontProps={mockGetFrontProps}
                getBackProps={mockGetBackProps}
            />,
        );

        // Initially playing
        expect(screen.getByText('Pause')).toBeInTheDocument();

        // Switch view
        const switchBtn = screen.getByText('Calculator');
        fireEvent.click(switchBtn);

        // Should now be paused
        expect(screen.getByText('Play')).toBeInTheDocument();
    });

    it('renders board initially and can switch to calculator', () => {
        render(
            <Example
                size={100}
                palette={mockPalette}
                getFrontProps={mockGetFrontProps}
                getBackProps={mockGetBackProps}
            />,
        );

        // Initially shows board (2 layers: back and front)
        const grids = screen.getAllByTestId('custom-grid');
        expect(grids).toHaveLength(2);

        // Switch to calculator
        const switchBtn = screen.getByText('Calculator');
        fireEvent.click(switchBtn);

        // Now should show Input and Result grids (1x3 each)
        const newGrids = screen.getAllByTestId('custom-grid');
        expect(newGrids).toHaveLength(2);
        expect(screen.getByText('Input')).toBeInTheDocument();
        expect(screen.getByText('Result')).toBeInTheDocument();
    });

    it('passes cellProps to CustomGrid', () => {
        render(
            <Example
                size={100}
                palette={mockPalette}
                getFrontProps={mockGetFrontProps}
                getBackProps={mockGetBackProps}
            />,
        );

        expect(mockGetFrontProps).toHaveBeenCalled();
        expect(mockGetBackProps).toHaveBeenCalled();
    });

    it('cycles through frames over time', () => {
        vi.useFakeTimers();
        render(
            <Example
                size={100}
                palette={mockPalette}
                getFrontProps={mockGetFrontProps}
                getBackProps={mockGetBackProps}
            />,
        );

        expect(screen.getAllByTestId('cell-0-0').length).toBeGreaterThan(0);

        act(() => {
            vi.advanceTimersByTime(2000);
        });

        expect(screen.getAllByTestId('cell-0-0').length).toBeGreaterThan(0);
        vi.useRealTimers();
    });

    it('shows trophy on last frame', () => {
        vi.useFakeTimers();
        render(
            <Example
                size={100}
                palette={mockPalette}
                getFrontProps={mockGetFrontProps}
                getBackProps={mockGetBackProps}
            />,
        );

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
