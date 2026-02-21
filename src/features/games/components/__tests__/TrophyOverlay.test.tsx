import React from 'react';
import { axe } from 'vitest-axe';
import 'vitest-axe/extend-expect';

import { TrophyOverlay } from '../TrophyOverlay';

import { renderWithProviders } from '@/utils/test-utils';

describe('TrophyOverlay', () => {
    const defaultProps = {
        show: true,
    };

    it('should be non-interactive (pointer-events: none)', () => {
        const { container } = renderWithProviders(
            <TrophyOverlay {...defaultProps} />,
        );
        const overlay = container.firstChild as HTMLElement;
        expect(overlay).toHaveStyle('pointer-events: none');
    });

    it('should display Solved! label when shown', () => {
        const { getByText } = renderWithProviders(
            <TrophyOverlay {...defaultProps} />,
        );
        expect(getByText('Solved!')).toBeInTheDocument();
    });

    it('should not be rendered when show is false', () => {
        const { container } = renderWithProviders(
            <TrophyOverlay {...defaultProps} show={false} />,
        );
        expect(container.firstChild).toBeNull();
    });

    it('should pass accessibility audit', async () => {
        const { container } = renderWithProviders(
            <TrophyOverlay {...defaultProps} />,
        );
        const results = await axe(container);
        // @ts-expect-error - vitest-axe type augmentation is being stubborn
        expect(results).toHaveNoViolations();
    });
});
