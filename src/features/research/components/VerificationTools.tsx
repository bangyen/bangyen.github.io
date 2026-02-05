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
} from '../../../components/mui';
import { HelpOutlineRounded, RefreshRounded } from '../../../components/icons';
import { COLORS, SPACING, TYPOGRAPHY } from '../../../config/theme';
import { GlassCard } from '../../../components/ui/GlassCard';
import {
    getMatrix,
    getPolynomial,
    evalPolynomial,
    isIdentity,
    findPattern,
    Pattern,
    getKernelBasis,
    calculateGodsNumber,
    GodsNumberResult,
} from '../../games/lights-out/matrices';

const IdentityVerifier: React.FC = () => {
    const [rows, setRows] = useState<string>('12');
    const [cols, setCols] = useState<string>('3');
    const [result, setResult] = useState<{
        passed: boolean;
        message: string;
    } | null>(null);

    const handleVerify = () => {
        const r = parseInt(rows, 10);
        const c = parseInt(cols, 10);

        if (isNaN(r) || isNaN(c) || r <= 0 || c <= 0) {
            setResult({
                passed: false,
                message: 'Please enter valid positive integers.',
            });
            return;
        }

        if (c > 32) {
            setResult({
                passed: false,
                message:
                    'Column width n > 32 is computationally expensive for this demo.',
            });
            return;
        }

        try {
            const matrix = getMatrix(c);
            const weights = getPolynomial(r + 1);
            const product = evalPolynomial(matrix, weights);
            const passed = isIdentity(product);

            setResult({
                passed,
                message: passed
                    ? `Success! ${r.toString()}x${c.toString()} grid satisfies the Identity Matrix property.`
                    : `The ${r.toString()}x${c.toString()} grid does NOT satisfy the Identity Matrix property.`,
            });
        } catch (_error) {
            setResult({
                passed: false,
                message: 'An error occurred during calculation.',
            });
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
                    Identity Verifier
                </Typography>
                <Tooltip title="Check if a specific grid dimension (m x n) results in the Identity Matrix property.">
                    <IconButton
                        size="small"
                        sx={{ ml: 1, color: COLORS.text.secondary }}
                    >
                        <HelpOutlineRounded fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Box>
            <Grid container={true} spacing={2} sx={{ mb: 3 }}>
                <Grid size={{ xs: 6 }}>
                    <TextField
                        fullWidth
                        label="Rows (m)"
                        variant="outlined"
                        value={rows}
                        onChange={e => {
                            setRows(e.target.value);
                        }}
                        size="small"
                        sx={{ input: { color: COLORS.text.primary } }}
                    />
                </Grid>
                <Grid size={{ xs: 6 }}>
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
                onClick={handleVerify}
                sx={{
                    mb: 2,
                    backgroundColor: COLORS.primary.main,
                    '&:hover': { backgroundColor: COLORS.primary.dark },
                }}
            >
                Verify Property
            </Button>
            <Box sx={{ minHeight: 200, mt: 2 }}>
                {result && (
                    <Alert
                        severity={result.passed ? 'success' : 'info'}
                        sx={{
                            backgroundColor: result.passed
                                ? 'rgba(76, 175, 80, 0.1)'
                                : 'rgba(33, 150, 243, 0.1)',
                            color: result.passed ? '#81c784' : '#64b5f6',
                            border: `1px solid ${result.passed ? '#2e7d32' : '#1976d2'}`,
                            '& .MuiAlert-icon': {
                                color: result.passed ? '#81c784' : '#64b5f6',
                            },
                        }}
                    >
                        {result.message}
                    </Alert>
                )}
            </Box>
        </Box>
    );
};

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
                <Tooltip title="Calculate the period (z) and valid row remainders (R) for a given column width (n).">
                    <IconButton
                        size="small"
                        sx={{ ml: 1, color: COLORS.text.secondary }}
                    >
                        <HelpOutlineRounded fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
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
                <Button
                    variant="outlined"
                    onClick={handleCalculate}
                    disabled={loading}
                    sx={{
                        minWidth: 'fit-content',
                        borderColor: COLORS.primary.main,
                        color: COLORS.primary.main,
                        '&:hover': {
                            borderColor: COLORS.primary.dark,
                            backgroundColor: 'rgba(25, 118, 210, 0.04)',
                        },
                    }}
                >
                    {loading ? '...' : <RefreshRounded />}
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Box sx={{ minHeight: 200, mt: 2 }}>
                {pattern && (
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2,
                            height: '100%',
                            backgroundColor: 'rgba(255, 255, 255, 0.03)',
                            borderRadius: SPACING.borderRadius.sm,
                            border: `1px solid ${COLORS.border.subtle}`,
                        }}
                    >
                        <Typography
                            variant="body2"
                            sx={{ color: COLORS.text.secondary, mb: 1 }}
                        >
                            <Box
                                component="span"
                                sx={{
                                    color: COLORS.text.primary,
                                    fontWeight: 'bold',
                                }}
                            >
                                Period (z):
                            </Box>{' '}
                            {pattern.z}
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{ color: COLORS.text.secondary }}
                        >
                            <Box
                                component="span"
                                sx={{
                                    color: COLORS.text.primary,
                                    fontWeight: 'bold',
                                }}
                            >
                                Remainders (R):
                            </Box>
                            <Box
                                sx={{
                                    mt: 1,
                                    p: 1,
                                    backgroundColor: 'rgba(0,0,0,0.2)',
                                    borderRadius: '4px',
                                    fontFamily: 'monospace',
                                    fontSize: '0.8rem',
                                    wordBreak: 'break-all',
                                }}
                            >
                                {`{${pattern.R.join(', ')}}`}
                            </Box>
                        </Typography>
                        <Typography
                            variant="caption"
                            sx={{
                                display: 'block',
                                mt: 1,
                                color: COLORS.text.secondary,
                                fontStyle: 'italic',
                            }}
                        >
                            Formula: m mod {pattern.z} ∈ R
                        </Typography>
                    </Paper>
                )}
            </Box>
        </Box>
    );
};

const GodsNumberCalculator: React.FC = () => {
    const [n, setN] = useState<string>('3');
    const [result, setResult] = useState<GodsNumberResult | null>(null);
    const [loading, setLoading] = useState(false);

    const handleCalculate = () => {
        const size = parseInt(n, 10);
        if (isNaN(size) || size < 1 || size > 5) {
            return;
        }

        setLoading(true);
        setTimeout(() => {
            try {
                const res = calculateGodsNumber(size);
                setResult(res);
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
                    God&apos;s Number Calculator
                </Typography>
                <Tooltip title="Calculate the minimum number of moves required to solve any solvable configuration (God's Number). Limited to n <= 5.">
                    <IconButton
                        size="small"
                        sx={{ ml: 1, color: COLORS.text.secondary }}
                    >
                        <HelpOutlineRounded fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <TextField
                    fullWidth
                    label="Grid Size (n x n)"
                    variant="outlined"
                    value={n}
                    onChange={e => {
                        setN(e.target.value);
                    }}
                    size="small"
                    sx={{ input: { color: COLORS.text.primary } }}
                    placeholder="1-5"
                />
                <Button
                    variant="contained"
                    onClick={handleCalculate}
                    disabled={loading}
                    sx={{
                        backgroundColor: COLORS.primary.main,
                        '&:hover': { backgroundColor: COLORS.primary.dark },
                    }}
                >
                    {loading ? '...' : 'Calculate'}
                </Button>
            </Box>

            <Box sx={{ minHeight: 200, mt: 2 }}>
                {result && (
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2,
                            height: '100%',
                            backgroundColor: 'rgba(255, 255, 255, 0.03)',
                            borderRadius: SPACING.borderRadius.sm,
                            border: `1px solid ${COLORS.border.subtle}`,
                        }}
                    >
                        <Grid container spacing={1}>
                            <Grid size={{ xs: 6 }}>
                                <Typography
                                    variant="caption"
                                    sx={{ color: COLORS.text.secondary }}
                                >
                                    God&apos;s Number
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        color: COLORS.primary.main,
                                        fontWeight: 'bold',
                                    }}
                                >
                                    {result.godsNumber}
                                </Typography>
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                                <Typography
                                    variant="caption"
                                    sx={{ color: COLORS.text.secondary }}
                                >
                                    Reachable States
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{ color: COLORS.text.primary }}
                                >
                                    2^{result.n * result.n - result.nullity}
                                </Typography>
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                                <Typography
                                    variant="caption"
                                    sx={{ color: COLORS.text.secondary }}
                                >
                                    Kernel Dim
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{ color: COLORS.text.primary }}
                                >
                                    {result.nullity}
                                </Typography>
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                                <Typography
                                    variant="caption"
                                    sx={{ color: COLORS.text.secondary }}
                                >
                                    Total States
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        color: COLORS.text.secondary,
                                        fontSize: '0.8rem',
                                    }}
                                >
                                    2^{result.n * result.n}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Paper>
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

    const handleAnalyze = () => {
        const rows = parseInt(m, 10);
        const cols = parseInt(n, 10);
        if (isNaN(rows) || isNaN(cols) || rows < 1 || cols < 1 || cols > 32)
            return;

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
            quietPatterns: kernel.map(k => k.toString(2).padStart(cols, '0')),
        });
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
                <Tooltip title="Analyze the solvability of an m x n grid based on the kernel of the transformation matrix.">
                    <IconButton
                        size="small"
                        sx={{ ml: 1, color: COLORS.text.secondary }}
                    >
                        <HelpOutlineRounded fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Box>
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={{ xs: 5 }}>
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
                <Grid size={{ xs: 5 }}>
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
                <Grid size={{ xs: 2 }}>
                    <Button
                        fullWidth
                        variant="contained"
                        onClick={handleAnalyze}
                        sx={{
                            height: '100%',
                            minWidth: 0,
                            p: 0,
                            backgroundColor: COLORS.primary.main,
                            '&:hover': { backgroundColor: COLORS.primary.dark },
                        }}
                    >
                        Go
                    </Button>
                </Grid>
            </Grid>

            <Box sx={{ minHeight: 200, mt: 2 }}>
                {result && (
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2,
                            height: '100%',
                            backgroundColor: 'rgba(255, 255, 255, 0.03)',
                            borderRadius: SPACING.borderRadius.sm,
                            border: `1px solid ${COLORS.border.subtle}`,
                        }}
                    >
                        <Typography
                            variant="body2"
                            sx={{ mb: 1, color: COLORS.text.secondary }}
                        >
                            <Box
                                component="span"
                                sx={{
                                    fontWeight: 'bold',
                                    color: COLORS.text.primary,
                                }}
                            >
                                Solvable:
                            </Box>{' '}
                            {result.solvablePercent}%
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{ mb: 1, color: COLORS.text.secondary }}
                        >
                            <Box
                                component="span"
                                sx={{
                                    fontWeight: 'bold',
                                    color: COLORS.text.primary,
                                }}
                            >
                                Rank:
                            </Box>{' '}
                            {result.rank} |{' '}
                            <Box
                                component="span"
                                sx={{
                                    fontWeight: 'bold',
                                    color: COLORS.text.primary,
                                }}
                            >
                                Nullity:
                            </Box>{' '}
                            {result.nullity}
                        </Typography>
                        {result.quietPatterns.length > 0 && (
                            <Box sx={{ mt: 2 }}>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: COLORS.primary.main,
                                        fontWeight: 'bold',
                                        display: 'block',
                                        mb: 0.5,
                                    }}
                                >
                                    Quiet Patterns (Kernel Basis):
                                </Typography>
                                <Box
                                    sx={{
                                        maxHeight: 120,
                                        overflowY: 'auto',
                                        pr: 1,
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
                                    {result.quietPatterns.map(p => (
                                        <Box
                                            key={p}
                                            sx={{
                                                fontFamily: 'monospace',
                                                fontSize: '0.75rem',
                                                p: 0.5,
                                                mb: 0.5,
                                                backgroundColor:
                                                    'rgba(0,0,0,0.2)',
                                                borderRadius: '4px',
                                                color: COLORS.text.secondary,
                                                wordBreak: 'break-all',
                                            }}
                                        >
                                            {p}
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                        )}
                    </Paper>
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
                            minHeight: { md: 400 },
                            backgroundColor: 'rgba(255, 255, 255, 0.02)',
                        }}
                    >
                        <IdentityVerifier />
                    </GlassCard>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <GlassCard
                        sx={{
                            p: 3,
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            minHeight: { md: 400 },
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
                            minHeight: { md: 400 },
                            backgroundColor: 'rgba(255, 255, 255, 0.02)',
                        }}
                    >
                        <GodsNumberCalculator />
                    </GlassCard>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <GlassCard
                        sx={{
                            p: 3,
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            minHeight: { md: 320 },
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
