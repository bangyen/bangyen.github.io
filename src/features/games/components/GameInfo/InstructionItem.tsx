import { Box, Typography } from '@mui/material';
import React from 'react';

import {
    instructionTitleSx,
    instructionIconSx,
    instructionTextSx,
} from './GameInfo.styles';

/** Data for a single instruction row shown on the first step. */
export interface InstructionItemData {
    Icon: React.ElementType;
    title: string;
    text: string;
}

/**
 * Renders a single instruction row: an icon, bold title, and description.
 * Used internally to build the instructions step from declarative data.
 */
export function InstructionItem({ Icon, title, text }: InstructionItemData) {
    return (
        <Box sx={{ px: 2 }}>
            <Typography variant="h6" sx={instructionTitleSx}>
                <Icon sx={instructionIconSx} />
                {title}
            </Typography>
            <Typography variant="body1" sx={instructionTextSx}>
                {text}
            </Typography>
        </Box>
    );
}
