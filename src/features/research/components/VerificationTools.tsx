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
    Divider,
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
} from '../../games/lights-out/matrices';

const PeriodicityCalculator: React.FC = () => {
    const [cols, setCols] = useState<string>('5');
    const [pattern, setPattern] = useState<Pattern | null>(null);
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
                const result = findPattern(n);
                setPattern(result);
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

            <Box sx={{ height: 240, mt: 3 }}>
                {!pattern && !error && !loading && (
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
                {pattern && (
                    <Fade in={true}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 2.5,
                                height: '100%',
                                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                                borderRadius: SPACING.borderRadius.md,
                                border: `1px solid ${COLORS.primary.main}33`,
                                position: 'relative',
                                overflow: 'hidden',
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '4px',
                                    height: '100%',
                                    backgroundColor: COLORS.primary.main,
                                },
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'baseline',
                                    mb: 2,
                                }}
                            >
                                <Typography
                                    variant="h5"
                                    sx={{
                                        color: COLORS.primary.main,
                                        fontWeight: 'bold',
                                        letterSpacing: -0.5,
                                    }}
                                >
                                    z = {pattern.z}
                                </Typography>
                            </Box>

                            <Divider
                                sx={{
                                    mb: 1.5,
                                    borderColor: 'rgba(255,255,255,0.05)',
                                }}
                            />

                            <Typography
                                variant="caption"
                                sx={{
                                    color: COLORS.text.secondary,
                                    fontWeight: 'bold',
                                    display: 'block',
                                    mb: 0.5,
                                    textTransform: 'uppercase',
                                    letterSpacing: 1,
                                }}
                            >
                                Valid Remainders (R)
                            </Typography>

                            <Box
                                sx={{
                                    p: 1.25,
                                    backgroundColor: 'rgba(0,0,0,0.3)',
                                    borderRadius: '8px',
                                    fontFamily: 'monospace',
                                    fontSize: '0.8rem',
                                    color: COLORS.primary.light,
                                    wordBreak: 'break-all',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    mb: 1.5,
                                }}
                            >
                                {`{ ${pattern.R.join(', ')} }`}
                            </Box>

                            <Box sx={{ mt: 'auto' }}>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: COLORS.text.secondary,
                                        fontStyle: 'italic',
                                        display: 'block',
                                    }}
                                >
                                    Invariant: m mod {pattern.z} ∈ R
                                </Typography>
                            </Box>
                        </Paper>
                    </Fade>
                )}
            </Box>
        </Box>
    );
};

const SolvabilityAnalyzer: React.FC = () => {
    const [m, setM] = useState<string>('5');
    const [n, setN] = useState<string>('5');
    const [result, setResult] = useState<{
        rank: number;
        nullity: number;
        solvablePercent: string;
        quietPatterns: string[];
    } | null>(null);

    const [error, setError] = useState<string | null>(null);

    const handleAnalyze = () => {
        const rows = parseInt(m, 10);
        const cols = parseInt(n, 10);
        if (isNaN(rows) || isNaN(cols) || rows < 1 || cols < 1) {
            setError('Please enter valid positive integers.');
            return;
        }

        if (cols > 32) {
            setError('Column width n > 32 is computationally expensive.');
            return;
        }

        setError(null);
        try {
            const A = getMatrix(cols);
            const Pn = getPolynomial(rows + 1);
            const matrix = evalPolynomial(A, Pn);
            const kernel = getKernelBasis(matrix, cols);
            const nullity = kernel.length;
            const rank = cols - nullity;

            setResult({
                rank,
                nullity,
                solvablePercent: ((1 / Math.pow(2, nullity)) * 100).toFixed(
                    nullity === 0 ? 0 : 2
                ),
                quietPatterns: kernel.map(k =>
                    k.toString(2).padStart(cols, '0')
                ),
            });
        } catch (_err) {
            setError('An error occurred during calculation.');
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
                <Tooltip title="Analyze the solvability and kernel properties for a given m x n grid.">
                    <IconButton
                        size="small"
                        sx={{ ml: 1, color: COLORS.text.secondary }}
                    >
                        <HelpOutlineRounded fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Box>
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={{ xs: 6 }}>
                    <TextField
                        fullWidth
                        label="Rows (m)"
                        variant="outlined"
                        value={m}
                        onChange={e => {
                            setM(e.target.value);
                        }}
                        size="small"
                        sx={{ input: { color: COLORS.text.primary } }}
                    />
                </Grid>
                <Grid size={{ xs: 6 }}>
                    <TextField
                        fullWidth
                        label="Cols (n)"
                        variant="outlined"
                        value={n}
                        onChange={e => {
                            setN(e.target.value);
                        }}
                        size="small"
                        sx={{ input: { color: COLORS.text.primary } }}
                    />
                </Grid>
            </Grid>
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

            <Box sx={{ height: 240, mt: 3 }}>
                {!result && !error && (
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
                {result && (
                    <Fade in={true}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 2.25,
                                height: '100%',
                                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                                borderRadius: SPACING.borderRadius.md,
                                border: `1px solid ${result.nullity === 0 ? COLORS.data.green : COLORS.primary.main}33`,
                                position: 'relative',
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column',
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '4px',
                                    height: '100%',
                                    backgroundColor:
                                        result.nullity === 0
                                            ? COLORS.data.green
                                            : COLORS.primary.main,
                                },
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    mb: 1.5,
                                }}
                            >
                                <Typography
                                    variant="h5"
                                    sx={{
                                        color:
                                            result.nullity === 0
                                                ? COLORS.data.green
                                                : COLORS.text.primary,
                                        fontWeight: 'bold',
                                        letterSpacing: -0.5,
                                    }}
                                >
                                    Solvability: {result.solvablePercent}%
                                </Typography>
                            </Box>

                            <Grid container spacing={2} sx={{ mb: 1.25 }}>
                                <Grid size={{ xs: 6 }}>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: COLORS.text.secondary,
                                            display: 'block',
                                            fontSize: '0.7rem',
                                        }}
                                    >
                                        Rank
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontWeight: 'bold',
                                            color: COLORS.text.primary,
                                        }}
                                    >
                                        {result.rank}
                                    </Typography>
                                </Grid>
                                <Grid size={{ xs: 6 }}>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: COLORS.text.secondary,
                                            display: 'block',
                                            fontSize: '0.7rem',
                                        }}
                                    >
                                        Nullity
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontWeight: 'bold',
                                            color: COLORS.text.primary,
                                        }}
                                    >
                                        {result.nullity}
                                    </Typography>
                                </Grid>
                            </Grid>

                            <Divider
                                sx={{
                                    mb: 1.25,
                                    borderColor: 'rgba(255,255,255,0.05)',
                                }}
                            />

                            {result.quietPatterns.length > 0 ? (
                                <Box sx={{ flexGrow: 1, minHeight: 0 }}>
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
                                        Quiet Patterns
                                    </Typography>
                                    <Box
                                        sx={{
                                            maxHeight: 70,
                                            overflowY: 'auto',
                                            pr: 1,
                                            '&::-webkit-scrollbar': {
                                                width: '3px',
                                            },
                                            '&::-webkit-scrollbar-thumb': {
                                                backgroundColor:
                                                    'rgba(255,255,255,0.1)',
                                                borderRadius: '3px',
                                            },
                                        }}
                                    >
                                        {result.quietPatterns.map(p => (
                                            <Box
                                                key={p}
                                                sx={{
                                                    fontFamily: 'monospace',
                                                    fontSize: '0.7rem',
                                                    p: 0.75,
                                                    mb: 0.5,
                                                    backgroundColor:
                                                        'rgba(0,0,0,0.2)',
                                                    borderRadius: '4px',
                                                    color: COLORS.primary.light,
                                                    letterSpacing: 1,
                                                    border: '1px solid rgba(255,255,255,0.03)',
                                                }}
                                            >
                                                {p}
                                            </Box>
                                        ))}
                                    </Box>
                                </Box>
                            ) : (
                                <Box
                                    sx={{
                                        mt: 'auto',
                                        display: 'flex',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: COLORS.data.green,
                                            fontStyle: 'italic',
                                            fontSize: '0.8rem',
                                        }}
                                    >
                                        Fully solvable (Nullity = 0)
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
            <Grid container={true} spacing={4}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <GlassCard
                        sx={{
                            p: 3,
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            minHeight: { md: 380 },
                            backgroundColor: 'rgba(255, 255, 255, 0.02)',
                        }}
                    >
                        <PeriodicityCalculator />
                    </GlassCard>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <GlassCard
                        sx={{
                            p: 3,
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            minHeight: { md: 380 },
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
