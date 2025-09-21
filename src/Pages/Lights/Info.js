import { useState, useCallback, useEffect } from 'react';
import { Backdrop, Typography, Card, CardContent, Box } from '@mui/material';
import { CircleRounded } from '@mui/icons-material';
import Grid from '@mui/material/Grid2';

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
        <Backdrop open={open} onClick={toggleOpen}>
            <Card
                sx={{
                    maxWidth: '80vw',
                    maxHeight: '98vh',
                    overflow: 'hidden',
                    mx: 'auto',
                    borderRadius: 4,
                }}
            >
                <CardContent
                    sx={{
                        pt: '48px !important',
                        pb: '48px !important',
                        px: '48px !important',
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
                                maxWidth: { xs: '100%', lg: '1200px' },
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
                                        fontWeight: 'bold',
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
                                            }}
                                        >
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    mb: 2,
                                                    textAlign: 'left',
                                                    maxWidth: '400px',
                                                }}
                                            >
                                                • <strong>Chase down:</strong>{' '}
                                                Turn off rows from top to bottom
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    mb: 2,
                                                    textAlign: 'left',
                                                    maxWidth: '400px',
                                                }}
                                            >
                                                • <strong>Calculate:</strong>{' '}
                                                Enter bottom row pattern below
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    mb: 3,
                                                    textAlign: 'left',
                                                    maxWidth: '400px',
                                                }}
                                            >
                                                • <strong>Solve:</strong> Click
                                                calculated lights and chase down
                                            </Typography>
                                        </Box>
                                    ) : (
                                        <>
                                            <Typography
                                                variant="body2"
                                                sx={{ mb: 2 }}
                                            >
                                                •{' '}
                                                <strong>
                                                    Chase to bottom:
                                                </strong>{' '}
                                                Click lights in each row to turn
                                                off the row above, working your
                                                way down until only the bottom
                                                row remains lit.
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                sx={{ mb: 2 }}
                                            >
                                                •{' '}
                                                <strong>
                                                    Use the calculator:
                                                </strong>{' '}
                                                Enter the bottom row pattern
                                                below to calculate which top row
                                                lights need to be activated for
                                                the final solution.
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                sx={{ mb: 3 }}
                                            >
                                                • <strong>Chase again:</strong>{' '}
                                                Click the calculated top row
                                                lights and chase downward to
                                                turn off all remaining lights
                                                and complete the puzzle.
                                            </Typography>
                                        </>
                                    )}

                                    {!isMobile && (
                                        <Typography
                                            variant="h6"
                                            textAlign="center"
                                            sx={{ mt: 4 }}
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
                                        fontWeight: 'bold',
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
