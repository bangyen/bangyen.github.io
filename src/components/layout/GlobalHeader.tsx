import { Box } from '@mui/material';
import React from 'react';

import { GitHub, HomeRounded as Home, InfoRounded as Info } from '../icons';
import { ThemeToggle } from '../ui/ThemeToggle';
import { TooltipButton } from '../ui/TooltipButton';

import { URLS } from '@/config/constants';
import { COLORS, LAYOUT } from '@/config/theme';
import { MenuButton } from '@/features/home/components';

export interface GlobalHeaderProps {
    showHome?: boolean;
    githubUrl?: string;
    infoUrl?: string;
    transparent?: boolean;
}
export const GlobalHeader: React.FC<GlobalHeaderProps> = ({
    showHome = false,
    githubUrl = URLS.githubProfile,
    infoUrl,
    transparent = true,
}) => {
    return (
        <Box
            component="header"
            onClick={e => {
                e.stopPropagation();
            }}
            sx={{
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
                background: transparent
                    ? 'transparent'
                    : COLORS.surface.background,
            }}
        >
            <Box sx={{ minWidth: 0, display: 'flex', alignItems: 'center' }}>
                <MenuButton />
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    gap: 1,
                    alignItems: 'center',
                    minWidth: 0,
                }}
            >
                <ThemeToggle />
                {infoUrl ? (
                    <TooltipButton
                        component="a"
                        href={infoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Documentation"
                        Icon={Info}
                        sx={{
                            '&:hover': {
                                backgroundColor: COLORS.interactive.hover,
                            },
                        }}
                    />
                ) : (
                    <TooltipButton
                        component="a"
                        href={githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="View on GitHub"
                        Icon={GitHub}
                        sx={{
                            '&:hover': {
                                backgroundColor: COLORS.interactive.hover,
                            },
                        }}
                    />
                )}
                {showHome && (
                    <TooltipButton
                        component="a"
                        href="/"
                        title="Back to Home"
                        Icon={Home}
                        sx={{
                            '&:hover': {
                                backgroundColor: COLORS.interactive.hover,
                            },
                        }}
                    />
                )}
            </Box>
        </Box>
    );
};
