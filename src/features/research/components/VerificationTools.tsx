import React, { useState } from 'react';
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
import { HelpOutlineRounded } from '../../../components/icons';
import { COLORS, SPACING, TYPOGRAPHY } from '../../../config/theme';
import { GlassCard } from '../../../components/ui/GlassCard';
import {
    getMatrix,
    getPolynomial,
    evalPolynomial,
    findPattern,
    Pattern,
    getKernelBasis,
    getImageMapping,
    getMinWeightSolution,
    getMinimalPolynomial,
    factorPoly,
    polyToString,
    toSuperscript,
} from '../../games/lights-out/matrices';

const PeriodicityCalculator: React.FC = () => {
    const [cols, setCols] = useState<string>('5');
    const [result, setResult] = useState<{
        pattern: Pattern;
        minimalPoly: string;
        factorization: string;
    } | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleCalculate = () => {
        const n = parseInt(cols, 10);
        if (isNaN(n) || n <= 0) {
            setError('Please enter a valid positive integer.');
            return;
        }

        if (n > 20) {
            setError('Calculating periodicity for n > 20 might take a while.');
        }

        setLoading(true);
        setError(null);

        // Run in timeout to prevent UI freeze
        setTimeout(() => {
            try {
                const pattern = findPattern(n);
                const A = getMatrix(n);
                const M = getMinimalPolynomial(A);
                const factors = factorPoly(M);

                setResult({
                    pattern,
                    minimalPoly: polyToString(M),
                    factorization: factors
                        .map(
                            f =>
                                `(${polyToString(f.factor)})${f.exponent > 1 ? toSuperscript(f.exponent) : ''}`
                        )
                        .join(' · '),
                });
            } catch (_err) {
                setError('Could not find period within reasonable limits.');
            } finally {
                setLoading(false);
            }
        }, 100);
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
            <Button
                fullWidth
                variant="contained"
                onClick={handleCalculate}
                disabled={loading}
                sx={{
                    backgroundColor: COLORS.primary.main,
                    '&:hover': { backgroundColor: COLORS.primary.dark },
                }}
            >
                {loading ? 'Calculating...' : 'Discover Patterns'}
            </Button>

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

    const handleAnalyze = () => {
        const size = parseInt(n, 10);
        if (isNaN(size) || size < 1) {
            setError('Please enter a valid positive integer.');
            return;
        }

        if (size > 32) {
            setError('Grid size n > 32 is computationally expensive.');
            return;
        }

        setLoading(true);
        setError(null);

        // Timeout to allow loading state to show
        setTimeout(() => {
            try {
                const rows = size;
                const cols = size;
                const A = getMatrix(cols);
                const Pn = getPolynomial(rows + 1);
                const matrix = evalPolynomial(A, Pn);
                const kernel = getKernelBasis(matrix, cols);
                const nullity = kernel.length;
                const rank = cols - nullity;
                const totalCells = rows * cols;
                const gridRank = totalCells - nullity;

                const formatLarge = (n: number) => {
                    if (n < 50) {
                        const val = 1n << BigInt(n);
                        return val.toLocaleString();
                    }
                    return `2^${n.toString()}`;
                };

                const imageBasis = getImageMapping(matrix, cols);
                const rankTotal = imageBasis.length;
                const useFullSubspace = rankTotal <= 6 && rankTotal > 0; // Show all if <= 64 states

                const mapping: { state: string; toggle: string }[] = [];

                if (useFullSubspace) {
                    const count = 1 << rankTotal;
                    for (let i = 1; i < count; i++) {
                        let combinedState = 0n;
                        for (let j = 0; j < rankTotal; j++) {
                            if ((i >> j) & 1) {
                                const basis = imageBasis[j];
                                if (basis) {
                                    combinedState ^= basis.state;
                                }
                            }
                        }
                        const minToggle = getMinWeightSolution(
                            matrix,
                            combinedState,
                            cols
                        );
                        mapping.push({
                            state: combinedState
                                .toString(2)
                                .padStart(cols, '0'),
                            toggle: minToggle.toString(2).padStart(cols, '0'),
                        });
                    }
                    // Sort by state for consistency
                    mapping.sort((a, b) => a.state.localeCompare(b.state));
                } else {
                    imageBasis.forEach(m => {
                        const minToggle = getMinWeightSolution(
                            matrix,
                            m.state,
                            cols
                        );
                        mapping.push({
                            state: m.state.toString(2).padStart(cols, '0'),
                            toggle: minToggle.toString(2).padStart(cols, '0'),
                        });
                    });
                }

                setResult({
                    rank,
                    nullity,
                    gridRank,
                    solvablePercent: ((1 / Math.pow(2, nullity)) * 100).toFixed(
                        nullity === 0 ? 0 : 2
                    ),
                    quietPatterns: kernel.map(k =>
                        k.toString(2).padStart(cols, '0')
                    ),
                    totalStates: formatLarge(totalCells),
                    reachableStates: formatLarge(gridRank),
                    imageMapping: mapping,
                    isFullSubspace: useFullSubspace,
                });
            } catch (_err) {
                setError('An error occurred during calculation.');
            } finally {
                setLoading(false);
            }
        }, 50);
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
            <Button
                fullWidth
                variant="contained"
                onClick={handleAnalyze}
                sx={{
                    backgroundColor: COLORS.primary.main,
                    '&:hover': { backgroundColor: COLORS.primary.dark },
                }}
            >
                Analyze Solvability
            </Button>

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
                                                        }}
                                                    >
                                                        {p}
                                                    </Box>
                                                ))}
                                            </Box>
                                        </Box>
                                    </Box>
                                )}

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
                                            ? 'Reachable States (Full Subspace)'
                                            : 'Image Basis (Minimal Toggles)'}
                                    </Typography>
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
                                                        fontFamily: 'monospace',
                                                        fontSize: '0.65rem',
                                                        p: 0.75,
                                                        backgroundColor:
                                                            'rgba(0,0,0,0.2)',
                                                        borderRadius: '4px',
                                                        color: COLORS.text
                                                            .primary,
                                                        border: '1px solid rgba(255,255,255,0.03)',
                                                        display: 'flex',
                                                        justifyContent:
                                                            'center',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    <Box
                                                        component="span"
                                                        sx={{
                                                            color: COLORS
                                                                .primary.light,
                                                        }}
                                                    >
                                                        {m.toggle}
                                                    </Box>
                                                    <Box
                                                        component="span"
                                                        sx={{
                                                            color: COLORS.text
                                                                .secondary,
                                                            mx: 2,
                                                        }}
                                                    >
                                                        →
                                                    </Box>
                                                    <Box
                                                        component="span"
                                                        sx={{
                                                            color: COLORS.data
                                                                .green,
                                                        }}
                                                    >
                                                        {m.state}
                                                    </Box>
                                                </Box>
                                            ))}
                                        </Box>
                                    </Box>
                                </Box>
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
