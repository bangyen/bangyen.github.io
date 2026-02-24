import { Box, Typography } from '@mui/material';
import React, { useMemo } from 'react';

import { SlantCanvasBoard } from './SlantCanvasBoard';
import { PATTERNS } from '../config/patterns';

import { GameTextRenderer } from '@/components/ui/GameTextRenderer';
import { COLORS } from '@/config/theme';

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
};

const patternItemSx = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 0,
    width: '100%',
};

const patternBoardContainerSx = {
    width: '180px',
    display: 'flex',
    justifyContent: 'center',
    flexShrink: 0,
};

const patternTextSx = {
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
    flex: 1,
    minWidth: 0,
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CommonPatterns() {
    const size = 2.5; // Adjusted size for canvas boards to fit similar to before
    const emptySet = useMemo(() => new Set<string>(), []);

    return (
        <Box sx={patternContainerSx}>
            {PATTERNS.map(pattern => (
                <Box key={pattern.title} sx={patternItemSx}>
                    <Box sx={patternBoardContainerSx}>
                        <SlantCanvasBoard
                            grid={pattern.grid}
                            numbers={pattern.numbers}
                            satisfiedNodes={emptySet}
                            activeCell={null}
                            size={size}
                            lineWidth={8}
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
