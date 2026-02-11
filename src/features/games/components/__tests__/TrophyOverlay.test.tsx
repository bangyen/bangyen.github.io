import { render, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { TrophyOverlay } from '../TrophyOverlay';

describe('TrophyOverlay', () => {
    const onReset = vi.fn();
    const defaultProps = {
        show: true,
        onReset,
        size: 5,
        iconSizeRatio: 0.8,
    };

    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should be interactive after delay when shown', () => {
        const { container } = render(<TrophyOverlay {...defaultProps} />);

        const overlay = container.firstChild as HTMLElement;

        // Should not be interactive yet
        fireEvent.click(overlay);
        expect(onReset).not.toHaveBeenCalled();

        // Wait for delay
        act(() => {
            vi.advanceTimersByTime(500);
        });

        fireEvent.click(overlay);
        expect(onReset).toHaveBeenCalled();
    });

    it('should not be visible when show is false', () => {
        const { container } = render(
            <TrophyOverlay {...defaultProps} show={false} />
        );
        const overlay = container.firstChild as HTMLElement;
        expect(overlay).toHaveStyle('opacity: 0');
        expect(overlay).toHaveStyle('visibility: hidden');
    });

    it('should use secondary color if useSecondary is true', () => {
        const { container } = render(
            <TrophyOverlay
                {...defaultProps}
                useSecondary={true}
                secondaryColor="rgb(0, 0, 255)"
            />
        );
        const icon = container.querySelector('svg');
        expect(icon).toHaveStyle('color: rgb(0, 0, 255)');
    });

    it('should cleanup timeout on unmount', () => {
        const { unmount } = render(<TrophyOverlay {...defaultProps} />);
        const clearTimeoutSpy = vi.spyOn(window, 'clearTimeout');
        unmount();
        expect(clearTimeoutSpy).toHaveBeenCalled();
    });
});
