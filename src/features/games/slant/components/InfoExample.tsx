import React from 'react';

import Example from './Example';
import { InfoExampleWrapper } from '../../components/InfoExampleWrapper';

/**
 * Wraps the Example animation inside the Info modal, capping the cell size
 * so the 3×3 demo grid fits within the modal on all screen sizes.
 */
export function InfoExample(): React.ReactElement {
    const exampleSize = 5;

    return (
        <InfoExampleWrapper>
            <Example size={exampleSize} />
        </InfoExampleWrapper>
    );
}
