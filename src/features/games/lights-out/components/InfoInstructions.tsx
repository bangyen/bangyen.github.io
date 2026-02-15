import { Box } from '@mui/material';
import React from 'react';

import { InstructionItem } from '../../components/InfoContent';

import { KeyboardArrowDown, Calculate, Replay } from '@/components/icons';

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
                    Icon={KeyboardArrowDown}
                    title="Chase to Bottom"
                    text="Turn off rows from top to bottom by clicking lights in each row to push them down."
                />
                <InstructionItem
                    Icon={Calculate}
                    title="Use Calulator"
                    text="Enter the remaining lights pattern from the bottom row into the calculator on the last page."
                />
                <InstructionItem
                    Icon={Replay}
                    title="Chase Again"
                    text="Apply the solution pattern to the top row, then chase them down again to solve the puzzle."
                />
            </Box>
        </Box>
    );
}
