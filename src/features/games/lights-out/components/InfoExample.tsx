import React from 'react';

import Example from './Example';
import type { Palette, PropsFactory } from '../../components/Board';
import { InfoExampleWrapper } from '../../components/InfoExampleWrapper';

import { useMobile } from '@/hooks';

interface InfoExampleProps {
    palette: Palette;
    getFrontProps: PropsFactory;
    getBackProps: PropsFactory;
}

/**
 * Wraps the Example animation inside the Info modal, using a fixed cell size
 * so the 3×3 demo grid looks good regardless of the main board's dimensions.
 */
export function InfoExample({
    palette,
    getFrontProps,
    getBackProps,
}: InfoExampleProps) {
    const mobile = useMobile('sm');
    // The example is always 3×3, so the cell size is independent of the main
    // game board.  Use smaller cells on mobile so the vertical layout fits
    // comfortably inside the fixed-height modal.
    const exampleSize = mobile ? 3 : 4; // rem

    return (
        <InfoExampleWrapper>
            <Example
                dims={3}
                size={exampleSize}
                start={[1, 3, 8]}
                palette={palette}
                getFrontProps={getFrontProps}
                getBackProps={getBackProps}
            />
        </InfoExampleWrapper>
    );
}
