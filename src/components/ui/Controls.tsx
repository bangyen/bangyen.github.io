import type { SxProps, Theme } from '@mui/material/styles';
import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';

import {
    Refresh,
    HomeRounded,
    CloseRounded,
    GamepadRounded,
    Code,
    Psychology,
    Cloud,
    Work,
    NorthRounded,
    SouthRounded,
    EastRounded,
    WestRounded,
    NorthWestRounded,
    NorthEastRounded,
    SouthEastRounded,
    SouthWestRounded,
} from '../icons';
import { Navigation } from '../layout/Navigation';
import { IconButton, Grid } from '../mui';
import { TooltipButton } from './TooltipButton';

import { COLORS } from '@/config/theme';

export { TooltipButton };

export const ICON_MAP = {
    Code: Code,
    Psychology: Psychology,
    Cloud: Cloud,
    Work: Work,
    NorthWest: NorthWestRounded,
    NorthEast: NorthEastRounded,
    SouthEast: SouthEastRounded,
    SouthWest: SouthWestRounded,
} as const;

/**
 * Props for the HomeButton component.
 */
interface HomeButtonProps {
    /** Whether to hide the button entirely */
    hide?: boolean;
    /** Additional props passed to TooltipButton */
    [key: string]: unknown;
}

/**
 * A standardized button that navigates the user back to the home page.
 * Uses a house icon and includes a "Navigate to Home" tooltip.
 *
 * @param props - HomeButton components props
 * @returns Home arrow button or null if hidden
 */
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

/**
 * Props for the RandomButton component.
 */
interface RandomButtonProps {
    /** Tooltip and label text */
    title?: string;
    /** Click handler */
    onClick: () => void;
    /** Current status (if used as a toggle) */
    enabled?: boolean;
    /** Tooltip text when enabled */
    enabledTitle?: string;
    /** Tooltip text when disabled */
    disabledTitle?: string;
    /** Whether to visually indicate the enabled/disabled state */
    showToggleState?: boolean;
    /** Whether to hide the button */
    hide?: boolean;
    /** MUI style overrides */
    sx?: SxProps<Theme>;
    /** Additional props passed to TooltipButton */
    [key: string]: unknown;
}

/**
 * A button used to trigger randomization or toggle automatic/random moves.
 * Supports a toggle state with visual feedback.
 *
 * @param props - RandomButton component props
 */
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
            sx={[
                {
                    color:
                        showToggleState && enabled
                            ? COLORS.primary.main
                            : 'inherit',
                    backgroundColor:
                        showToggleState && enabled
                            ? `${COLORS.primary.main}20`
                            : 'transparent',
                },
                ...(Array.isArray(props.sx)
                    ? (props.sx as SxProps<Theme>[])
                    : [props.sx]),
            ]}
            {...props}
        />
    );
}

/**
 * Props for the RefreshButton component.
 */
interface RefreshButtonProps {
    /** Click handler */
    onClick: () => void;
    /** Tooltip and label text */
    title?: string;
    /** Whether to hide the button */
    hide?: boolean;
    /** Additional props passed to TooltipButton */
    [key: string]: unknown;
}

/**
 * A button used to reset a game or generate a new puzzle.
 *
 * @param props - RefreshButton component props
 */
export function RefreshButton({
    onClick,
    title = 'New Puzzle',
    hide = false,
    ...props
}: RefreshButtonProps) {
    if (hide) return null;

    return (
        <TooltipButton
            title={title}
            Icon={Refresh}
            onClick={onClick}
            aria-label={title}
            {...props}
        />
    );
}

/**
 * Props for the Controls container component.
 */
interface ControlsProps {
    /** Logic handler for directional moves (deprecated/placeholder) */
    handler?: (direction: string) => () => void;
    /** Randomization callback */
    onRandom?: () => void;
    /** Randomization toggle status */
    randomEnabled?: boolean;
    /** Refresh/New Puzzle callback */
    onRefresh?: () => void;
    /** Additional action buttons or children */
    children?: React.ReactNode;
    /** Icon size for buttons */
    size?: 'small' | 'medium' | 'large' | 'inherit';
    /** Whether to hide the entire controls bar */
    hide?: boolean;
}

/**
 * A container component for game actions like randomization and refresh.
 * Provides a consistent navigation-style layout for sub-components.
 *
 * @param props - Controls component props
 */
export function Controls({
    handler: _handler,
    onRandom,
    randomEnabled,
    onRefresh,
    children,
    size = 'large',
    hide = false,
}: ControlsProps) {
    const opacity = hide ? 0.8 : 1;

    return (
        <Navigation opacity={opacity}>
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
            {onRefresh && (
                <RefreshButton onClick={onRefresh} hide={hide} size={size} />
            )}
            {children}
        </Navigation>
    );
}

/**
 * Props for the ArrowsButton component.
 */
interface ArrowsButtonProps {
    /** Whether the directional grid is currently visible */
    show?: boolean;
    /** Callback to toggle visibility */
    setShow: (show: boolean) => void;
    /** Logic handler for directional movements */
    handler: (direction: string) => () => void;
    /** Size of the icons */
    size?: 'small' | 'medium' | 'large' | 'inherit';
    /** Whether to hide the component entirely */
    hide?: boolean;
    /** Whether to show diagonal move buttons (8-way instead of 4-way) */
    diagonals?: boolean;
}

/**
 * A directional control component for games requiring d-pad style input.
 * Supports toggling between a single "Gamepad" icon and a full grid of arrows.
 * Can be configured for 4-way (WASD style) or 8-way navigation.
 *
 * @param props - ArrowsButton component props
 */
export function ArrowsButton({
    show = false,
    setShow,
    handler,
    size = 'large',
    hide = false,
    diagonals = false,
}: ArrowsButtonProps) {
    const flip = useCallback(() => {
        setShow(!show);
    }, [show, setShow]);

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

    if (diagonals) {
        return (
            <Grid
                container
                direction="column"
                alignItems="center"
                role="group"
                aria-label="Directional controls"
                sx={{
                    width: 'fit-content',
                    mx: 'auto',
                    gap: 0.5,
                }}
            >
                <Grid container gap={0.5} wrap="nowrap">
                    <TooltipButton
                        title="Move Up Left"
                        Icon={ICON_MAP.NorthWest}
                        onClick={handler('up-left')}
                        aria-label="Move up left"
                        size={size}
                    />
                    <TooltipButton
                        title="Move Up"
                        Icon={NorthRounded}
                        onClick={handler('up')}
                        aria-label="Move up"
                        size={size}
                    />
                    <TooltipButton
                        title="Move Up Right"
                        Icon={ICON_MAP.NorthEast}
                        onClick={handler('up-right')}
                        aria-label="Move up right"
                        size={size}
                    />
                </Grid>
                <Grid container gap={0.5} wrap="nowrap">
                    <TooltipButton
                        title="Move Left"
                        Icon={WestRounded}
                        onClick={handler('left')}
                        aria-label="Move left"
                        size={size}
                    />
                    <IconButton
                        size={size === 'inherit' ? 'large' : size}
                        onClick={flip}
                        aria-label="Hide controls"
                        sx={{
                            color: 'inherit',
                            '&:hover': {
                                backgroundColor: COLORS.interactive.hover,
                            },
                        }}
                    >
                        <CloseRounded fontSize="inherit" aria-hidden="true" />
                    </IconButton>
                    <TooltipButton
                        title="Move Right"
                        Icon={EastRounded}
                        onClick={handler('right')}
                        aria-label="Move right"
                        size={size}
                    />
                </Grid>
                <Grid container gap={0.5} wrap="nowrap">
                    <TooltipButton
                        title="Move Down Left"
                        Icon={ICON_MAP.SouthWest}
                        onClick={handler('down-left')}
                        aria-label="Move down left"
                        size={size}
                    />
                    <TooltipButton
                        title="Move Down"
                        Icon={SouthRounded}
                        onClick={handler('down')}
                        aria-label="Move down"
                        size={size}
                    />
                    <TooltipButton
                        title="Move Down Right"
                        Icon={ICON_MAP.SouthEast}
                        onClick={handler('down-right')}
                        aria-label="Move down right"
                        size={size}
                    />
                </Grid>
            </Grid>
        );
    }

    return (
        <Grid
            container
            direction="column"
            alignItems="center"
            role="group"
            aria-label="Directional controls"
            sx={{
                width: 'fit-content',
                mx: 'auto',
                gap: 0.5,
            }}
        >
            <Grid>
                <TooltipButton
                    title="Move Up"
                    Icon={NorthRounded}
                    onClick={handler('up')}
                    aria-label="Move up"
                    size={size}
                />
            </Grid>
            <Grid
                container
                justifyContent="center"
                alignItems="center"
                gap={1}
                wrap="nowrap"
            >
                <TooltipButton
                    title="Move Left"
                    Icon={WestRounded}
                    onClick={handler('left')}
                    aria-label="Move left"
                    size={size}
                />
                <IconButton
                    size={size === 'inherit' ? 'large' : size}
                    onClick={flip}
                    aria-label="Hide controls"
                    sx={{
                        color: 'inherit',
                        '&:hover': {
                            backgroundColor: COLORS.interactive.hover,
                        },
                    }}
                >
                    <CloseRounded fontSize="inherit" aria-hidden="true" />
                </IconButton>
                <TooltipButton
                    title="Move Right"
                    Icon={EastRounded}
                    onClick={handler('right')}
                    aria-label="Move right"
                    size={size}
                />
            </Grid>
            <Grid>
                <TooltipButton
                    title="Move Down"
                    Icon={SouthRounded}
                    onClick={handler('down')}
                    aria-label="Move down"
                    size={size}
                />
            </Grid>
        </Grid>
    );
}
