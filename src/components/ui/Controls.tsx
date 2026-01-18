import React, { useCallback } from 'react';
import { Tooltip, IconButton, Grid } from '../mui';
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
};

interface TooltipButtonProps {
    Icon: IconComponent;
    title: string;
    [key: string]: unknown;
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

interface ControlsProps {
    handler?: (direction: string) => () => void;
    onRandom?: () => void;
    randomEnabled?: boolean;
    children?: React.ReactNode;
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
