import React from 'react';

import { Refresh } from '@/components/icons';
import { Box, Typography, Button } from '@/components/mui';
import { CustomGrid } from '@/components/ui/CustomGrid';
import { COLORS } from '@/config/theme';

interface InfoCalculatorProps {
    cols: number;
    size: number;
    isMobile: boolean;
    inputProps: (row: number, col: number) => Record<string, unknown>;
    outputProps: (row: number, col: number) => Record<string, unknown>;
    onReset: () => void;
}

export function InfoCalculator({
    cols,
    size,
    isMobile,
    inputProps,
    outputProps,
    onReset,
}: InfoCalculatorProps) {
    return (
        <Box
            sx={{
                animation: 'fadeIn 0.3s ease',
                textAlign: 'center',
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
                    gap: 3,
                }}
            >
                <Box>
                    <Typography
                        variant="subtitle2"
                        sx={{
                            mb: 1,
                            color: COLORS.text.primary,
                            fontWeight: 'bold',
                        }}
                    >
                        Input{' '}
                        <Box
                            component="span"
                            sx={{
                                color: COLORS.text.secondary,
                                fontWeight: 'normal',
                            }}
                        >
                            (Bottom Row)
                        </Box>
                    </Typography>
                    <CustomGrid
                        space={0}
                        rows={1}
                        cols={cols}
                        size={size * (isMobile ? 0.9 : 0.8)}
                        cellProps={inputProps}
                    />
                </Box>

                <Box>
                    <Typography
                        variant="subtitle2"
                        sx={{
                            mb: 1,
                            color: COLORS.text.primary,
                            fontWeight: 'bold',
                        }}
                    >
                        Solution{' '}
                        <Box
                            component="span"
                            sx={{
                                color: COLORS.text.secondary,
                                fontWeight: 'normal',
                            }}
                        >
                            (Top Row)
                        </Box>
                    </Typography>
                    <CustomGrid
                        space={0}
                        rows={1}
                        cols={cols}
                        size={size * (isMobile ? 0.9 : 0.8)}
                        cellProps={outputProps}
                    />
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                    }}
                >
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Refresh />}
                        onClick={onReset}
                        sx={{
                            borderColor: COLORS.border.subtle,
                            color: COLORS.text.secondary,
                        }}
                    >
                        Clear Pattern
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}
