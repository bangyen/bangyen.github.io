import type { SxProps, Theme } from '@mui/material';
import React from 'react';

import { Box } from '../mui';
import { GlobalHeader } from './GlobalHeader';

import { COLORS } from '@/config/theme';
import { toSxArray } from '@/utils/muiUtils';

interface PageLayoutProps {
    children: React.ReactNode;
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
 * Provides the global header and a main content area.
 */
export function PageLayout({
    children,
    showHome = true,
    githubUrl,
    infoUrl,
    background = COLORS.surface.background,
    sx = {},
    containerSx = {},
    headerTransparent = true,
    onClick,
}: PageLayoutProps) {
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
