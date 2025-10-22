import React, { useCallback, forwardRef, ReactNode } from 'react';
import { Tooltip, IconButton, Paper, Box, Grid } from './components/mui';
import {
    Refresh,
    HomeRounded,
    CloseRounded,
    GamepadRounded,
    KeyboardArrowUpRounded,
    KeyboardArrowDownRounded,
    KeyboardArrowLeftRounded,
    KeyboardArrowRightRounded,
    Code,
    Psychology,
    Cloud,
    Work,
} from './components/icons';
import { Link } from 'react-router-dom';
import { getSpace } from './calculate';
import {
    COLORS,
    SPACING,
    TYPOGRAPHY,
    ANIMATIONS,
    COMPONENT_VARIANTS,
} from './config/theme';
import { CELL_SIZE } from './config/constants';
import { SxProps, Theme } from '@mui/material/styles';

type IconComponent = React.ElementType;

interface IconMap {
    [key: string]: IconComponent;
}

export const ICON_MAP: IconMap = {
    Code: Code,
    Psychology: Psychology,
    Cloud: Cloud,
    Work: Work,
};

interface TooltipButtonProps {
    Icon: IconComponent;
    title: string;
    [key: string]: any;
}

export function TooltipButton({ Icon, title, ...rest }: TooltipButtonProps) {
    return (
        <Tooltip title={title}>
            <IconButton size="large" aria-label={title} {...rest}>
                <Icon fontSize="inherit" aria-hidden="true" />
            </IconButton>
        </Tooltip>
    );
}

interface HomeButtonProps {
    hide?: boolean;
    [key: string]: any;
}

export function HomeButton({ hide = false, ...rest }: HomeButtonProps) {
    if (hide) return null;

    return (
        <TooltipButton
            to="/"
            key="Home"
            title="Navigate to Home"
            component={Link}
            Icon={HomeRounded}
            aria-label="Navigate to Home page"
            {...rest}
        />
    );
}

interface CellProps {
    size: number;
    children: ReactNode;
    [key: string]: any;
}

function Cell({ size, children, ...rest }: CellProps) {
    const remSize = `${size}rem`;
    const radius = `${size / CELL_SIZE.divisor}rem`;

    const props = {
        ...COMPONENT_VARIANTS.flexCenter,
        borderRadius: radius,
        height: remSize,
        width: remSize,
        fontSize: `${size * CELL_SIZE.fontSizeMultiplier}rem`,
        fontWeight: TYPOGRAPHY.fontWeight.semibold,
        fontFamily: 'monospace',
        transition: ANIMATIONS.transition,
    };

    const combined = {
        ...props,
        ...rest,
    };

    return <Box {...combined}>{children}</Box>;
}

interface RowProps {
    cols: number;
    size: number;
    index: number;
    spacing: string;
    cellProps: (row: number, col: number) => any;
}

function Row({ cols, size, index, spacing, cellProps }: RowProps) {
    const WrappedCell = (_: any, j: number) => (
        <Cell {...cellProps(index, j)} key={`${index}_${j}`} size={size} />
    );

    return (
        <Grid container size={12} spacing={spacing} justifyContent="center">
            {Array.from({ length: cols }, WrappedCell)}
        </Grid>
    );
}

interface CustomGridProps {
    size: number;
    rows: number;
    cols: number;
    cellProps: (row: number, col: number) => any;
    space?: number;
    [key: string]: any;
}

export function CustomGrid({ size, rows, cols, cellProps, ...rest }: CustomGridProps) {
    const auto = getSpace(size);
    const { space = auto } = rest;
    const rem = `${space}rem`;

    const getRow = useCallback(
        (_: any, i: number) => (
            <Row
                index={i}
                cols={cols}
                size={size}
                spacing={rem}
                key={`row_${i}`}
                cellProps={cellProps}
            />
        ),
        [cols, size, rem, cellProps]
    );

    return (
        <Grid
            container
            size={12}
            spacing={rem}
            alignItems="center"
            role="grid"
            aria-label={`Grid with ${rows} rows and ${cols} columns`}
            {...rest}
        >
            {Array.from({ length: rows }, getRow)}
        </Grid>
    );
}

interface NavigationProps {
    children: ReactNode;
    [key: string]: any;
}

export function Navigation({ children, ...rest }: NavigationProps) {
    return (
        <Paper
            elevation={0}
            component="nav"
            role="navigation"
            aria-label="Game controls navigation"
            sx={{
                transform: 'translateX(-50%)',
                position: 'absolute',
                bottom: 50,
                left: '50%',
                zIndex: 10,
                backgroundColor: 'hsla(0, 0%, 3%, 0.95)',
                backdropFilter: 'blur(24px) saturate(180%)',
                border: `1px solid ${COLORS.border.subtle}`,
                borderRadius: SPACING.borderRadius.lg,
                boxShadow: '0 8px 32px hsla(0, 0%, 0%, 0.35)',
                padding: '16px 24px',
                ...rest,
            }}
        >
            <Grid
                container
                spacing={2}
                sx={{
                    ...COMPONENT_VARIANTS.flexCenter,
                    flexWrap: 'nowrap',
                    minWidth: 0,
                }}
            >
                {children}
            </Grid>
        </Paper>
    );
}

interface RandomButtonProps {
    title?: string;
    onClick: () => void;
    enabled?: boolean;
    enabledTitle?: string;
    disabledTitle?: string;
    showToggleState?: boolean;
    hide?: boolean;
    sx?: SxProps<Theme>;
    [key: string]: any;
}

export function RandomButton({
    title = 'Randomize',
    onClick,
    enabled = false,
    enabledTitle = 'Disable Random',
    disabledTitle = 'Enable Random',
    showToggleState = false,
    hide = false,
    ...props
}: RandomButtonProps) {
    if (hide) return null;

    const buttonTitle = showToggleState
        ? enabled
            ? enabledTitle
            : disabledTitle
        : title;

    const ariaLabel = showToggleState
        ? enabled
            ? enabledTitle
            : disabledTitle
        : title;

    return (
        <TooltipButton
            title={buttonTitle}
            Icon={Refresh}
            onClick={onClick}
            aria-label={ariaLabel}
            sx={{
                color:
                    showToggleState && enabled
                        ? COLORS.primary.main
                        : 'inherit',
                backgroundColor:
                    showToggleState && enabled
                        ? `${COLORS.primary.main}20`
                        : 'transparent',
                ...props.sx,
            }}
            {...props}
        />
    );
}

interface ControlsProps {
    handler?: (direction: string) => () => void;
    onRandom?: () => void;
    randomEnabled?: boolean;
    children?: ReactNode;
    size?: 'small' | 'medium' | 'large' | 'inherit';
    hide?: boolean;
}

export function Controls({
    handler,
    onRandom,
    randomEnabled,
    children,
    size = 'inherit',
    hide = false,
}: ControlsProps) {
    const opacity = hide ? 0.8 : 1;

    return (
        <Navigation opacity={opacity}>
            <HomeButton hide={hide} size={size} />
            {onRandom && (
                <RandomButton
                    onClick={onRandom}
                    enabled={randomEnabled}
                    showToggleState={!!randomEnabled}
                    enabledTitle="Disable Random Moves"
                    disabledTitle="Enable Random Moves"
                    hide={hide}
                    size={size}
                />
            )}
            {children}
        </Navigation>
    );
}

interface ArrowsButtonProps {
    show?: boolean;
    setShow: (show: boolean) => void;
    handler: (direction: string) => () => void;
    size?: 'small' | 'medium' | 'large' | 'inherit';
    hide?: boolean;
}

export function ArrowsButton({
    show = false,
    setShow,
    handler,
    size = 'inherit',
    hide = false,
}: ArrowsButtonProps) {
    const flip = useCallback(() => setShow(!show), [show, setShow]);

    if (hide) return null;

    if (!show) {
        return (
            <TooltipButton
                title="Show Game Controls"
                Icon={GamepadRounded}
                onClick={flip}
                aria-label="Show game controls"
                size={size}
            />
        );
    }

    return (
        <Grid role="group" aria-label="Directional controls">
            <Grid width="100%" display="flex" justifyContent="center">
                <TooltipButton
                    title="Move Up"
                    Icon={KeyboardArrowUpRounded}
                    onClick={handler('up')}
                    aria-label="Move up"
                    size={size}
                />
            </Grid>
            <Grid>
                <TooltipButton
                    title="Move Left"
                    Icon={KeyboardArrowLeftRounded}
                    onClick={handler('left')}
                    aria-label="Move left"
                    size={size}
                />
                <IconButton
                    size={size === 'inherit' ? 'large' : size}
                    onClick={flip}
                    aria-label="Hide controls"
                >
                    <CloseRounded fontSize="inherit" aria-hidden="true" />
                </IconButton>
                <TooltipButton
                    title="Move Right"
                    Icon={KeyboardArrowRightRounded}
                    onClick={handler('right')}
                    aria-label="Move right"
                    size={size}
                />
            </Grid>
            <Grid width="100%" display="flex" justifyContent="center">
                <TooltipButton
                    title="Move Down"
                    Icon={KeyboardArrowDownRounded}
                    onClick={handler('down')}
                    aria-label="Move down"
                    size={size}
                />
            </Grid>
        </Grid>
    );
}

interface GlassCardProps {
    children: ReactNode;
    padding?: number | string;
    sx?: SxProps<Theme>;
    className?: string;
    interactive?: boolean;
    [key: string]: any;
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
    function GlassCard(
        {
            children,
            padding = SPACING.padding.md,
            sx,
            className,
            interactive = false,
            ...props
        },
        ref
    ) {
        return (
            <Box
                ref={ref}
                className={`glass-card ${className || ''}`}
                sx={{
                    ...(interactive
                        ? COMPONENT_VARIANTS.interactiveCard
                        : COMPONENT_VARIANTS.card),
                    padding,
                    ...sx,
                }}
                {...props}
            >
                {children}
            </Box>
        );
    }
);

