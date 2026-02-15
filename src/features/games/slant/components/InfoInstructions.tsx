import { Box, Button } from '@mui/material';
import React from 'react';

import { InstructionItem } from '../../components/InfoContent';

import {
    TextureRounded,
    TagRounded,
    NotInterestedRounded,
    Psychology,
} from '@/components/icons';
import { COLORS } from '@/config/theme';

interface InfoInstructionsProps {
    /** Opens ghost-mode calculator and closes the Info modal. */
    onOpenCalculator: () => void;
}

/**
 * Step 0 of the Slant Info modal: concise rule explanations plus a
 * shortcut button to open the constraint-propagation calculator.
 */
export function InfoInstructions({ onOpenCalculator }: InfoInstructionsProps) {
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
            <Box
                sx={{
                    display: 'flex',
                    px: 2,
                    ml: { xs: 5, sm: 4 },
                    pt: { xs: 0, sm: 3 },
                    mt: { xs: -8, sm: 0 },
                }}
            >
                <Button
                    variant="outlined"
                    startIcon={<Psychology />}
                    onClick={onOpenCalculator}
                    sx={{
                        borderColor: COLORS.border.subtle,
                        color: COLORS.text.secondary,
                    }}
                >
                    Open Calculator
                </Button>
            </Box>
        </Box>
    );
}
