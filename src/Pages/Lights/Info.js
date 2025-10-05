import { useState, useCallback, useEffect } from 'react';
import { Backdrop, Typography, Card, CardContent, Box } from '@mui/material';
import {
    CircleRounded,
    KeyboardArrowDown,
    Calculate,
    Replay,
} from '@mui/icons-material';
import Grid from '@mui/material/Grid2';
import { SPACING, COLORS, TYPOGRAPHY } from '../../config/theme';

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
    const { rows, cols, size, open, palette, toggleOpen } = props;
    const isMobile = useMobile('md');
    const isLargeScreen = useMobile('lg');

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
                backgroundColor: 'hsla(0, 0%, 3%, 0.85)',
                backdropFilter: 'blur(24px) saturate(180%)',
                transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
            }}
        >
            <Card
                sx={{
                    maxWidth: '80vw',
                    maxHeight: '95vh',
                    overflow: 'auto',
                    mx: 'auto',
                    borderRadius: SPACING.borderRadius.xl,
                    backgroundColor: COLORS.surface.glass,
                    backdropFilter: 'blur(20px) saturate(180%)',
                    border: `1px solid hsla(0, 0%, 100%, 0.1)`,
                    boxShadow: COLORS.shadows.lg,
                    transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                }}
            >
                <CardContent
                    sx={{
                        pt: '1.5rem',
                        pb: '1.5rem',
                        px: '1.5rem',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        minHeight: 0,
                    }}
                >
                    <Grid
                        container
                        spacing={isMobile ? 2 : 3}
                        sx={{ flex: 1, minHeight: 0 }}
                    >
                        {/* Top section: Instructions on left, animations on right */}
                        <Grid
                            container
                            size={12}
                            spacing={3}
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
                                    height: isLargeScreen ? '100%' : 'auto',
                                }}
                            >
                                <Box sx={{ flex: 1, overflow: 'auto' }}>
                                    <Box
                                        sx={{
                                            backgroundColor:
                                                COLORS.surface.elevated,
                                            border: `1px solid hsla(0, 0%, 100%, 0.05)`,
                                            borderRadius:
                                                SPACING.borderRadius.lg,
                                            padding: 3,
                                            height: !isLargeScreen
                                                ? '100%'
                                                : 'auto',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            transition:
                                                'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                                            '&:hover': {
                                                backgroundColor:
                                                    COLORS.interactive.hover,
                                                transform: 'translateY(-2px)',
                                                boxShadow: COLORS.shadows.sm,
                                            },
                                        }}
                                    >
                                        <Typography
                                            variant="h5"
                                            gutterBottom
                                            sx={{
                                                color: COLORS.text.primary,
                                                fontWeight:
                                                    TYPOGRAPHY.fontWeight
                                                        .semibold,
                                                mb: 3,
                                                textAlign: isMobile
                                                    ? 'center'
                                                    : 'left',
                                                fontSize:
                                                    TYPOGRAPHY.fontSize.md.h3,
                                                lineHeight:
                                                    TYPOGRAPHY.lineHeight.tight,
                                                letterSpacing:
                                                    TYPOGRAPHY.letterSpacing
                                                        .tight,
                                            }}
                                        >
                                            Chasing Lights Algorithm
                                        </Typography>
                                        {/* Step 1 */}
                                        <Box sx={{ mb: 3 }}>
                                            <Typography
                                                variant="subtitle1"
                                                sx={{
                                                    color: COLORS.text.primary,
                                                    fontWeight:
                                                        TYPOGRAPHY.fontWeight
                                                            .semibold,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    mb: 1,
                                                    fontSize:
                                                        TYPOGRAPHY.fontSize.sm
                                                            .h5,
                                                    letterSpacing:
                                                        TYPOGRAPHY.letterSpacing
                                                            .wide,
                                                }}
                                            >
                                                <KeyboardArrowDown
                                                    sx={{
                                                        mr: 1.5,
                                                        color: COLORS.primary
                                                            .main,
                                                        fontSize: '1.5rem',
                                                    }}
                                                />
                                                Chase to Bottom
                                            </Typography>
                                            <Typography
                                                variant="body1"
                                                sx={{
                                                    color: COLORS.text
                                                        .secondary,
                                                    lineHeight:
                                                        TYPOGRAPHY.lineHeight
                                                            .relaxed,
                                                    fontSize:
                                                        TYPOGRAPHY.fontSize.sm
                                                            .body,
                                                    ml: 4,
                                                }}
                                            >
                                                Turn off rows from top to bottom
                                                by clicking lights in each row
                                                to eliminate all lights above
                                                the bottom row.
                                            </Typography>
                                        </Box>

                                        {/* Step 2 */}
                                        <Box sx={{ mb: 3 }}>
                                            <Typography
                                                variant="subtitle1"
                                                sx={{
                                                    color: COLORS.text.primary,
                                                    fontWeight:
                                                        TYPOGRAPHY.fontWeight
                                                            .semibold,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    mb: 1,
                                                    fontSize:
                                                        TYPOGRAPHY.fontSize.sm
                                                            .h5,
                                                    letterSpacing:
                                                        TYPOGRAPHY.letterSpacing
                                                            .wide,
                                                }}
                                            >
                                                <Calculate
                                                    sx={{
                                                        mr: 1.5,
                                                        color: COLORS.data
                                                            .amber,
                                                        fontSize: '1.5rem',
                                                    }}
                                                />
                                                Use the Calculator
                                            </Typography>
                                            <Typography
                                                variant="body1"
                                                sx={{
                                                    color: COLORS.text
                                                        .secondary,
                                                    lineHeight:
                                                        TYPOGRAPHY.lineHeight
                                                            .relaxed,
                                                    fontSize:
                                                        TYPOGRAPHY.fontSize.sm
                                                            .body,
                                                    ml: 4,
                                                }}
                                            >
                                                Enter the remaining lights
                                                pattern in the bottom row using
                                                the interactive calculator
                                                below.
                                            </Typography>
                                        </Box>

                                        {/* Step 3 */}
                                        <Box>
                                            <Typography
                                                variant="subtitle1"
                                                sx={{
                                                    color: COLORS.text.primary,
                                                    fontWeight:
                                                        TYPOGRAPHY.fontWeight
                                                            .semibold,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    mb: 1,
                                                    fontSize:
                                                        TYPOGRAPHY.fontSize.sm
                                                            .h5,
                                                    letterSpacing:
                                                        TYPOGRAPHY.letterSpacing
                                                            .wide,
                                                }}
                                            >
                                                <Replay
                                                    sx={{
                                                        mr: 1.5,
                                                        color: COLORS.data
                                                            .green,
                                                        fontSize: '1.5rem',
                                                    }}
                                                />
                                                Chase Again
                                            </Typography>
                                            <Typography
                                                variant="body1"
                                                sx={{
                                                    color: COLORS.text
                                                        .secondary,
                                                    lineHeight:
                                                        TYPOGRAPHY.lineHeight
                                                            .relaxed,
                                                    fontSize:
                                                        TYPOGRAPHY.fontSize.sm
                                                            .body,
                                                    ml: 4,
                                                }}
                                            >
                                                Apply the calculated solution
                                                pattern to the top row, then
                                                chase downward to solve the
                                                entire puzzle.
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </Grid>

                            {/* Right half: Animations */}
                            {!isLargeScreen && (
                                <Grid
                                    size={{ xs: 12, lg: 6 }}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Box
                                        sx={{
                                            backgroundColor:
                                                COLORS.surface.elevated,
                                            border: `1px solid hsla(0, 0%, 100%, 0.05)`,
                                            borderRadius:
                                                SPACING.borderRadius.lg,
                                            padding: 3,
                                            width: '100%',
                                            height: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            transition:
                                                'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                                            '&:hover': {
                                                backgroundColor:
                                                    COLORS.interactive.hover,
                                                transform: 'translateY(-2px)',
                                                boxShadow: COLORS.shadows.sm,
                                            },
                                        }}
                                    >
                                        <Example
                                            dims={3}
                                            size={size * 0.6}
                                            start={[1, 3, 8]}
                                            palette={palette}
                                        />
                                    </Box>
                                </Grid>
                            )}
                        </Grid>

                        {/* Bottom section: Lights Out Calculator (full width) */}
                        <Grid container size={12} spacing={3}>
                            <Grid size={12}>
                                <Box
                                    sx={{
                                        backgroundColor:
                                            COLORS.surface.elevated,
                                        border: `1px solid hsla(0, 0%, 100%, 0.05)`,
                                        borderRadius: SPACING.borderRadius.xl,
                                        padding: 3,
                                        textAlign: 'center',
                                    }}
                                >
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            color: COLORS.text.primary,
                                            fontWeight:
                                                TYPOGRAPHY.fontWeight.semibold,
                                            fontSize: TYPOGRAPHY.fontSize.md.h4,
                                            lineHeight:
                                                TYPOGRAPHY.lineHeight.tight,
                                            letterSpacing:
                                                TYPOGRAPHY.letterSpacing.tight,
                                            mb: 3,
                                        }}
                                    >
                                        Interactive Calculator
                                    </Typography>

                                    {/* Input Pattern */}
                                    <Box sx={{ mb: 3 }}>
                                        <CustomGrid
                                            space={0}
                                            rows={1}
                                            cols={cols}
                                            size={size * 0.7}
                                            cellProps={inputProps}
                                        />
                                    </Box>

                                    {/* Solution Pattern */}
                                    <Box>
                                        <CustomGrid
                                            space={0}
                                            rows={1}
                                            cols={cols}
                                            size={size * 0.7}
                                            cellProps={outputProps}
                                        />
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Backdrop>
    );
}
