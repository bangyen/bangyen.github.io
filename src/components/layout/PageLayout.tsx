import type { SxProps, Theme } from '@mui/material';
import { Box } from '@mui/material';
import React, { useEffect } from 'react';

import { GlobalHeader } from './GlobalHeader';

import { COLORS } from '@/config/theme';
import { toSxArray } from '@/utils/muiUtils';

export interface PageLayoutProps {
    children: React.ReactNode;
    /** When provided, sets document.title so every page manages its title
     *  through the layout rather than ad-hoc useEffect calls. */
    title?: string;
    showHome?: boolean;
    githubUrl?: string;
    infoUrl?: string;
    background?: string;
    sx?: SxProps<Theme>;
    containerSx?: SxProps<Theme>;
    headerTransparent?: boolean;
    onClick?: (e: React.MouseEvent) => void;
}

/**
 * Base layout component for all pages in the application.
 * Provides the global header, a main content area, and optional
 * document.title management so pages don't need standalone effects.
 */
export function PageLayout({
    children,
    title,
    showHome = true,
    githubUrl,
    infoUrl,
    background = COLORS.surface.background,
    sx = {},
    containerSx = {},
    headerTransparent = true,
    onClick,
}: PageLayoutProps) {
    useEffect(() => {
        if (title) document.title = title;
    }, [title]);
    return (
        <Box
            onClick={onClick}
            sx={
                [
                    {
                        minHeight: '100vh',
                        display: 'flex',
                        flexDirection: 'column',
                        background,
                        position: 'relative',
                        overflow: 'hidden',
                    },
                    ...toSxArray(containerSx),
                ] as SxProps<Theme>
            }
        >
            <GlobalHeader
                showHome={showHome}
                githubUrl={githubUrl}
                infoUrl={infoUrl}
                transparent={headerTransparent}
            />
            <Box
                component="main"
                sx={
                    [
                        {
                            flex: 1,
                            minHeight: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100%',
                            position: 'relative',
                        },
                        ...toSxArray(sx),
                    ] as SxProps<Theme>
                }
            >
                {children}
            </Box>
        </Box>
    );
}
