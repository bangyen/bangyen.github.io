import { useState, useCallback, useEffect } from 'react';
import { Backdrop, Typography, Box, Grid } from '../../components/mui';
import {
    CircleRounded,
    KeyboardArrowDown,
    Calculate,
    Replay,
} from '../../components/icons';
import {
    SPACING,
    COLORS,
    TYPOGRAPHY,
    COMPONENT_VARIANTS,
} from '../../config/theme';
import { GlassCard, CustomGrid } from '../../helpers';
import { getProduct } from './matrices';
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
                ...COMPONENT_VARIANTS.card,
                backgroundColor: 'hsla(0, 0%, 3%, 0.85)',
                transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
                border: 'none',
            }}
        >
            <Box
                sx={{
                    maxWidth: '80vw',
                    height: 'fit-content',
                    maxHeight: '90vh',
                    overflow: 'auto',
                    mx: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
                    padding: 0,
                    backgroundColor: 'hsl(0, 0%, 5%)',
                    borderRadius: SPACING.borderRadius.lg,
                    border: `1px solid ${COLORS.border.subtle}`,
                }}
            >
                <Box
                    sx={{
                        pt: '1rem',
                        pb: '1rem',
                        px: '1.25rem',
                        height: 'fit-content',
                        display: 'flex',
                        flexDirection: 'column',
                        minHeight: 0,
                    }}
                >
                    <Grid
                        container
                        spacing={isMobile ? 1.5 : 2}
                        sx={{ flex: 1, minHeight: 0 }}
                    >
                        {/* Top section: Instructions on left, animations on right */}
                        <Grid
                            container
                            size={12}
                            spacing={2}
                            sx={{
                                flex: 1,
                                minHeight: 0,
                                maxWidth: {
                                    xs: '100%',
                                    lg: SPACING.maxWidth.lg,
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
                                    <GlassCard
                                        sx={{
                                            height: !isLargeScreen
                                                ? '100%'
                                                : 'auto',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            transition:
                                                'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
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
                                                mb: 2,
                                                textAlign: isMobile
                                                    ? 'center'
                                                    : 'left',
                                                fontSize:
                                                    TYPOGRAPHY.fontSize.h2,
                                                lineHeight: 1.4,
                                                letterSpacing: '0',
                                            }}
                                        >
                                            Chasing Lights Algorithm
                                        </Typography>
                                        {/* Step 1 */}
                                        <Box sx={{ mb: 2 }}>
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
                                                        TYPOGRAPHY.fontSize
                                                            .body,
                                                    letterSpacing: '0',
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
                                                    lineHeight: 1.5,
                                                    fontSize:
                                                        TYPOGRAPHY.fontSize
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
                                        <Box sx={{ mb: 2 }}>
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
                                                        TYPOGRAPHY.fontSize
                                                            .body,
                                                    letterSpacing: '0',
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
                                                    lineHeight: 1.5,
                                                    fontSize:
                                                        TYPOGRAPHY.fontSize
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
                                        <Box sx={{ mb: 1 }}>
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
                                                        TYPOGRAPHY.fontSize
                                                            .body,
                                                    letterSpacing: '0',
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
                                                    lineHeight: 1.5,
                                                    fontSize:
                                                        TYPOGRAPHY.fontSize
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
                                    </GlassCard>
                                </Box>
                            </Grid>

                            {/* Right half: Animations */}
                            {!isLargeScreen && (
                                <Grid
                                    size={{ xs: 12, lg: 6 }}
                                    sx={{
                                        ...COMPONENT_VARIANTS.flexCenter,
                                    }}
                                >
                                    <GlassCard
                                        sx={{
                                            width: '100%',
                                            height: '100%',
                                            ...COMPONENT_VARIANTS.flexCenter,
                                            transition:
                                                'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                                        }}
                                    >
                                        <Example
                                            dims={3}
                                            size={size * 0.6}
                                            start={[1, 3, 8]}
                                            palette={palette}
                                        />
                                    </GlassCard>
                                </Grid>
                            )}
                        </Grid>

                        {/* Bottom section: Lights Out Calculator (full width) */}
                        <Grid container size={12} spacing={2}>
                            <Grid size={12}>
                                <GlassCard
                                    sx={{
                                        textAlign: 'center',
                                        paddingBottom: '2rem',
                                    }}
                                >
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            color: COLORS.text.primary,
                                            fontWeight:
                                                TYPOGRAPHY.fontWeight.semibold,
                                            fontSize:
                                                TYPOGRAPHY.fontSize.subheading,
                                            lineHeight: 1.4,
                                            letterSpacing: '0',
                                            mb: 2,
                                        }}
                                    >
                                        Interactive Calculator
                                    </Typography>

                                    {/* Input Pattern */}
                                    <Box sx={{ mb: 2 }}>
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
                                </GlassCard>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Backdrop>
    );
}
