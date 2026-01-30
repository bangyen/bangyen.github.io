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
    PlayArrowRounded,
    PauseRounded,
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

interface IconMap {
    [key: string]: IconComponent;
}

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

interface AutoPlayButtonProps {
    onClick: () => void;
    enabled?: boolean;
    hide?: boolean;
    [key: string]: unknown;
}

export function AutoPlayButton({
    onClick,
    enabled = false,
    hide = false,
    ...props
}: AutoPlayButtonProps) {
    if (hide) return null;

    return (
        <TooltipButton
            title={enabled ? 'Pause' : 'Auto Play'}
            Icon={enabled ? PauseRounded : PlayArrowRounded}
            onClick={onClick}
            aria-label={enabled ? 'Pause' : 'Auto Play'}
            {...props}
        />
    );
}

interface ControlsProps {
    handler?: (direction: string) => () => void;
    onRandom?: () => void;
    randomEnabled?: boolean;
    onAutoPlay?: () => void;
    autoPlayEnabled?: boolean;
    children?: React.ReactNode;
    size?: 'small' | 'medium' | 'large' | 'inherit';
    hide?: boolean;
}

export function Controls({
    handler: _handler,
    onRandom,
    randomEnabled,
    onAutoPlay,
    autoPlayEnabled,
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
            {onAutoPlay && (
                <AutoPlayButton
                    onClick={onAutoPlay}
                    enabled={autoPlayEnabled}
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
    size = 'large',
    hide = false,
    diagonals = false,
}: ArrowsButtonProps & { diagonals?: boolean }) {
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
                <Grid container gap={0.5}>
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
                <Grid container gap={0.5}>
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
                <Grid container gap={0.5}>
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
