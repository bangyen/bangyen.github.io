import {
    Box,
    Typography,
    TextField,
    Button,
    Grid,
    Paper,
    Alert,
    Tooltip,
    IconButton,
    Fade,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import React, { useState, useCallback } from 'react';

import { MathText } from './MathText';
import { useWorker } from '../../../hooks';
import type { Pattern } from '../../games/lights-out/utils/matrices';
import { RESEARCH_STYLES } from '../config/constants';

import { HelpOutlineRounded, CloseRounded } from '@/components/icons';
import { COLORS, SPACING, TYPOGRAPHY } from '@/config/theme';

export const PeriodicityCalculator: React.FC = () => {
    const [cols, setCols] = useState<string>('5');
    const createWorker = useCallback(
        () =>
            new Worker(
                new URL('../workers/periodicity.worker.ts', import.meta.url),
                { type: 'module' },
            ),
        [],
    );

    const { result, loading, error, run, terminate, setError } = useWorker<
        { n: number },
        {
            pattern: Pattern;
            minimalPoly: string;
            factorization: string;
            proof?: {
                eq1: string;
                res1: string;
                eq2: string;
                res2: string;
            };
        }
    >(createWorker);

    const handleCalculate = () => {
        const n = Number.parseInt(cols, 10);
        if (isNaN(n) || n <= 0) {
            setError('Please enter a valid positive integer.');
            return;
        }

        if (n > 30) {
            setError('Grid size n > 30 is too computationally intensive.');
            return;
        }

        run({ n });
    };

    const handleCancel = () => {
        terminate();
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography
                    variant="h6"
                    sx={{
                        color: COLORS.text.primary,
                        fontWeight: TYPOGRAPHY.fontWeight.bold,
                    }}
                >
                    Periodicity Calculator
                </Typography>
                <Tooltip title="Calculate the period (z) and row remainders (R) for a given column width (n).">
                    <IconButton
                        size="small"
                        sx={{ ml: 1, color: COLORS.text.secondary }}
                        aria-label="Periodicity calculator documentation"
                    >
                        <HelpOutlineRounded fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Box>
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12 }}>
                    <TextField
                        fullWidth
                        label="Columns (n)"
                        variant="outlined"
                        value={cols}
                        onChange={e => {
                            setCols(e.target.value);
                        }}
                        size="small"
                        sx={{ input: { color: COLORS.text.primary } }}
                    />
                </Grid>
            </Grid>
            {loading ? (
                <Button
                    fullWidth
                    variant="outlined"
                    onClick={handleCancel}
                    startIcon={<CloseRounded />}
                    sx={{
                        color: COLORS.text.secondary,
                        borderColor: COLORS.border.subtle,
                        height: RESEARCH_STYLES.LAYOUT.BUTTON_HEIGHT,
                        '&:hover': {
                            backgroundColor: RESEARCH_STYLES.GLASS.SLIGHT,
                            borderColor: COLORS.text.secondary,
                        },
                    }}
                >
                    Cancel Calculation
                </Button>
            ) : (
                <Button
                    fullWidth
                    variant="contained"
                    onClick={handleCalculate}
                    sx={{
                        backgroundColor: COLORS.primary.main,
                        border: '1px solid transparent',
                        height: RESEARCH_STYLES.LAYOUT.BUTTON_HEIGHT,
                        '&:hover': { backgroundColor: COLORS.primary.dark },
                    }}
                >
                    Discover Patterns
                </Button>
            )}

            {error && (
                <Alert severity="error" sx={{ mb: 2, mt: 2 }}>
                    {error}
                </Alert>
            )}

            <Box
                sx={{
                    height: RESEARCH_STYLES.LAYOUT.RESULT_CARD_HEIGHT,
                    mt: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                }}
            >
                {loading && (
                    <Box
                        sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 2,
                            border: `1px dashed ${COLORS.border.subtle}`,
                            borderRadius: SPACING.borderRadius.md,
                            backgroundColor: RESEARCH_STYLES.GLASS.VERY_SUBTLE,
                        }}
                    >
                        <Box
                            sx={{
                                width: 40,
                                height: 40,
                                borderRadius: '50%',
                                border: `2px solid ${alpha(COLORS.primary.main, 0.1)}`,
                                borderTopColor: COLORS.primary.main,
                                ...RESEARCH_STYLES.ANIMATIONS.SPIN,
                            }}
                        />
                        <Typography
                            variant="caption"
                            sx={{ color: COLORS.text.secondary }}
                        >
                            Calculating Patterns...
                        </Typography>
                    </Box>
                )}
                {!result && !error && !loading && (
                    <Box
                        sx={{
                            height: '100%',
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'center',
                            pt: 5,
                            px: 3,
                            border: `1px dashed ${COLORS.border.subtle}`,
                            borderRadius: SPACING.borderRadius.md,
                            backgroundColor: RESEARCH_STYLES.GLASS.VERY_SUBTLE,
                        }}
                    >
                        <Typography
                            variant="body2"
                            sx={{
                                color: COLORS.text.secondary,
                                fontStyle: 'italic',
                                textAlign: 'center',
                            }}
                        >
                            Select column width and click discover to see
                            results
                        </Typography>
                    </Box>
                )}
                {result && !loading && (
                    <Fade in={true}>
                        <Paper
                            elevation={0}
                            sx={{
                                height: '100%',
                                backgroundColor:
                                    RESEARCH_STYLES.GLASS.TRANSPARENT,
                                borderRadius: SPACING.borderRadius.md,
                                border: `1px solid ${alpha(COLORS.primary.main, 0.2)}`,
                                borderLeft: `4px solid ${COLORS.primary.main}`,
                                display: 'flex',
                                flexDirection: 'column',
                                overflow: 'hidden',
                            }}
                        >
                            <Box sx={{ p: 2.25, pb: 0 }}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        mb: 2,
                                        pb: 1.5,
                                        borderBottom: `1px solid ${RESEARCH_STYLES.BORDER.SUBTLE}`,
                                    }}
                                >
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: COLORS.primary.main,
                                            fontWeight:
                                                TYPOGRAPHY.fontWeight.bold,
                                            textTransform: 'uppercase',
                                            letterSpacing: 1,
                                        }}
                                    >
                                        Spectral Periodicity
                                    </Typography>
                                    <Typography
                                        sx={{
                                            color: COLORS.text.primary,
                                            fontFamily: 'monospace',
                                            fontWeight:
                                                TYPOGRAPHY.fontWeight.bold,
                                            fontSize:
                                                RESEARCH_STYLES.LAYOUT
                                                    .FONT_SIZE_SM,
                                        }}
                                    >
                                        z ={' '}
                                        {
                                            (
                                                result.pattern as unknown as {
                                                    z: number;
                                                }
                                            ).z
                                        }
                                    </Typography>
                                </Box>
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 2.5,
                                    flexGrow: 1,
                                    minHeight: 0,
                                    overflowY: 'auto',
                                    p: 2.25,
                                    pt: 0,
                                    '&::-webkit-scrollbar': {
                                        width: '4px',
                                    },
                                    '&::-webkit-scrollbar-thumb': {
                                        backgroundColor:
                                            RESEARCH_STYLES.GLASS.MEDIUM,
                                        borderRadius: SPACING.borderRadius.xs,
                                    },
                                }}
                            >
                                <Box sx={{ minWidth: 0 }}>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: COLORS.primary.main,
                                            fontWeight: 'bold',
                                            display: 'block',
                                            mb: 0.5,
                                            textTransform: 'uppercase',
                                            letterSpacing: 1,
                                            fontSize: '0.65rem',
                                        }}
                                    >
                                        Remainder Set (R)
                                    </Typography>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: 1,
                                            mb: 1.5,
                                        }}
                                    >
                                        {(
                                            result.pattern as unknown as {
                                                R: number[];
                                            }
                                        ).R.map((r: number) => (
                                            <Box
                                                key={r}
                                                sx={{
                                                    fontFamily: 'monospace',
                                                    fontSize: '0.7rem',
                                                    px: 1.25,
                                                    py: 0.5,
                                                    backgroundColor:
                                                        RESEARCH_STYLES.GLASS
                                                            .DARK,
                                                    borderRadius:
                                                        SPACING.borderRadius.xs,
                                                    color: COLORS.primary.main,
                                                    border: `1px solid ${RESEARCH_STYLES.BORDER.VERY_SUBTLE}`,
                                                }}
                                            >
                                                {r}
                                            </Box>
                                        ))}
                                    </Box>
                                </Box>

                                <Box sx={{ minWidth: 0 }}>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: COLORS.primary.main,
                                            fontWeight: 'bold',
                                            display: 'block',
                                            mb: 0.5,
                                            textTransform: 'uppercase',
                                            letterSpacing: 1,
                                            fontSize: '0.65rem',
                                        }}
                                    >
                                        Minimal Polynomial M(x)
                                    </Typography>
                                    <Box
                                        sx={{
                                            p: 1.25,
                                            backgroundColor:
                                                RESEARCH_STYLES.CYAN.BG_SUBTLE,
                                            borderRadius:
                                                RESEARCH_STYLES.LAYOUT
                                                    .CARD_RADIUS,
                                            fontFamily: 'monospace',
                                            fontSize: '0.75rem',
                                            color: COLORS.text.primary,
                                            border: `1px solid ${RESEARCH_STYLES.CYAN.BORDER_SUBTLE}`,
                                            mb: 1.5,
                                        }}
                                    >
                                        <MathText text={result.minimalPoly} />
                                    </Box>

                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: COLORS.primary.main,
                                            fontWeight: 'bold',
                                            display: 'block',
                                            mb: 0.5,
                                            textTransform: 'uppercase',
                                            letterSpacing: 1,
                                            fontSize: '0.65rem',
                                        }}
                                    >
                                        Factorization
                                    </Typography>
                                    <Box
                                        sx={{
                                            p: 1.25,
                                            backgroundColor:
                                                RESEARCH_STYLES.CYAN.BG_SUBTLE,
                                            borderRadius:
                                                RESEARCH_STYLES.LAYOUT
                                                    .CARD_RADIUS,
                                            fontFamily: 'monospace',
                                            fontSize: '0.75rem',
                                            color: COLORS.text.primary,
                                            border: `1px solid ${RESEARCH_STYLES.CYAN.BORDER_SUBTLE}`,
                                        }}
                                    >
                                        <MathText text={result.factorization} />
                                    </Box>
                                </Box>

                                {result.proof && (
                                    <Box sx={{ minWidth: 0 }}>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: COLORS.primary.main,
                                                fontWeight:
                                                    TYPOGRAPHY.fontWeight.bold,
                                                display: 'block',
                                                mb: 0.5,
                                                textTransform: 'uppercase',
                                                letterSpacing: 1,
                                                fontSize:
                                                    RESEARCH_STYLES.LAYOUT
                                                        .FONT_SIZE_XS,
                                            }}
                                        >
                                            Mathematical Certificate
                                        </Typography>
                                        <Box
                                            sx={{
                                                p: 1.25,
                                                backgroundColor:
                                                    RESEARCH_STYLES.CYAN
                                                        .BG_SUBTLE,
                                                borderRadius:
                                                    RESEARCH_STYLES.LAYOUT
                                                        .CARD_RADIUS,
                                                fontFamily: 'monospace',
                                                fontSize: '0.75rem',
                                                color: COLORS.text.primary,
                                                border: `1px solid ${RESEARCH_STYLES.CYAN.BORDER_SUBTLE}`,
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent:
                                                        'space-between',
                                                    mb: 0.5,
                                                }}
                                            >
                                                <span>
                                                    <MathText
                                                        text={result.proof.eq1}
                                                    />
                                                </span>
                                                <span
                                                    style={{
                                                        color: COLORS.data
                                                            .green,
                                                        fontWeight:
                                                            TYPOGRAPHY
                                                                .fontWeight
                                                                .bold,
                                                    }}
                                                >
                                                    ={' '}
                                                    <MathText
                                                        text={result.proof.res1}
                                                    />
                                                </span>
                                            </Box>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent:
                                                        'space-between',
                                                }}
                                            >
                                                <span>
                                                    <MathText
                                                        text={result.proof.eq2}
                                                    />
                                                </span>
                                                <span
                                                    style={{
                                                        color: COLORS.data
                                                            .green,
                                                        fontWeight:
                                                            TYPOGRAPHY
                                                                .fontWeight
                                                                .bold,
                                                    }}
                                                >
                                                    ={' '}
                                                    <MathText
                                                        text={result.proof.res2}
                                                    />
                                                </span>
                                            </Box>
                                        </Box>
                                    </Box>
                                )}
                            </Box>
                        </Paper>
                    </Fade>
                )}
            </Box>
        </Box>
    );
};
