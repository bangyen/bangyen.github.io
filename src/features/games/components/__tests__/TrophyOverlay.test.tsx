// @vitest-environment jsdom
import { render } from '@testing-library/react';
import React from 'react';

import { TrophyOverlay } from '../TrophyOverlay';

describe('TrophyOverlay', () => {
    const onReset = vi.fn();
    const defaultProps = {
        show: true,
        onReset,
        size: 5,
        iconSizeRatio: 0.8,
    };

    it('should be non-interactive (pointer-events: none)', () => {
        const { container } = render(<TrophyOverlay {...defaultProps} />);
        const overlay = container.firstChild as HTMLElement;
        expect(overlay).toHaveStyle('pointer-events: none');
    });

    it('should display Solved! label when shown', () => {
        const { getByText } = render(<TrophyOverlay {...defaultProps} />);
        expect(getByText('Solved!')).toBeInTheDocument();
    });

    it('should not be visible when show is false', () => {
        const { container } = render(
            <TrophyOverlay {...defaultProps} show={false} />,
        );
        const overlay = container.firstChild as HTMLElement;
        expect(overlay).toHaveStyle('opacity: 0');
        expect(overlay).toHaveStyle('visibility: hidden');
    });
});
