import React, { useState, useEffect, useRef } from 'react';
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
} from '../../../components/mui';
import { HelpOutlineRounded, CloseRounded } from '../../../components/icons';
import { COLORS, SPACING, TYPOGRAPHY } from '../../../config/theme';
import { GlassCard } from '../../../components/ui/GlassCard';
import { Pattern } from '../../games/lights-out/matrices';

interface WorkerResponse<T> {
    success: boolean;
    result?: T;
    error?: string;
}

const PeriodicityCalculator: React.FC = () => {
    const [cols, setCols] = useState<string>('5');
    const [result, setResult] = useState<{
        pattern: Pattern;
        minimalPoly: string;
        factorization: string;
        proof?: {
            eq1: string;
            res1: string;
            eq2: string;
            res2: string;
        };
    } | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const workerRef = useRef<Worker | null>(null);

    useEffect(() => {
        return () => {
            if (workerRef.current) {
                workerRef.current.terminate();
            }
        };
    }, []);

    const handleCalculate = () => {
        const n = parseInt(cols, 10);
        if (isNaN(n) || n <= 0) {
            setError('Please enter a valid positive integer.');
            return;
        }

        if (n > 30) {
            setError('Grid size n > 30 is too computationally intensive.');
            return;
        }

        setLoading(true);
        setError(null);

        if (workerRef.current) {
            workerRef.current.terminate();
        }

        try {
            workerRef.current = new Worker(
                new URL('../workers/periodicity.worker.ts', import.meta.url),
                { type: 'module' }
            );

            workerRef.current.onmessage = (
                e: MessageEvent<
                    WorkerResponse<{
                        pattern: Pattern;
                        minimalPoly: string;
                        factorization: string;
                        proof?: {
                            eq1: string;
                            res1: string;
                            eq2: string;
                            res2: string;
                        };
                    }>
                >
            ) => {
                const { success, result, error } = e.data;
                if (success && result) {
                    setResult(result);
                } else {
                    setError(error ?? 'An unknown error occurred.');
                }
                setLoading(false);
            };

            workerRef.current.onerror = e => {
                // eslint-disable-next-line no-console
                console.error('Worker error:', e);
                setError('An error occurred in the background worker.');
                setLoading(false);
            };

            workerRef.current.postMessage({ n });
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('Failed to start worker:', err);
            setError('Failed to start calculation worker.');
            setLoading(false);
        }
    };

    const handleCancel = () => {
        if (workerRef.current) {
            workerRef.current.terminate();
            workerRef.current = null;
        }
        setLoading(false);
        setError(null);
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
            {!loading ? (
                <Button
                    fullWidth
                    variant="contained"
                    onClick={handleCalculate}
                    sx={{
                        backgroundColor: COLORS.primary.main,
                        border: '1px solid transparent',
                        height: '36.5px',
                        '&:hover': { backgroundColor: COLORS.primary.dark },
                    }}
                >
                    Discover Patterns
                </Button>
            ) : (
                <Button
                    fullWidth
                    variant="outlined"
                    onClick={handleCancel}
                    startIcon={<CloseRounded />}
                    sx={{
                        color: COLORS.text.secondary,
                        borderColor: COLORS.border.subtle,
                        height: '36.5px',
                        '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            borderColor: COLORS.text.secondary,
                        },
                    }}
                >
                    Cancel Calculation
                </Button>
            )}

            {error && (
                <Alert severity="error" sx={{ mb: 2, mt: 2 }}>
                    {error}
                </Alert>
            )}

            <Box
                sx={{
                    height: 480,
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
                            backgroundColor: 'rgba(255, 255, 255, 0.01)',
                        }}
                    >
                        <Box
                            sx={{
                                width: 40,
                                height: 40,
                                borderRadius: '50%',
                                border: `2px solid ${COLORS.primary.main}22`,
                                borderTopColor: COLORS.primary.main,
                                animation: 'spin 1s linear infinite',
                                '@keyframes spin': {
                                    '0%': { transform: 'rotate(0deg)' },
                                    '100%': { transform: 'rotate(360deg)' },
                                },
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
                            backgroundColor: 'rgba(255, 255, 255, 0.01)',
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
                                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                                borderRadius: SPACING.borderRadius.md,
                                border: `1px solid ${COLORS.primary.main}33`,
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
                                        borderBottom:
                                            '1px solid rgba(255,255,255,0.05)',
                                    }}
                                >
                                    <Box>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: COLORS.primary.main,
                                                fontWeight: 'bold',
                                                textTransform: 'uppercase',
                                                letterSpacing: 1,
                                                display: 'block',
                                                lineHeight: 1,
                                                mb: 0.5,
                                            }}
                                        >
                                            Spectral Periodicity
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: COLORS.text.secondary,
                                                fontSize: '0.65rem',
                                            }}
                                        >
                                            Period z = {result.pattern.z}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ textAlign: 'right' }}>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: COLORS.text.primary,
                                                fontFamily: 'monospace',
                                                fontWeight: 'bold',
                                                fontSize: '0.75rem',
                                            }}
                                        >
                                            z_seq: {result.pattern.z_seq}
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: COLORS.primary.light,
                                                fontSize: '0.65rem',
                                                display: 'block',
                                            }}
                                        >
                                            Property: m mod z ∈ R
                                        </Typography>
                                    </Box>
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
                                            'rgba(255,255,255,0.1)',
                                        borderRadius: '4px',
                                    },
                                }}
                            >
                                <Box sx={{ minWidth: 0 }}>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: COLORS.primary.light,
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
                                        {result.pattern.R.map(r => (
                                            <Box
                                                key={r}
                                                sx={{
                                                    fontFamily: 'monospace',
                                                    fontSize: '0.7rem',
                                                    px: 1,
                                                    py: 0.5,
                                                    backgroundColor:
                                                        'rgba(0,184,212,0.1)',
                                                    borderRadius: '4px',
                                                    color: COLORS.primary.light,
                                                    border: '1px solid rgba(0,184,212,0.2)',
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
                                            backgroundColor: 'rgba(0,0,0,0.2)',
                                            borderRadius: '6px',
                                            fontFamily: 'monospace',
                                            fontSize: '0.75rem',
                                            color: COLORS.text.primary,
                                            border: '1px solid rgba(255,255,255,0.03)',
                                            mb: 1.5,
                                        }}
                                    >
                                        {result.minimalPoly}
                                    </Box>

                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: COLORS.text.secondary,
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
                                    <Typography
                                        sx={{
                                            fontFamily: 'monospace',
                                            fontSize: '0.75rem',
                                            color: COLORS.primary.light,
                                            pl: 1,
                                        }}
                                    >
                                        {result.factorization}
                                    </Typography>
                                </Box>

                                {result.proof && (
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
                                            Mathematical Certificate
                                        </Typography>
                                        <Box
                                            sx={{
                                                p: 1.25,
                                                backgroundColor:
                                                    'rgba(0,184,212,0.05)',
                                                borderRadius: '6px',
                                                fontFamily: 'monospace',
                                                fontSize: '0.7rem',
                                                color: COLORS.text.secondary,
                                                border: '1px solid rgba(0,184,212,0.1)',
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
                                                <span>{result.proof.eq1}</span>
                                                <span
                                                    style={{
                                                        color: COLORS.data
                                                            .green,
                                                        fontWeight: 'bold',
                                                    }}
                                                >
                                                    = {result.proof.res1}
                                                </span>
                                            </Box>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent:
                                                        'space-between',
                                                }}
                                            >
                                                <span>{result.proof.eq2}</span>
                                                <span
                                                    style={{
                                                        color: COLORS.data
                                                            .green,
                                                        fontWeight: 'bold',
                                                    }}
                                                >
                                                    = {result.proof.res2}
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

const SolvabilityAnalyzer: React.FC = () => {
    const [n, setN] = useState<string>('5');
    const [result, setResult] = useState<{
        rank: number;
        nullity: number;
        gridRank: number;
        solvablePercent: string;
        quietPatterns: string[];
        totalStates: string;
        reachableStates: string;
        imageMapping: { state: string; toggle: string }[];
        isFullSubspace: boolean;
    } | null>(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const workerRef = useRef<Worker | null>(null);

    useEffect(() => {
        return () => {
            if (workerRef.current) {
                workerRef.current.terminate();
            }
        };
    }, []);

    const handleCancel = () => {
        if (workerRef.current) {
            workerRef.current.terminate();
            workerRef.current = null;
        }
        setLoading(false);
        setError(null);
    };

    const handleAnalyze = () => {
        const size = parseInt(n, 10);
        if (isNaN(size) || size < 1) {
            setError('Please enter a valid positive integer.');
            return;
        }

        if (size > 100) {
            setError('Grid size n > 100 is too computationally intensive.');
            return;
        }

        setLoading(true);
        setError(null);

        if (workerRef.current) {
            workerRef.current.terminate();
        }

        try {
            workerRef.current = new Worker(
                new URL('../workers/solvability.worker.ts', import.meta.url),
                { type: 'module' }
            );

            workerRef.current.onmessage = (
                e: MessageEvent<
                    WorkerResponse<{
                        rank: number;
                        nullity: number;
                        gridRank: number;
                        solvablePercent: string;
                        quietPatterns: string[];
                        totalStates: string;
                        reachableStates: string;
                        imageMapping: { state: string; toggle: string }[];
                        isFullSubspace: boolean;
                    }>
                >
            ) => {
                const { success, result, error } = e.data;
                if (success && result) {
                    setResult(result);
                } else {
                    setError(error ?? 'An unknown error occurred.');
                }
                setLoading(false);
            };

            workerRef.current.onerror = e => {
                // eslint-disable-next-line no-console
                console.error('Worker error:', e);
                setError('An error occurred in the background worker.');
                setLoading(false);
            };

            workerRef.current.postMessage({ n: size });
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('Failed to start worker:', err);
            setError('Failed to start calculation worker.');
            setLoading(false);
        }
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
                    Solvability Analyzer
                </Typography>
                <Tooltip title="Analyze the solvability and kernel properties for a square n x n grid.">
                    <IconButton
                        size="small"
                        sx={{ ml: 1, color: COLORS.text.secondary }}
                    >
                        <HelpOutlineRounded fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Box>
            <Box sx={{ mb: 3 }}>
                <TextField
                    fullWidth
                    label="Grid Size (n)"
                    variant="outlined"
                    value={n}
                    onChange={e => {
                        setN(e.target.value);
                    }}
                    size="small"
                    sx={{ input: { color: COLORS.text.primary } }}
                />
            </Box>
            {!loading ? (
                <Button
                    fullWidth
                    variant="contained"
                    onClick={handleAnalyze}
                    sx={{
                        backgroundColor: COLORS.primary.main,
                        border: '1px solid transparent',
                        height: '36.5px',
                        '&:hover': { backgroundColor: COLORS.primary.dark },
                    }}
                >
                    Analyze Solvability
                </Button>
            ) : (
                <Button
                    fullWidth
                    variant="outlined"
                    onClick={handleCancel}
                    startIcon={<CloseRounded />}
                    sx={{
                        color: COLORS.text.secondary,
                        borderColor: COLORS.border.subtle,
                        height: '36.5px',
                        '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            borderColor: COLORS.text.secondary,
                        },
                    }}
                >
                    Cancel Analysis
                </Button>
            )}

            {error && (
                <Alert severity="error" sx={{ mb: 2, mt: 2 }}>
                    {error}
                </Alert>
            )}

            <Box
                sx={{
                    height: 480,
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
                            backgroundColor: 'rgba(255, 255, 255, 0.01)',
                        }}
                    >
                        <Box
                            sx={{
                                width: 40,
                                height: 40,
                                borderRadius: '50%',
                                border: `2px solid ${COLORS.primary.main}22`,
                                borderTopColor: COLORS.primary.main,
                                animation: 'spin 1s linear infinite',
                                '@keyframes spin': {
                                    '0%': { transform: 'rotate(0deg)' },
                                    '100%': { transform: 'rotate(360deg)' },
                                },
                            }}
                        />
                        <Typography
                            variant="caption"
                            sx={{ color: COLORS.text.secondary }}
                        >
                            Performing Algebraic Matrix Analysis...
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
                            backgroundColor: 'rgba(255, 255, 255, 0.01)',
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
                            Select grid dimensions and click analyze to see
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
                                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                                borderRadius: SPACING.borderRadius.md,
                                border: `1px solid ${result.nullity === 0 ? COLORS.data.green : COLORS.primary.main}33`,
                                borderLeft: `4px solid ${
                                    result.nullity === 0
                                        ? COLORS.data.green
                                        : COLORS.primary.main
                                }`,
                                position: 'relative',
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
                                        borderBottom:
                                            '1px solid rgba(255,255,255,0.05)',
                                    }}
                                >
                                    <Box>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: COLORS.primary.main,
                                                fontWeight: 'bold',
                                                textTransform: 'uppercase',
                                                letterSpacing: 1,
                                                display: 'block',
                                                lineHeight: 1,
                                                mb: 0.5,
                                            }}
                                        >
                                            Subspace Analysis
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: COLORS.text.secondary,
                                                fontSize: '0.65rem',
                                            }}
                                        >
                                            {result.reachableStates} Solvable
                                            States
                                        </Typography>
                                    </Box>
                                    <Box sx={{ textAlign: 'right' }}>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: COLORS.text.primary,
                                                fontFamily: 'monospace',
                                                fontWeight: 'bold',
                                                fontSize: '0.75rem',
                                            }}
                                        >
                                            Rank: {result.gridRank} | Null:{' '}
                                            {result.nullity}
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color:
                                                    result.nullity === 0
                                                        ? COLORS.data.green
                                                        : COLORS.primary.light,
                                                fontSize: '0.65rem',
                                                display: 'block',
                                            }}
                                        >
                                            Solvability:{' '}
                                            {result.solvablePercent}%
                                        </Typography>
                                    </Box>
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
                                            'rgba(255,255,255,0.1)',
                                        borderRadius: '4px',
                                    },
                                }}
                            >
                                {result.quietPatterns.length > 0 && (
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
                                            Quiet Patterns (Kernel)
                                        </Typography>
                                        <Box
                                            sx={{
                                                pr: 1,
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    flexWrap: 'wrap',
                                                    gap: 1,
                                                }}
                                            >
                                                {result.quietPatterns.map(p => (
                                                    <Box
                                                        key={p}
                                                        sx={{
                                                            fontFamily:
                                                                'monospace',
                                                            fontSize: '0.65rem',
                                                            px: 1,
                                                            py: 0.5,
                                                            backgroundColor:
                                                                'rgba(0,0,0,0.2)',
                                                            borderRadius: '4px',
                                                            color: COLORS
                                                                .primary.light,
                                                            letterSpacing: 1,
                                                            border: '1px solid rgba(255,255,255,0.03)',
                                                            wordBreak:
                                                                'break-all',
                                                        }}
                                                    >
                                                        {p}
                                                    </Box>
                                                ))}
                                            </Box>
                                        </Box>
                                    </Box>
                                )}

                                {result.imageMapping.length > 0 && (
                                    <Box
                                        sx={{
                                            minWidth: 0,
                                            flexGrow: 1,
                                            display: 'flex',
                                            flexDirection: 'column',
                                        }}
                                    >
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: COLORS.data.green,
                                                fontWeight: 'bold',
                                                display: 'block',
                                                mb: 0.5,
                                                textTransform: 'uppercase',
                                                letterSpacing: 1,
                                                fontSize: '0.65rem',
                                            }}
                                        >
                                            {result.isFullSubspace
                                                ? 'Chasing Table'
                                                : 'Image Basis'}
                                        </Typography>

                                        <Box
                                            sx={{
                                                display: 'flex',
                                                px: 1,
                                                mb: 0.5,
                                            }}
                                        >
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    flex: 1,
                                                    color: COLORS.text
                                                        .secondary,
                                                    fontSize: '0.55rem',
                                                    fontWeight: 'bold',
                                                    letterSpacing: 0.5,
                                                }}
                                            >
                                                BOTTOM RESIDUAL
                                            </Typography>
                                            <Box sx={{ width: 25 }} />
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    flex: 1,
                                                    color: COLORS.text
                                                        .secondary,
                                                    fontSize: '0.55rem',
                                                    fontWeight: 'bold',
                                                    letterSpacing: 0.5,
                                                    textAlign: 'right',
                                                }}
                                            >
                                                TOP CORRECTION
                                            </Typography>
                                        </Box>

                                        <Box
                                            sx={{
                                                pr: 1,
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: 0.5,
                                                }}
                                            >
                                                {result.imageMapping.map(m => (
                                                    <Box
                                                        key={m.state}
                                                        sx={{
                                                            fontFamily:
                                                                'monospace',
                                                            fontSize: '0.65rem',
                                                            p: 0.75,
                                                            px: 1,
                                                            backgroundColor:
                                                                'rgba(0,0,0,0.2)',
                                                            borderRadius: '4px',
                                                            color: COLORS.text
                                                                .primary,
                                                            border: '1px solid rgba(255,255,255,0.03)',
                                                            display: 'flex',
                                                            justifyContent:
                                                                'space-between',
                                                            alignItems:
                                                                'center',
                                                        }}
                                                    >
                                                        <Box
                                                            component="span"
                                                            sx={{
                                                                color: COLORS
                                                                    .data.green,
                                                                flex: 1,
                                                                wordBreak:
                                                                    'break-all',
                                                            }}
                                                        >
                                                            {m.state}
                                                        </Box>
                                                        <Box
                                                            component="span"
                                                            sx={{
                                                                color: COLORS
                                                                    .text
                                                                    .secondary,
                                                                mx: 1,
                                                            }}
                                                        >
                                                            →
                                                        </Box>
                                                        <Box
                                                            component="span"
                                                            sx={{
                                                                color: COLORS
                                                                    .primary
                                                                    .light,
                                                                flex: 1,
                                                                textAlign:
                                                                    'right',
                                                                wordBreak:
                                                                    'break-all',
                                                            }}
                                                        >
                                                            {m.toggle}
                                                        </Box>
                                                    </Box>
                                                ))}
                                                {!result.isFullSubspace && (
                                                    <Box
                                                        sx={{
                                                            p: 1,
                                                            textAlign: 'center',
                                                        }}
                                                    >
                                                        <Typography
                                                            variant="caption"
                                                            sx={{
                                                                color: COLORS
                                                                    .text
                                                                    .secondary,
                                                                fontStyle:
                                                                    'italic',
                                                                fontSize:
                                                                    '0.6rem',
                                                            }}
                                                        >
                                                            ... and other
                                                            reachable
                                                            combinations
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </Box>
                                        </Box>
                                    </Box>
                                )}
                            </Box>
                            {result.quietPatterns.length === 0 && (
                                <Box
                                    sx={{
                                        p: 1.5,
                                        px: 2.25,
                                        backgroundColor:
                                            'rgba(0, 200, 83, 0.05)',
                                        borderTop:
                                            '1px solid rgba(0, 200, 83, 0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: COLORS.data.green,
                                            fontStyle: 'italic',
                                            fontSize: '0.75rem',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        ✓ GRID IS FULLY SOLVABLE (Nullity = 0)
                                    </Typography>
                                </Box>
                            )}
                        </Paper>
                    </Fade>
                )}
            </Box>
        </Box>
    );
};

export const VerificationTools: React.FC = () => {
    return (
        <Box sx={{ mt: 4, mb: 10 }}>
            <Typography
                variant="h5"
                sx={{
                    mb: 3,
                    fontWeight: TYPOGRAPHY.fontWeight.bold,
                    color: COLORS.text.primary,
                }}
            >
                Verification Tools
            </Typography>
            <Grid container={true} spacing={4} sx={{ alignItems: 'stretch' }}>
                <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex' }}>
                    <GlassCard
                        sx={{
                            p: 3,
                            flexGrow: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            backgroundColor: 'rgba(255, 255, 255, 0.02)',
                        }}
                    >
                        <PeriodicityCalculator />
                    </GlassCard>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex' }}>
                    <GlassCard
                        sx={{
                            p: 3,
                            flexGrow: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            backgroundColor: 'rgba(255, 255, 255, 0.02)',
                        }}
                    >
                        <SolvabilityAnalyzer />
                    </GlassCard>
                </Grid>
            </Grid>
        </Box>
    );
};
