import type { SxProps, Theme } from '@mui/material';
import { Box } from '@mui/material';
import React, { useMemo } from 'react';

import { GlobalHeader } from './GlobalHeader';
import { getContainerSx, getMainSx } from './PageLayout.styles';

import { COLORS } from '@/config/theme';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

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
    useDocumentTitle(title);

    const mergedContainerSx = useMemo(
        () => getContainerSx(background, containerSx),
        [background, containerSx],
    );
    const mergedMainSx = useMemo(() => getMainSx(sx), [sx]);

    return (
        <Box onClick={onClick} sx={mergedContainerSx}>
            <GlobalHeader
                showHome={showHome}
                githubUrl={githubUrl}
                infoUrl={infoUrl}
                transparent={headerTransparent}
            />
            <Box component="main" sx={mergedMainSx}>
                {children}
            </Box>
        </Box>
    );
}
