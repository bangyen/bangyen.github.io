import { Box } from '@mui/material';
import React from 'react';

import { InstructionItem } from '../../components/InfoContent';

import {
    TextureRounded,
    TagRounded,
    NotInterestedRounded,
} from '@/components/icons';

/**
 * Step 0 of the Slant Info modal: concise rule explanations.
 * Mirrors the Lights Out InfoInstructions pattern with three items.
 */
export function InfoInstructions() {
    return (
        <Box
            sx={{
                animation: 'fadeIn 0.3s ease',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    gap: 4,
                }}
            >
                <InstructionItem
                    Icon={TextureRounded}
                    title="Fill with Slashes"
                    text="Place a forward (/) or backward (\) slash in every cell of the grid."
                />
                <InstructionItem
                    Icon={TagRounded}
                    title="Match the Numbers"
                    text="Each number at a corner tells how many slashes touch that point."
                />
                <InstructionItem
                    Icon={NotInterestedRounded}
                    title="No Loops"
                    text="Slashes must never form a closed loop — every path stays open."
                />
            </Box>
        </Box>
    );
}
