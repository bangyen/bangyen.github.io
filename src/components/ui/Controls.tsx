import React from 'react';
import { Link } from 'react-router-dom';

import { Refresh, HomeRounded } from '../icons';
import { TooltipButton } from './TooltipButton';

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
