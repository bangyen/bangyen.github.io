import { Box } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import { Link } from 'react-router-dom';

import { GitHub, HomeRounded as Home, InfoRounded as Info } from '../icons';
import { MenuButton } from './ProjectMenu';
import { ThemeToggle } from '../ui/ThemeToggle';
import { TooltipButton } from '../ui/TooltipButton';

import { URLS } from '@/config/constants';
import { COLORS, LAYOUT } from '@/config/theme';

/**
 * Returns the root header bar styles. The background switches between
 * transparent and the surface colour depending on the page context.
 */
const getHeaderSx = (transparent: boolean): SxProps<Theme> => ({
    position: 'relative',
    top: 0,
    left: 0,
    right: 0,
    flexShrink: 0,
    height: {
        xs: LAYOUT.headerHeight.xs,
        md: LAYOUT.headerHeight.md,
    },
    paddingX: { xs: 2, md: 4 },
    paddingY: { xs: 1, md: 1.5 },
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    boxSizing: 'border-box',
    overflow: 'hidden',
    background: transparent ? 'transparent' : COLORS.surface.background,
});

/** Left-hand slot that holds the project menu button. */
const headerLeftSlotSx: SxProps<Theme> = {
    minWidth: 0,
    display: 'flex',
    alignItems: 'center',
};

/** Right-hand slot that holds theme toggle and icon buttons. */
const headerRightSlotSx: SxProps<Theme> = {
    display: 'flex',
    gap: 1,
    alignItems: 'center',
    minWidth: 0,
};

/** Hover style shared by all header icon buttons. */
const iconButtonHoverSx: SxProps<Theme> = {
    '&:hover': {
        backgroundColor: COLORS.interactive.hover,
    },
};

export interface GlobalHeaderProps {
    showHome?: boolean;
    githubUrl?: string;
    infoUrl?: string;
    transparent?: boolean;
}
export function GlobalHeader({
    showHome = false,
    githubUrl = URLS.githubProfile,
    infoUrl,
    transparent = true,
}: GlobalHeaderProps) {
    return (
        <Box
            component="header"
            onClick={e => {
                e.stopPropagation();
            }}
            sx={getHeaderSx(transparent)}
        >
            <Box sx={headerLeftSlotSx}>
                <MenuButton />
            </Box>
            <Box sx={headerRightSlotSx}>
                <ThemeToggle />
                {infoUrl ? (
                    <TooltipButton
                        component="a"
                        href={infoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Documentation"
                        Icon={Info}
                        sx={iconButtonHoverSx}
                    />
                ) : (
                    <TooltipButton
                        component="a"
                        href={githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="View on GitHub"
                        Icon={GitHub}
                        sx={iconButtonHoverSx}
                    />
                )}
                {showHome && (
                    <TooltipButton
                        component={Link}
                        to="/"
                        title="Back to Home"
                        Icon={Home}
                        sx={iconButtonHoverSx}
                    />
                )}
            </Box>
        </Box>
    );
}
