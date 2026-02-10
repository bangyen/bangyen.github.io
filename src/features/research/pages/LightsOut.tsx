import React from 'react';

import { VerificationTools } from '../components/VerificationTools';
import { RESEARCH_CONSTANTS } from '../config/researchConfig';
import { RESEARCH_STYLES } from '../constants';
import ResearchDemo from '../ResearchDemo';

import { LaunchRounded } from '@/components/icons';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
} from '@/components/mui';
import { GlassCard } from '@/components/ui/GlassCard';
import { Latex } from '@/components/ui/Latex';
import { URLS, ROUTES } from '@/config/constants';
import { COLORS, SPACING, TYPOGRAPHY } from '@/config/theme';

interface PeriodicityData {
    n: number;
    z: number;
}

const periodicityData: PeriodicityData[] = [
    { n: 1, z: 3 },
    { n: 2, z: 2 },
    { n: 3, z: 12 },
    { n: 4, z: 10 },
    { n: 5, z: 24 },
    { n: 6, z: 18 },
    { n: 7, z: 24 },
    { n: 8, z: 14 },
    { n: 9, z: 60 },
    { n: 10, z: 62 },
];

const LightsOutResearch: React.FC = () => {
    const chartConfig = {
        type: 'line',
        xAxisKey: 'n',
        yAxisFormatter: (value: number) => value.toString(),
        yAxisDomain: ['0', String(RESEARCH_CONSTANTS.lightsOut.yAxisMax)],
        tooltipLabelFormatter: (value: number) =>
            `Grid Width n=${value.toString()}`,
        tooltipFormatter: (value: number): [string, string] => [
            value.toString(),
            'Period (z)',
        ],
        lines: [
            {
                dataKey: 'z',
                name: 'Period z',
                color: COLORS.primary.main,
            },
        ],
    };

    return (
        <ResearchDemo
            title="Lights Out"
            subtitle="The Mathematics of Grid Solving"
            githubUrl={URLS.githubProfile}
            chartData={periodicityData}
            chartConfig={chartConfig}
            chartTitle="Identity Matrix Periodicity"
            backUrl={ROUTES.pages.LightsOut}
        >
            <Box sx={{ mt: 6, textAlign: 'left' }}>
                <Typography
                    variant="h4"
                    sx={{
                        mb: 3,
                        fontWeight: TYPOGRAPHY.fontWeight.bold,
                        color: COLORS.text.primary,
                    }}
                >
                    Algorithm Overview
                </Typography>
                <Typography
                    variant="body1"
                    sx={{
                        mb: 3,
                        lineHeight: 1.8,
                        color: COLORS.text.secondary,
                    }}
                >
                    The solver models the Lights Out game using Linear Algebra
                    over the field <Latex formula="\mathbb{F}_2" /> (where 1 + 1
                    = 0). Instead of performing Gaussian elimination on a large
                    (mn) × (mn) matrix, this implementation uses
                    <strong> Light Chasing</strong> logic combined with{' '}
                    <strong>Fibonacci Polynomials</strong>.
                </Typography>

                <Box sx={{ mb: 6 }}>
                    <ol style={{ paddingLeft: '1.5rem', margin: 0 }}>
                        <li style={{ marginBottom: '1.5rem' }}>
                            <Typography
                                variant="body1"
                                sx={{ color: COLORS.text.secondary }}
                            >
                                <Box
                                    component="span"
                                    sx={{
                                        color: COLORS.text.primary,
                                        fontWeight:
                                            TYPOGRAPHY.fontWeight.semibold,
                                    }}
                                >
                                    Light Chasing:
                                </Box>{' '}
                                By efficiently chasing lights from the top row
                                to the bottom, the problem of solving the grid
                                is reduced to determining the correct moves for
                                the first row.
                            </Typography>
                        </li>
                        <li style={{ marginBottom: '1.5rem' }}>
                            <Typography
                                variant="body1"
                                sx={{ color: COLORS.text.secondary }}
                            >
                                <Box
                                    component="span"
                                    sx={{
                                        color: COLORS.text.primary,
                                        fontWeight:
                                            TYPOGRAPHY.fontWeight.semibold,
                                    }}
                                >
                                    Row Transfer Matrix:
                                </Box>{' '}
                                The effect of the first row on the configuration
                                of the (m+1)-th row (after chasing) is
                                determined by a linear recurrence relation. The
                                transformation matrix satisfies the recurrence
                                of Fibonacci polynomials.
                            </Typography>
                        </li>
                        <li style={{ marginBottom: '1.5rem' }}>
                            <Typography
                                variant="body1"
                                sx={{ color: COLORS.text.secondary }}
                            >
                                <Box
                                    component="span"
                                    sx={{
                                        color: COLORS.text.primary,
                                        fontWeight:
                                            TYPOGRAPHY.fontWeight.semibold,
                                    }}
                                >
                                    Solving:
                                </Box>{' '}
                                To solve a configuration, we construct the
                                matrix <Latex formula="A = F_{m+1}(T)" />, where{' '}
                                <Latex formula="T" /> is the transition matrix
                                for a single row. The solution for the first row
                                is then found by solving a linear system
                                involving <Latex formula="A" />.
                            </Typography>
                        </li>
                    </ol>
                </Box>

                <GlassCard
                    sx={{
                        mb: 6,
                        p: 4,
                        borderLeft: `4px solid ${COLORS.primary.main}`,
                    }}
                >
                    <Typography
                        variant="h4"
                        sx={{
                            mb: 2,
                            fontWeight: TYPOGRAPHY.fontWeight.bold,
                            color: COLORS.text.primary,
                        }}
                    >
                        Identity Matrix Property
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{ lineHeight: 1.8, color: COLORS.text.secondary }}
                    >
                        For certain grid dimensions (m × n), the solver
                        transformation behaves as an Identity Matrix over the
                        field <Latex formula="\mathbb{F}_2" />. This means that
                        if the grid is reduced to a state where only the top row
                        is active, the solution pattern required to clear the
                        grid is identical to that input pattern.
                    </Typography>
                </GlassCard>

                <Typography
                    variant="h4"
                    sx={{
                        mb: 3,
                        fontWeight: TYPOGRAPHY.fontWeight.bold,
                        color: COLORS.text.primary,
                    }}
                >
                    Mathematical Derivation
                </Typography>
                <Typography
                    variant="body1"
                    sx={{
                        mb: 4,
                        lineHeight: 1.8,
                        color: COLORS.text.secondary,
                    }}
                >
                    Let <Latex formula="A_n" /> be the adjacency matrix of the
                    path graph <Latex formula="P_n" />. The &quot;weights&quot;
                    correspond to the Fibonacci polynomials{' '}
                    <Latex formula="F_k(x)" />. The condition for the calculator
                    to act as the identity matrix is equivalent to:
                </Typography>

                <Box
                    sx={{
                        textAlign: 'center',
                        mb: 6,
                        py: 4,
                        background: RESEARCH_STYLES.GLASS.TRANSPARENT,
                        borderRadius: SPACING.borderRadius.md,
                    }}
                >
                    <Latex block formula="F_{n+1}(x) \mid (F_{m+1}(x+1) + 1)" />
                    <Typography
                        variant="caption"
                        sx={{
                            color: COLORS.text.secondary,
                            mt: 1,
                            display: 'block',
                        }}
                    >
                        (over the field <Latex formula="\mathbb{F}_2[x]" />)
                    </Typography>
                </Box>

                <Typography
                    variant="h4"
                    sx={{
                        mb: 3,
                        fontWeight: TYPOGRAPHY.fontWeight.bold,
                        color: COLORS.text.primary,
                    }}
                >
                    Proven Periodicity Patterns
                </Typography>
                <Typography
                    variant="body1"
                    sx={{ mb: 4, color: COLORS.text.secondary }}
                >
                    Mathematically proven for all grid heights m. Patterns are
                    expressed as <Latex formula="m \pmod z \in R_n" />.
                </Typography>

                <TableContainer
                    component={Paper}
                    sx={{
                        mb: 6,
                        background: RESEARCH_STYLES.GLASS.SUBTLE,
                        boxShadow: 'none',
                        borderRadius: SPACING.borderRadius.md,
                    }}
                >
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell
                                    sx={{
                                        color: COLORS.text.primary,
                                        fontWeight: 'bold',
                                    }}
                                >
                                    Columns (n)
                                </TableCell>
                                <TableCell
                                    sx={{
                                        color: COLORS.text.primary,
                                        fontWeight: 'bold',
                                    }}
                                >
                                    Period (z)
                                </TableCell>
                                <TableCell
                                    sx={{
                                        color: COLORS.text.primary,
                                        fontWeight: 'bold',
                                    }}
                                >
                                    Remainder Set (R)
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {[
                                { n: 1, z: 3, r: '{0, 1}' },
                                { n: 2, z: 2, r: '{0}' },
                                { n: 3, z: 12, r: '{0, 10}' },
                                { n: 4, z: 10, r: '{0, 8}' },
                                { n: 5, z: 24, r: '{0, 6, 16, 22}' },
                                { n: 6, z: 18, r: '{0, 16}' },
                                { n: 7, z: 24, r: '{0, 22}' },
                                { n: 8, z: 14, r: '{0, 12}' },
                                { n: 9, z: 60, r: '{0, 18, 40, 58}' },
                                { n: 10, z: 62, r: '{0, 60}' },
                            ].map(row => (
                                <TableRow key={row.n}>
                                    <TableCell
                                        sx={{ color: COLORS.text.secondary }}
                                    >
                                        {row.n}
                                    </TableCell>
                                    <TableCell
                                        sx={{ color: COLORS.text.secondary }}
                                    >
                                        {row.z}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            color: COLORS.text.secondary,
                                            fontFamily: 'monospace',
                                        }}
                                    >
                                        {row.r}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <VerificationTools />

                <Box sx={{ mb: 10 }}>
                    <Typography
                        variant="h4"
                        sx={{
                            mb: 3,
                            fontWeight: TYPOGRAPHY.fontWeight.bold,
                            color: COLORS.text.primary,
                        }}
                    >
                        References
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                        <Button
                            component="a"
                            href="https://math.stackexchange.com/questions/2237467"
                            target="_blank"
                            variant="outlined"
                            endIcon={<LaunchRounded />}
                            sx={{
                                borderColor: COLORS.border.subtle,
                                color: COLORS.text.primary,
                                '&:hover': {
                                    borderColor: COLORS.primary.main,
                                    backgroundColor: COLORS.interactive.hover,
                                },
                            }}
                        >
                            Stack Exchange Discussion
                        </Button>
                        <Button
                            component="a"
                            href="https://en.wikipedia.org/wiki/Fibonacci_polynomials"
                            target="_blank"
                            variant="outlined"
                            endIcon={<LaunchRounded />}
                            sx={{
                                borderColor: COLORS.border.subtle,
                                color: COLORS.text.primary,
                                '&:hover': {
                                    borderColor: COLORS.primary.main,
                                    backgroundColor: COLORS.interactive.hover,
                                },
                            }}
                        >
                            Wikipedia: Fibonacci Polynomials
                        </Button>
                        <Button
                            component="a"
                            href="https://graphics.stanford.edu/~seander/bithacks.html#CountBitsSetKernighan"
                            target="_blank"
                            variant="outlined"
                            endIcon={<LaunchRounded />}
                            sx={{
                                borderColor: COLORS.border.subtle,
                                color: COLORS.text.primary,
                                '&:hover': {
                                    borderColor: COLORS.primary.main,
                                    backgroundColor: COLORS.interactive.hover,
                                },
                            }}
                        >
                            Bit Twiddling Hacks
                        </Button>
                    </Box>
                </Box>
            </Box>
        </ResearchDemo>
    );
};

export default LightsOutResearch;
