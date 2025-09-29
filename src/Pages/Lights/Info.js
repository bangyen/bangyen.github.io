import { useState, useCallback, useEffect } from 'react';
import { Backdrop, Typography, Card, CardContent, Box } from '@mui/material';
import {
    CircleRounded,
    KeyboardArrowDown,
    Calculate,
    Replay,
} from '@mui/icons-material';
import Grid from '@mui/material/Grid2';
import {
    SPACING,
    COLORS,
    TYPOGRAPHY,
    COMPONENTS,
} from '../../config/constants';

import { getProduct } from './matrices';
import { CustomGrid } from '../../helpers';
import { useGetters } from '../Board';
import { useMobile } from '../../hooks';
import Example from './Example';

function getInput(getters, toggleTile) {
    const { getColor, getBorder } = getters;

    return (r, c) => {
        const { front, back } = getColor(r, c);

        return {
            backgroundColor: front,
            style: getBorder(r, c),
            onClick: toggleTile(c),
            sx: {
                '&:hover': {
                    cursor: 'pointer',
                    color: back,
                },
            },
            color: front,
            children: <CircleRounded />,
        };
    };
}

function getOutput({ getColor, getBorder }) {
    return (r, c) => {
        const { front } = getColor(r, c);

        return {
            backgroundColor: front,
            style: getBorder(r, c),
        };
    };
}

function useHandler(row, size, palette) {
    const getTile = useCallback(
        (r, c) => {
            if (r !== 0 || c < 0 || c >= size) return -1;

            return row[c];
        },
        [row, size]
    );

    return useGetters(getTile, palette);
}

export default function Info(props) {
    const { rows, cols, size, open, score, palette, toggleOpen } = props;
    const isMobile = useMobile('md');

    const [row, setRow] = useState(Array(cols).fill(0));

    useEffect(() => {
        const newRow = Array(cols).fill(0);

        setRow(newRow);
    }, [cols, palette]);

    const res = getProduct(row, rows, cols);

    const toggleTile = col => event => {
        event.stopPropagation();

        const newRow = [...row];
        newRow[col] ^= 1;
        setRow(newRow);
    };

    const inputGetters = useHandler(row, cols, palette);
    const outputGetters = useHandler(res, cols, palette);
    const inputProps = getInput(inputGetters, toggleTile);
    const outputProps = getOutput(outputGetters);

    return (
        <Backdrop
            open={open}
            onClick={toggleOpen}
            sx={{
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                backdropFilter: 'blur(4px)',
            }}
        >
            <Card
                sx={{
                    maxWidth: '80vw',
                    maxHeight: '98vh',
                    overflow: 'hidden',
                    mx: 'auto',
                    borderRadius: SPACING.borderRadius.extraLarge,
                    backgroundColor: COLORS.background.paper,
                    border: COMPONENTS.borders.light,
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                }}
            >
                <CardContent
                    sx={{
                        pt: '3rem !important', // 48px
                        pb: '3rem !important', // 48px
                        px: '3rem !important', // 48px
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <Grid
                        container
                        spacing={isMobile ? 2 : 4}
                        sx={{ flex: 1, minHeight: 0 }}
                    >
                        {/* Top section: Instructions on left, animations on right */}
                        <Grid
                            container
                            size={12}
                            spacing={4}
                            sx={{
                                flex: 1,
                                minHeight: 0,
                                maxWidth: {
                                    xs: '100%',
                                    lg: SPACING.maxWidth.info,
                                },
                                mx: 'auto',
                            }}
                        >
                            {/* Left half: Algorithm instructions */}
                            <Grid
                                size={{ xs: 12, lg: isMobile ? 12 : 6 }}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                <Typography
                                    variant="h5"
                                    gutterBottom
                                    sx={{
                                        color: COLORS.text.primary,
                                        fontWeight: TYPOGRAPHY.fontWeight.bold,
                                        mb: 3,
                                        textAlign: isMobile ? 'center' : 'left',
                                        fontSize: {
                                            xs: '1.5rem',
                                            md: '1.75rem',
                                            lg: '1.6rem',
                                            xl: '2rem',
                                        },
                                    }}
                                >
                                    Chasing Lights Algorithm
                                </Typography>
                                <Box sx={{ flex: 1, overflow: 'auto' }}>
                                    {isMobile ? (
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                gap: 3,
                                            }}
                                        >
                                            {/* Step 1 */}
                                            <Box
                                                sx={{
                                                    maxWidth: 'fit-content',
                                                    mx: 'auto',
                                                }}
                                            >
                                                <Typography
                                                    variant="subtitle1"
                                                    sx={{
                                                        color: COLORS.text
                                                            .primary,
                                                        fontWeight:
                                                            TYPOGRAPHY
                                                                .fontWeight
                                                                .semiBold,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent:
                                                            'center',
                                                        mb: 1,
                                                        fontSize: '1rem',
                                                    }}
                                                >
                                                    <KeyboardArrowDown
                                                        sx={{
                                                            mr: 1,
                                                            color: COLORS
                                                                .primary.main,
                                                        }}
                                                    />
                                                    Chase to Bottom
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color: COLORS.text
                                                            .secondary,
                                                        textAlign: 'center',
                                                        lineHeight: 1.6,
                                                    }}
                                                >
                                                    Click lights to chase rows
                                                    from top to bottom.
                                                </Typography>
                                            </Box>

                                            {/* Step 2 */}
                                            <Box
                                                sx={{
                                                    maxWidth: 'fit-content',
                                                    mx: 'auto',
                                                }}
                                            >
                                                <Typography
                                                    variant="subtitle1"
                                                    sx={{
                                                        color: COLORS.text
                                                            .primary,
                                                        fontWeight:
                                                            TYPOGRAPHY
                                                                .fontWeight
                                                                .semiBold,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent:
                                                            'center',
                                                        mb: 1,
                                                        fontSize: '1rem',
                                                    }}
                                                >
                                                    <Calculate
                                                        sx={{
                                                            mr: 1,
                                                            color: COLORS.chart
                                                                .orange,
                                                        }}
                                                    />
                                                    Use Calculator
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color: COLORS.text
                                                            .secondary,
                                                        textAlign: 'center',
                                                        lineHeight: 1.6,
                                                    }}
                                                >
                                                    Enter the bottom row lights
                                                    pattern below.
                                                </Typography>
                                            </Box>

                                            {/* Step 3 */}
                                            <Box
                                                sx={{
                                                    maxWidth: 'fit-content',
                                                    mx: 'auto',
                                                }}
                                            >
                                                <Typography
                                                    variant="subtitle1"
                                                    sx={{
                                                        color: COLORS.text
                                                            .primary,
                                                        fontWeight:
                                                            TYPOGRAPHY
                                                                .fontWeight
                                                                .semiBold,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent:
                                                            'center',
                                                        mb: 1,
                                                        fontSize: '1rem',
                                                    }}
                                                >
                                                    <Replay
                                                        sx={{
                                                            mr: 1,
                                                            color: COLORS.chart
                                                                .green,
                                                        }}
                                                    />
                                                    Chase Again
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color: COLORS.text
                                                            .secondary,
                                                        textAlign: 'center',
                                                        lineHeight: 1.6,
                                                    }}
                                                >
                                                    Apply the solution to top
                                                    row, then chase to solve
                                                    puzzle.
                                                </Typography>
                                            </Box>
                                        </Box>
                                    ) : (
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: 3,
                                            }}
                                        >
                                            {/* Step 1 */}
                                            <Box>
                                                <Typography
                                                    variant="subtitle1"
                                                    sx={{
                                                        color: COLORS.text
                                                            .primary,
                                                        fontWeight:
                                                            TYPOGRAPHY
                                                                .fontWeight
                                                                .semiBold,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        mb: 1,
                                                        fontSize: '1rem',
                                                    }}
                                                >
                                                    <KeyboardArrowDown
                                                        sx={{
                                                            mr: 1,
                                                            color: COLORS
                                                                .primary.main,
                                                        }}
                                                    />
                                                    Chase to Bottom
                                                </Typography>
                                                <Typography
                                                    variant="body1"
                                                    sx={{
                                                        color: COLORS.text
                                                            .secondary,
                                                        lineHeight: 1.6,
                                                    }}
                                                >
                                                    Turn off rows from top to
                                                    bottom by clicking lights in
                                                    each row to eliminate all
                                                    lights above the bottom row.
                                                </Typography>
                                            </Box>

                                            {/* Step 2 */}
                                            <Box>
                                                <Typography
                                                    variant="subtitle1"
                                                    sx={{
                                                        color: COLORS.text
                                                            .primary,
                                                        fontWeight:
                                                            TYPOGRAPHY
                                                                .fontWeight
                                                                .semiBold,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        mb: 1,
                                                        fontSize: '1rem',
                                                    }}
                                                >
                                                    <Calculate
                                                        sx={{
                                                            mr: 1,
                                                            color: COLORS.chart
                                                                .orange,
                                                        }}
                                                    />
                                                    Use the Calculator
                                                </Typography>
                                                <Typography
                                                    variant="body1"
                                                    sx={{
                                                        color: COLORS.text
                                                            .secondary,
                                                        lineHeight: 1.6,
                                                    }}
                                                >
                                                    Enter the remaining lights
                                                    pattern in the bottom row
                                                    using the interactive
                                                    calculator below.
                                                </Typography>
                                            </Box>

                                            {/* Step 3 */}
                                            <Box>
                                                <Typography
                                                    variant="subtitle1"
                                                    sx={{
                                                        color: COLORS.text
                                                            .primary,
                                                        fontWeight:
                                                            TYPOGRAPHY
                                                                .fontWeight
                                                                .semiBold,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        mb: 1,
                                                        fontSize: '1rem',
                                                    }}
                                                >
                                                    <Replay
                                                        sx={{
                                                            mr: 1,
                                                            color: COLORS.chart
                                                                .green,
                                                        }}
                                                    />
                                                    Chase Again
                                                </Typography>
                                                <Typography
                                                    variant="body1"
                                                    sx={{
                                                        color: COLORS.text
                                                            .secondary,
                                                        lineHeight: 1.6,
                                                    }}
                                                >
                                                    Apply the calculated
                                                    solution pattern to the top
                                                    row, then chase downward to
                                                    solve the entire puzzle.
                                                </Typography>
                                            </Box>
                                        </Box>
                                    )}

                                    {!isMobile && (
                                        <Typography
                                            variant="h6"
                                            textAlign="center"
                                            sx={{
                                                mt: 4,
                                                color: COLORS.text.primary,
                                                fontWeight:
                                                    TYPOGRAPHY.fontWeight
                                                        .semiBold,
                                            }}
                                        >
                                            Boards Solved: &nbsp;{score}
                                        </Typography>
                                    )}
                                </Box>
                            </Grid>

                            {/* Right half: Animations */}
                            {!isMobile && (
                                <Grid
                                    size={{ xs: 12, lg: 6 }}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Example
                                        dims={3}
                                        size={size * 0.6}
                                        start={[1, 3, 8]}
                                        palette={palette}
                                    />
                                </Grid>
                            )}
                        </Grid>

                        {/* Bottom section: Lights Out Calculator (full width) */}
                        <Grid container size={12} spacing={4}>
                            <Grid size={12}>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        textAlign: 'center',
                                        color: COLORS.text.primary,
                                        fontWeight: TYPOGRAPHY.fontWeight.bold,
                                        mb: 0.5,
                                        fontSize: {
                                            xs: '1.25rem',
                                            md: '1.5rem',
                                            lg: '1.75rem',
                                        },
                                    }}
                                >
                                    Interactive Calculator
                                </Typography>
                            </Grid>
                            <Grid
                                size={12}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                }}
                            >
                                <CustomGrid
                                    space={0}
                                    rows={1}
                                    cols={cols}
                                    size={size * 0.7}
                                    cellProps={inputProps}
                                />
                            </Grid>
                            <Grid
                                size={12}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                }}
                            >
                                <CustomGrid
                                    space={0}
                                    rows={1}
                                    cols={cols}
                                    size={size * 0.7}
                                    cellProps={outputProps}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Backdrop>
    );
}
