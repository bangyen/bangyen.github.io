import { Box } from '@mui/material';
import React from 'react';

import {
    stepFadeInSx,
    stepCenteredContentSx,
    stepInstructionsListSx,
} from './GameInfo.styles';
import type { InstructionItemData } from './InstructionItem';
import { InstructionItem } from './InstructionItem';

// ---------------------------------------------------------------------------
// Step content builders
// ---------------------------------------------------------------------------

interface InstructionsStepProps {
    instructions: InstructionItemData[];
    footer?: React.ReactNode;
}

/**
 * Renders step 0: the list of instruction rows plus an optional footer.
 * Extracted so `GameInfo` focuses on modal chrome and navigation.
 */
export function InstructionsStep({
    instructions,
    footer,
}: InstructionsStepProps): React.ReactElement {
    return (
        <Box sx={stepFadeInSx}>
            <Box sx={stepInstructionsListSx}>
                {instructions.map(({ Icon, title, text }) => (
                    <InstructionItem
                        key={title}
                        Icon={Icon}
                        title={title}
                        text={text}
                    />
                ))}
            </Box>
            {footer}
        </Box>
    );
}

interface ExampleStepProps {
    children: React.ReactNode;
}

/**
 * Renders step 1: the animated example wrapped in a flex container.
 * Extracted so `GameInfo` focuses on modal chrome and navigation.
 */
export function ExampleStep({
    children,
}: ExampleStepProps): React.ReactElement {
    return (
        <Box sx={stepFadeInSx}>
            <Box sx={stepCenteredContentSx}>{children}</Box>
        </Box>
    );
}
