import type { SxProps, Theme } from '@mui/material/styles';
import React from 'react';
import { Link } from 'react-router-dom';

import { Refresh, HomeRounded } from '../icons';
import { TooltipButton } from './TooltipButton';
import { Navigation } from '../layout/Navigation';

import { COLORS } from '@/config/theme';

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
