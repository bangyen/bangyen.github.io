import { Box, Typography } from '@mui/material';
import React from 'react';

import { SlantBoard } from './SlantBoard';
import { getDerivedBoardDimensions } from '../config/constants';
import { PATTERNS } from '../config/patterns';
import { makeBackProps, makeFrontProps } from '../utils/patternHelpers';

import { GameTextRenderer } from '@/components/ui/GameTextRenderer';
import { COLORS } from '@/config/theme';

// ---------------------------------------------------------------------------
// Pattern Description Renderer
// ---------------------------------------------------------------------------

// Replaced with generic GameTextRenderer Component
// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const patternContainerSx = {
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
    gap: 4,
    width: '100%',
    py: 2,
    pr: 4,
    // Overflow handled by parent infoStepContentSx
};

const patternItemSx = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 0,
    width: '100%',
    // maxWidth removed to let grid control width
};

const patternBoardContainerSx = {
    width: '180px', // Fixed width to align all boards
    display: 'flex',
    justifyContent: 'center',
    flexShrink: 0,
};

const patternTextSx = {
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
    flex: 1,
    minWidth: 0, // Allow text to wrap properly
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CommonPatterns() {
    const size = 3; // Fixed cell size for patterns
    const { numberSize } = getDerivedBoardDimensions(size);

    return (
        <Box sx={patternContainerSx}>
            {PATTERNS.map(pattern => (
                <Box key={pattern.title} sx={patternItemSx}>
                    <Box sx={patternBoardContainerSx}>
                        <SlantBoard
                            size={size}
                            rows={pattern.rows - 1}
                            cols={pattern.cols - 1}
                            cellProps={makeBackProps(pattern.grid, size)}
                            overlayProps={makeFrontProps(
                                pattern.numbers,
                                numberSize,
                            )}
                        />
                    </Box>
                    <Box sx={patternTextSx}>
                        <Typography
                            variant="subtitle1"
                            sx={{
                                fontWeight: 'bold',
                                color: COLORS.text.primary,
                            }}
                        >
                            {pattern.title}
                        </Typography>
                        <GameTextRenderer text={pattern.description} />
                    </Box>
                </Box>
            ))}
        </Box>
    );
}
