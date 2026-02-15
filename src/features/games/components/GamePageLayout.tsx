import type { SxProps, Theme } from '@mui/material';
import { Box } from '@mui/material';
import React from 'react';

import { TrophyOverlay, type TrophyOverlayProps } from './TrophyOverlay';
import { BOARD_STYLES } from '../config/constants';

import { ErrorBoundary } from '@/components/layout/ErrorBoundary';
import { FeatureErrorFallback } from '@/components/layout/FeatureErrorFallback';
import { PageLayout } from '@/components/layout/PageLayout';
import { COLORS } from '@/config/theme';
import { toSxArray } from '@/utils/muiUtils';

interface GamePageLayoutProps {
    children: React.ReactNode;
    controls: React.ReactNode;
    infoUrl?: string;
    title?: string;
    background?: string;
    paddingBottom?: string | object;
    contentSx?: SxProps<Theme>;
    /** Props forwarded directly to the TrophyOverlay component. */
    trophyProps?: Partial<TrophyOverlayProps>;
    boardSx?: SxProps<Theme>;
    onClick?: (e: React.MouseEvent) => void;
}

/**
 * Standard layout wrapper for all game pages. Provides sensible defaults
 * for board padding, text selection, trophy colors, and error handling so
 * individual game pages only need to specify what differs.
 */
export function GamePageLayout({
    children,
    controls,
    infoUrl,
    background = COLORS.surface.background,
    paddingBottom = { xs: '80px', md: '120px' },
    contentSx = {},
    trophyProps = {},
    boardSx,
    onClick,
}: GamePageLayoutProps) {
    const {
        show = false,
        onReset,
        size = 0,
        iconSizeRatio = 1,
        primaryColor = COLORS.primary.main,
        secondaryColor = COLORS.primary.main,
        useSecondary,
        showLabel,
    } = trophyProps;

    return (
        <ErrorBoundary
            FallbackComponent={FeatureErrorFallback}
            fallbackProps={{ title: 'Game Error', resetLabel: 'Reset Game' }}
        >
            <PageLayout
                infoUrl={infoUrl}
                background={background}
                containerSx={{
                    height: '100vh',
                    transition: 'background 0.5s ease-in-out',
                    cursor: onClick ? 'pointer' : 'inherit',
                }}
                sx={{
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                onClick={onClick}
            >
                <Box
                    sx={
                        [
                            {
                                flex: 1,
                                position: 'relative',
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                overflow: 'hidden',
                                pb: paddingBottom,
                            },
                            ...toSxArray(contentSx),
                        ] as SxProps<Theme>
                    }
                >
                    <Box
                        sx={
                            [
                                {
                                    position: 'relative',
                                    width: 'fit-content',
                                    userSelect: 'none',
                                    padding: {
                                        xs: BOARD_STYLES.PADDING.MOBILE,
                                        sm: BOARD_STYLES.PADDING.DESKTOP,
                                    },
                                    borderRadius: BOARD_STYLES.BORDER_RADIUS,
                                    border: BOARD_STYLES.BORDER,
                                },
                                ...toSxArray(boardSx),
                            ] as SxProps<Theme>
                        }
                    >
                        {children}
                        <TrophyOverlay
                            show={show}
                            onReset={onReset}
                            size={size}
                            iconSizeRatio={iconSizeRatio}
                            primaryColor={primaryColor}
                            secondaryColor={secondaryColor}
                            useSecondary={useSecondary}
                            showLabel={showLabel}
                        />
                    </Box>
                </Box>
                {controls}
            </PageLayout>
        </ErrorBoundary>
    );
}
