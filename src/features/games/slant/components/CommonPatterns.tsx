import { Box, Typography } from '@mui/material';
import React from 'react';

import { Board } from '../../components/Board';
import { SLANT_STYLES, NUMBER_SIZE_RATIO } from '../config/constants';
import { PATTERNS } from '../config/patterns';
import { makeBackProps, makeFrontProps } from '../utils/patternHelpers';

import { COLORS } from '@/config/theme';

// ---------------------------------------------------------------------------
// Pattern Description Renderer
// ---------------------------------------------------------------------------

const numberBadgeSx = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '1.5em',
    height: '1.5em',
    borderRadius: '50%',
    backgroundColor: COLORS.surface.background,
    border: `1px solid ${COLORS.border.subtle}`,
    fontSize: '0.85em',
    fontWeight: 'bold',
    mx: 0.4,
    verticalAlign: 'middle',
    lineHeight: 1,
    pt: '0.05em',
    boxShadow: SLANT_STYLES.SHADOWS.HINT,
    // Optical adjustment to sit nicely with text
    position: 'relative',
    top: '-0.1em',
};

/**
 * Parses description text and replaces quoted numbers (e.g. "1")
 * with a styled badge.
 */
function PatternDescription({ text }: { text: string }) {
    // Split by quoted numbers: "1", "4", etc.
    // Capturing group (1) keeps the number in the result array.
    const parts = text.split(/"(\d+)"/g);

    return (
        <Typography variant="body2" sx={{ color: COLORS.text.secondary }}>
            {parts.map((part, i) => {
                // If the part is numeric and was surrounded by quotes (odd index), render badge
                // Note: regex split puts capturing groups at odd indices
                if (i % 2 === 1) {
                    return (
                        <Box
                            component="span"
                            key={`${String(i)}-${part}`}
                            sx={numberBadgeSx}
                        >
                            {part}
                        </Box>
                    );
                }
                return part;
            })}
        </Typography>
    );
}

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
    const numberSize = size * NUMBER_SIZE_RATIO;

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
                        <PatternDescription text={pattern.description} />
                    </Box>
                </Box>
            ))}
        </Box>
    );
}
