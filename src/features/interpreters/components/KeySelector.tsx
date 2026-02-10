import React from 'react';

import { Box, Button, Grid } from '@/components/mui';
import { COLORS, SPACING } from '@/config/theme';

interface KeySelectorProps {
    keys: string[];
    onSelect: (key: string) => void;
}

export const KeySelector = ({ keys, onSelect }: KeySelectorProps) => {
    return (
        <Box
            sx={{
                width: '100%',
                padding: '16px',
                background: COLORS.surface.glass,
                borderTop: `1px solid ${COLORS.border.subtle}`,
                backdropFilter: 'blur(24px) saturate(180%)',
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1,
            }}
        >
            <Grid
                container
                spacing={0.5}
                justifyContent="center"
                sx={{
                    maxWidth: '468px', // (9 * 44) + (8 * 4) + some buffer = 396 + 32 = 428. 468 allows some room.
                    width: '100%',
                }}
            >
                {keys.map(key => (
                    <Grid key={key}>
                        <Button
                            variant="contained"
                            onClick={() => {
                                onSelect(key);
                            }}
                            sx={{
                                minWidth: '44px',
                                width: '44px',
                                height: '44px',
                                padding: 0,
                                background: COLORS.surface.glass,
                                color: COLORS.text.primary,
                                borderRadius: SPACING.borderRadius.sm,
                                border: `1px solid ${COLORS.border.subtle}`,
                                '&:hover': {
                                    background: COLORS.interactive.hover,
                                },
                            }}
                        >
                            {key === ' ' ? '␣' : key}
                        </Button>
                    </Grid>
                ))}
                <Grid>
                    <Button
                        variant="contained"
                        onClick={() => {
                            onSelect('Backspace');
                        }}
                        sx={{
                            minWidth: '44px',
                            width: '44px',
                            height: '44px',
                            padding: 0,
                            background: COLORS.surface.glass,
                            color: COLORS.text.primary,
                            borderRadius: SPACING.borderRadius.sm,
                            border: `1px solid ${COLORS.border.subtle}`,
                            '&:hover': {
                                background: COLORS.interactive.hover,
                            },
                        }}
                    >
                        ⌫
                    </Button>
                </Grid>
                <Grid>
                    <Button
                        variant="contained"
                        onClick={() => {
                            onSelect('Escape');
                        }}
                        sx={{
                            minWidth: '44px',
                            width: '44px',
                            height: '44px',
                            padding: 0,
                            background: COLORS.surface.glass,
                            color: COLORS.data.red,
                            borderRadius: SPACING.borderRadius.sm,
                            border: `1px solid ${COLORS.border.subtle}`,
                            '&:hover': {
                                background: COLORS.interactive.hover,
                            },
                        }}
                    >
                        ✕
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};
