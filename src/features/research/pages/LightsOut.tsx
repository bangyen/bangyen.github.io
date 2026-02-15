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
} from '@mui/material';
import React from 'react';

import { ResearchDemo } from '../components';
import { VerificationTools } from '../components/VerificationTools';
import {
    RESEARCH_CONSTANTS,
    researchHeadingSx,
    researchBodySx,
    researchLabelSx,
    researchLinkButtonSx,
    researchTableHeadCellSx,
    researchTableBodyCellSx,
} from '../config';
import { RESEARCH_STYLES } from '../config/constants';

import { LaunchRounded } from '@/components/icons';
import { GlassCard } from '@/components/ui/GlassCard';
const Latex = React.lazy(() =>
    import('@/components/ui/Latex').then(module => ({ default: module.Latex })),
);
import { URLS, ROUTES } from '@/config/constants';
import { COLORS, SPACING } from '@/config/theme';

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
            `Grid Width n = ${value.toString()} `,
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
                <Typography variant="h4" sx={researchHeadingSx}>
                    Algorithm Overview
                </Typography>
                <Typography variant="body1" sx={{ ...researchBodySx, mb: 3 }}>
                    The solver models the Lights Out game using Linear Algebra
                    over the field{' '}
                    <React.Suspense fallback="data">
                        <Latex formula="\mathbb{F}_2" />
                    </React.Suspense>{' '}
                    (where 1 + 1 = 0). Instead of performing Gaussian
                    elimination on a large (mn) × (mn) matrix, this
                    implementation uses
                    <strong> Light Chasing</strong> logic combined with{' '}
                    <strong>Fibonacci Polynomials</strong>.
                </Typography>

                <Box sx={{ mb: 6 }}>
                    <ol style={{ paddingLeft: '1.5rem', margin: 0 }}>
                        <li style={{ marginBottom: '1.5rem' }}>
                            <Typography variant="body1" sx={researchBodySx}>
                                <Box component="span" sx={researchLabelSx}>
                                    Light Chasing:
                                </Box>{' '}
                                By efficiently chasing lights from the top row
                                to the bottom, the problem of solving the grid
                                is reduced to determining the correct moves for
                                the first row.
                            </Typography>
                        </li>
                        <li style={{ marginBottom: '1.5rem' }}>
                            <Typography variant="body1" sx={researchBodySx}>
                                <Box component="span" sx={researchLabelSx}>
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
                            <Typography variant="body1" sx={researchBodySx}>
                                <Box component="span" sx={researchLabelSx}>
                                    Solving:
                                </Box>{' '}
                                To solve a configuration, we construct the
                                matrix{' '}
                                <React.Suspense fallback="A">
                                    <Latex formula="A = F_{m+1}(T)" />
                                </React.Suspense>
                                , where{' '}
                                <React.Suspense fallback="T">
                                    <Latex formula="T" />
                                </React.Suspense>{' '}
                                is the transition matrix for a single row. The
                                solution for the first row is then found by
                                solving a linear system involving{' '}
                                <React.Suspense fallback="A">
                                    <Latex formula="A" />
                                </React.Suspense>
                                .
                            </Typography>
                        </li>
                    </ol>
                </Box>

                <GlassCard
                    sx={{
                        mb: 6,
                        p: 4,
                        borderLeft: `4px solid ${COLORS.primary.main} `,
                    }}
                >
                    <Typography
                        variant="h4"
                        sx={{ ...researchHeadingSx, mb: 2 }}
                    >
                        Identity Matrix Property
                    </Typography>
                    <Typography variant="body1" sx={researchBodySx}>
                        For certain grid dimensions (m × n), the solver
                        transformation behaves as an Identity Matrix over the
                        field{' '}
                        <React.Suspense fallback="F2">
                            <Latex formula="\mathbb{F}_2" />
                        </React.Suspense>
                        . This means that if the grid is reduced to a state
                        where only the top row is active, the solution pattern
                        required to clear the grid is identical to that input
                        pattern.
                    </Typography>
                </GlassCard>

                <Typography variant="h4" sx={researchHeadingSx}>
                    Mathematical Derivation
                </Typography>
                <Typography variant="body1" sx={{ ...researchBodySx, mb: 4 }}>
                    Let{' '}
                    <React.Suspense fallback="An">
                        <Latex formula="A_n" />
                    </React.Suspense>{' '}
                    be the adjacency matrix of the path graph{' '}
                    <React.Suspense fallback="Pn">
                        <Latex formula="P_n" />
                    </React.Suspense>
                    . The &quot;weights&quot; correspond to the Fibonacci
                    polynomials{' '}
                    <React.Suspense fallback="Fk(x)">
                        <Latex formula="F_k(x)" />
                    </React.Suspense>
                    . The condition for the calculator to act as the identity
                    matrix is equivalent to:
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
                    <React.Suspense fallback="Formula...">
                        <Latex
                            block
                            formula="F_{n+1}(x) \mid (F_{m+1}(x+1) + 1)"
                        />
                    </React.Suspense>
                    <Typography
                        variant="caption"
                        sx={{
                            color: COLORS.text.secondary,
                            mt: 1,
                            display: 'block',
                        }}
                    >
                        (over the field{' '}
                        <React.Suspense fallback="F2[x]">
                            <Latex formula="\mathbb{F}_2[x]" />
                        </React.Suspense>
                        )
                    </Typography>
                </Box>

                <Typography variant="h4" sx={researchHeadingSx}>
                    Proven Periodicity Patterns
                </Typography>
                <Typography variant="body1" sx={{ ...researchBodySx, mb: 4 }}>
                    Mathematically proven for all grid heights m. Patterns are
                    expressed as{' '}
                    <React.Suspense fallback="m mod z in Rn">
                        <Latex formula="m \pmod z \in R_n" />
                    </React.Suspense>
                    .
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
                                <TableCell sx={researchTableHeadCellSx}>
                                    Columns (n)
                                </TableCell>
                                <TableCell sx={researchTableHeadCellSx}>
                                    Period (z)
                                </TableCell>
                                <TableCell sx={researchTableHeadCellSx}>
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
                                    <TableCell sx={researchTableBodyCellSx}>
                                        {row.n}
                                    </TableCell>
                                    <TableCell sx={researchTableBodyCellSx}>
                                        {row.z}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            ...researchTableBodyCellSx,
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
                    <Typography variant="h4" sx={researchHeadingSx}>
                        References
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                        <Button
                            component="a"
                            href="https://math.stackexchange.com/questions/2237467"
                            target="_blank"
                            variant="outlined"
                            endIcon={<LaunchRounded />}
                            sx={researchLinkButtonSx}
                        >
                            Stack Exchange Discussion
                        </Button>
                        <Button
                            component="a"
                            href="https://en.wikipedia.org/wiki/Fibonacci_polynomials"
                            target="_blank"
                            variant="outlined"
                            endIcon={<LaunchRounded />}
                            sx={researchLinkButtonSx}
                        >
                            Wikipedia: Fibonacci Polynomials
                        </Button>
                        <Button
                            component="a"
                            href="https://graphics.stanford.edu/~seander/bithacks.html#CountBitsSetKernighan"
                            target="_blank"
                            variant="outlined"
                            endIcon={<LaunchRounded />}
                            sx={researchLinkButtonSx}
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
