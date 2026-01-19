import React, { useState, useCallback, useEffect } from 'react';
import {
    Backdrop,
    Typography,
    Box,
    Grid,
    IconButton,
    Button,
} from '../../../components/mui';
import {
    CircleRounded,
    KeyboardArrowDown,
    Calculate,
    Replay,
    NavigateBeforeRounded,
    NavigateNextRounded,
    CloseRounded,
    Refresh,
} from '../../../components/icons';
import {
    SPACING,
    COLORS,
    TYPOGRAPHY,
    COMPONENT_VARIANTS,
} from '../../../config/theme';
import { GlassCard } from '../../../components/ui/GlassCard';
import { CustomGrid } from '../../../components/ui/CustomGrid';
import { getProduct } from './matrices';
import { useGetters } from '../components/Board';
import { useMobile } from '../../../hooks';
import Example from './Example';

// Type assertion for GlassCard component
const TypedGlassCard = GlassCard as React.ComponentType<{
    children?: React.ReactNode;
    sx?: Record<string, unknown>;
    onClick?: (event: React.MouseEvent) => void;
}>;

interface Palette {
    primary: string;
    secondary: string;
}

interface InfoProps {
    rows: number;
    cols: number;
    size: number;
    open: boolean;
    palette: Palette;
    toggleOpen: () => void;
}

// --- Calculator Helpers ---

interface Getters {
    getColor: (row: number, col: number) => { front: string; back: string };
    getBorder: (row: number, col: number) => Record<string, unknown>;
}

function getInput(
    getters: Getters,
    toggleTile: (col: number) => (event: React.MouseEvent) => void
) {
    const { getColor, getBorder } = getters;

    return (r: number, c: number) => {
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
                transition: 'all 200ms ease',
            },
            color: front,
            children: <CircleRounded />,
        };
    };
}

function getOutput({ getColor, getBorder }: Getters) {
    return (r: number, c: number) => {
        const { front } = getColor(r, c);

        return {
            backgroundColor: front,
            style: getBorder(r, c),
            transition: 'all 200ms ease',
        };
    };
}

function useHandler(row: number[], size: number, palette: Palette) {
    const getTile = useCallback(
        (r: number, c: number) => {
            if (r !== 0 || c < 0 || c >= size) return -1;
            return row[c];
        },
        [row, size]
    );

    return useGetters(getTile, palette);
}

// --- Content Steps ---

const StepTitle = ({ children }: { children: React.ReactNode }) => (
    <Typography
        variant="h5"
        sx={{
            color: COLORS.text.primary,
            fontWeight: TYPOGRAPHY.fontWeight.bold,
            textAlign: 'center',
            fontSize: TYPOGRAPHY.fontSize.h2,
        }}
    >
        {children}
    </Typography>
);

const InstructionItem = ({
    Icon,
    title,
    text,
}: {
    Icon: React.ElementType;
    title: string;
    text: string;
}) => (
    <Box sx={{ px: 2 }}>
        <Typography
            variant="h6"
            sx={{
                color: COLORS.text.primary,
                fontWeight: TYPOGRAPHY.fontWeight.semibold,
                display: 'flex',
                alignItems: 'center',
                mb: 1.5,
                fontSize: TYPOGRAPHY.fontSize.subheading,
            }}
        >
            <Icon
                sx={{ mr: 2, color: COLORS.primary.main, fontSize: '1.75rem' }}
            />
            {title}
        </Typography>
        <Typography
            variant="body1"
            sx={{
                color: COLORS.text.secondary,
                lineHeight: 1.6,
                fontSize: TYPOGRAPHY.fontSize.body,
                ml: 6,
            }}
        >
            {text}
        </Typography>
    </Box>
);

// --- Main Component ---

const TITLES = ['Chasing Lights', 'How It Works', 'Calculator'];

export default function Info(props: InfoProps): React.ReactElement {
    const { rows, cols, size, open, palette, toggleOpen } = props;
    const isMobile = useMobile('md');

    // 0: Instructions, 1: Example, 2: Calculator
    const [step, setStep] = useState(0);
    const TOTAL_STEPS = 3;

    // Calculator State (hoisted to persist across steps)
    const [calcRow, setCalcRow] = useState<number[]>(Array(cols).fill(0));

    useEffect(() => {
        setCalcRow(Array(cols).fill(0));
    }, [cols, palette]); // Reset only on config change

    const res = getProduct(calcRow, rows, cols);

    const toggleTile = (col: number) => (event: React.MouseEvent) => {
        event.stopPropagation();
        const newRow = [...calcRow];
        newRow[col] ^= 1;
        setCalcRow(newRow);
    };

    const inputGetters = useHandler(calcRow, cols, palette);
    const outputGetters = useHandler(res, cols, palette);
    const inputProps = getInput(inputGetters, toggleTile);
    const outputProps = getOutput(outputGetters);

    // Reset functionality
    const handleReset = () => {
        setCalcRow(Array(cols).fill(0));
    };

    const handleNext = () => {
        if (step < TOTAL_STEPS - 1) setStep(step + 1);
        else toggleOpen();
    };

    const handleBack = () => {
        if (step > 0) setStep(step - 1);
    };

    // Close handler to also reset step? Optional. Let's keep step for now.
    const handleClose = () => {
        toggleOpen();
        // setTimeout(() => setStep(0), 300); // Reset step after transition? Maybe not.
    };

    return (
        <Backdrop
            open={open}
            onClick={toggleOpen} // Close on backdrop click
            sx={{
                zIndex: 9999,
                backgroundColor: 'rgba(0, 0, 0, 0.85)',
                backdropFilter: 'blur(8px)',
            }}
        >
            <TypedGlassCard
                onClick={(e: React.MouseEvent) => e.stopPropagation()} // Prevent close on card click
                sx={{
                    width: '100%',
                    maxWidth: '1000px',
                    height: '550px',
                    minHeight: '550px',
                    display: 'flex',
                    flexDirection: 'column',
                    p: 0,
                    overflow: 'hidden',
                    position: 'relative',
                    m: 2,
                }}
            >
                {/* Content Area */}
                <Box
                    sx={{
                        flex: 1,
                        overflowY: 'auto',
                        p: { xs: 2.5, md: 3 }, // balanced padding
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    {/* Synchronized Header (Title + Close Button) */}
                    <Box
                        sx={{
                            position: 'relative',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            mb: 2, // reduced from 3 for snug fit
                        }}
                    >
                        <StepTitle>{TITLES[step]}</StepTitle>
                        <IconButton
                            onClick={handleClose}
                            size="small"
                            sx={{
                                position: 'absolute',
                                right: 0,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: COLORS.text.secondary,
                            }}
                        >
                            <CloseRounded />
                        </IconButton>
                    </Box>
                    {/* Step 0: Instructions */}
                    {step === 0 && (
                        <Box
                            sx={{
                                animation: 'fadeIn 0.3s ease',
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <Box
                                sx={{
                                    flex: 1,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    gap: 4,
                                }}
                            >
                                <InstructionItem
                                    Icon={KeyboardArrowDown}
                                    title="Chase to Bottom"
                                    text="Turn off rows from top to bottom by clicking lights in each row to push them down."
                                />
                                <InstructionItem
                                    Icon={Calculate}
                                    title="Use Calulator"
                                    text="Enter the remaining lights pattern from the bottom row into the calculator on the last page."
                                />
                                <InstructionItem
                                    Icon={Replay}
                                    title="Chase Again"
                                    text="Apply the solution pattern to the top row, then chase them down again to solve the puzzle."
                                />
                            </Box>
                        </Box>
                    )}

                    {/* Step 1: Example */}
                    {step === 1 && (
                        <Box
                            sx={{
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                animation: 'fadeIn 0.3s ease',
                            }}
                        >
                            <Box
                                sx={{
                                    flex: 1,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                }}
                            >
                                <Example
                                    dims={3}
                                    size={size * 0.7} // Adjust size for responsiveness
                                    start={[1, 3, 8]}
                                    palette={palette}
                                />
                            </Box>
                        </Box>
                    )}

                    {/* Step 2: Calculator */}
                    {step === 2 && (
                        <Box
                            sx={{
                                animation: 'fadeIn 0.3s ease',
                                textAlign: 'center',
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <Box
                                sx={{
                                    flex: 1,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    gap: 3, // Consistent spacing
                                }}
                            >
                                <Box>
                                    <Typography
                                        variant="subtitle2"
                                        sx={{
                                            mb: 1,
                                            color: COLORS.text.primary,
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        Input{' '}
                                        <Box
                                            component="span"
                                            sx={{
                                                color: COLORS.text.secondary,
                                                fontWeight: 'normal',
                                            }}
                                        >
                                            (Bottom Row)
                                        </Box>
                                    </Typography>
                                    <CustomGrid
                                        space={0}
                                        rows={1}
                                        cols={cols}
                                        size={size * (isMobile ? 0.9 : 0.8)}
                                        cellProps={inputProps}
                                    />
                                </Box>

                                <Box>
                                    <Typography
                                        variant="subtitle2"
                                        sx={{
                                            mb: 1,
                                            color: COLORS.text.primary,
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        Solution{' '}
                                        <Box
                                            component="span"
                                            sx={{
                                                color: COLORS.text.secondary,
                                                fontWeight: 'normal',
                                            }}
                                        >
                                            (Top Row)
                                        </Box>
                                    </Typography>
                                    <CustomGrid
                                        space={0}
                                        rows={1}
                                        cols={cols}
                                        size={size * (isMobile ? 0.9 : 0.8)}
                                        cellProps={outputProps}
                                    />
                                </Box>

                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        startIcon={<Refresh />}
                                        onClick={handleReset}
                                        sx={{
                                            borderColor: COLORS.border.subtle,
                                            color: COLORS.text.secondary,
                                        }}
                                    >
                                        Clear Pattern
                                    </Button>
                                </Box>
                            </Box>
                        </Box>
                    )}
                </Box>

                {/* Footer (Navigation) */}
                <Box
                    sx={{
                        p: 2.5,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <Button
                        onClick={handleBack}
                        disabled={step === 0}
                        startIcon={<NavigateBeforeRounded />}
                        sx={{
                            visibility: step === 0 ? 'hidden' : 'visible',
                            color: COLORS.text.primary,
                        }}
                    >
                        Back
                    </Button>

                    {/* Dots Indicator */}
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        {[0, 1, 2].map(i => (
                            <Box
                                key={i}
                                sx={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: '50%',
                                    backgroundColor:
                                        step === i
                                            ? COLORS.primary.main
                                            : COLORS.interactive.disabled,
                                    transition: 'background-color 0.3s',
                                }}
                            />
                        ))}
                    </Box>

                    <Button
                        onClick={handleNext}
                        disabled={step === TOTAL_STEPS - 1}
                        endIcon={<NavigateNextRounded />}
                        sx={{
                            visibility:
                                step === TOTAL_STEPS - 1 ? 'hidden' : 'visible',
                            color: COLORS.text.primary,
                        }}
                    >
                        Next
                    </Button>
                </Box>
            </TypedGlassCard>

            {/* Global Styles for Animations */}
            <style>
                {`
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(10px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                `}
            </style>
        </Backdrop>
    );
}
