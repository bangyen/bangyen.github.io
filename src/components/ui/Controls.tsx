import React, { useCallback } from 'react';
import { IconButton, Grid } from '../mui';
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
import { Link } from 'react-router-dom';
import type { SxProps, Theme } from '@mui/material/styles';
import { Navigation } from '../layout/Navigation';
import { COLORS } from '../../config/theme';

type IconComponent = React.ElementType;

type IconMap = Record<string, IconComponent>;

export const ICON_MAP: IconMap = {
    Code: Code,
    Psychology: Psychology,
    Cloud: Cloud,
    Work: Work,
    NorthWest: NorthWestRounded,
    NorthEast: NorthEastRounded,
    SouthEast: SouthEastRounded,
    SouthWest: SouthWestRounded,
};

import { TooltipButton } from './TooltipButton';
export { TooltipButton };

interface HomeButtonProps {
    hide?: boolean;
    [key: string]: unknown;
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

interface RandomButtonProps {
    title?: string;
    onClick: () => void;
    enabled?: boolean;
    enabledTitle?: string;
    disabledTitle?: string;
    showToggleState?: boolean;
    hide?: boolean;
    sx?: SxProps<Theme>;
    [key: string]: unknown;
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

interface RefreshButtonProps {
    onClick: () => void;
    title?: string;
    hide?: boolean;
    [key: string]: unknown;
}

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

interface ControlsProps {
    handler?: (direction: string) => () => void;
    onRandom?: () => void;
    randomEnabled?: boolean;
    onRefresh?: () => void;
    children?: React.ReactNode;
    size?: 'small' | 'medium' | 'large' | 'inherit';
    hide?: boolean;
}

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
    size = 'large',
    hide = false,
    diagonals = false,
}: ArrowsButtonProps & { diagonals?: boolean }) {
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
                        Icon={ICON_MAP.NorthWest ?? NorthWestRounded}
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
                        Icon={ICON_MAP.NorthEast ?? NorthEastRounded}
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
                        Icon={ICON_MAP.SouthWest ?? SouthWestRounded}
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
                        Icon={ICON_MAP.SouthEast ?? SouthEastRounded}
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
