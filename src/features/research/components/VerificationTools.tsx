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

            {pattern && (
                <Paper
                    elevation={0}
                    sx={{
                        p: 2,
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
    );
};

export const VerificationTools: React.FC = () => {
    return (
        <Box sx={{ mt: 4 }}>
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
                            backgroundColor: 'rgba(255, 255, 255, 0.02)',
                        }}
                    >
                        <PeriodicityCalculator />
                    </GlassCard>
                </Grid>
            </Grid>
        </Box>
    );
};
