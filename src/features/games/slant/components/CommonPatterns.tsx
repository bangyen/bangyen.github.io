import { Box, Typography } from '@mui/material';
import React from 'react';

import { Board } from '../../components/Board';
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
                        <Board
                            size={size}
                            rows={pattern.rows}
                            cols={pattern.cols}
                            cellRows={pattern.rows - 1}
                            cellCols={pattern.cols - 1}
                            space={0.125}
                            overlayProps={makeFrontProps(
                                pattern.numbers,
                                numberSize,
                            )}
                            cellProps={makeBackProps(pattern.grid, size)}
                            overlayLayerSx={{ pointerEvents: 'none' }}
                            overlayDecorative
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
