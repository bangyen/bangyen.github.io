import { Backdrop, Box, Button, Modal, Typography } from '@mui/material';
import React, { Suspense } from 'react';

import {
    infoBackdropSx,
    infoModalSx,
    infoOuterBoxSx,
    infoCardSx,
} from './GameInfo.styles';

import type { GameInfoProps } from './index';

import { Refresh } from '@/components/icons';
import { ErrorBoundary } from '@/components/layout/ErrorBoundary';
import { ErrorCard } from '@/components/ui/ErrorCard';
import { errorButtonSx } from '@/components/ui/ErrorCard.styles';
import { COLORS, SPACING } from '@/config/theme';
import { GAME_TEXT } from '@/features/games/config/constants';
import { lazyNamed } from '@/utils/lazyNamed';
import { spreadSx } from '@/utils/muiUtils';

const GameInfoContentLazy = lazyNamed(
    () => import('./index'),
    'GameInfoContent',
);

/** Shared DOM id linking the Modal's `aria-labelledby` to the step title. */
const TITLE_ID = 'game-info-title';

/**
 * Card-shaped container used for both the loading and error placeholders
 * inside the modal.  Matches the `infoCardSx` dimensions so the modal
 * never resizes when swapping between states.
 */
function ModalPlaceholder({ children }: { children: React.ReactNode }) {
    return (
        <Box
            sx={{
                ...spreadSx(infoCardSx),
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            {children}
        </Box>
    );
}

/**
 * Lightweight loading text rendered inside the modal while the
 * `GameInfoContent` chunk loads.
 */
function LoadingContent() {
    return (
        <ModalPlaceholder>
            <Typography sx={{ color: COLORS.text.primary }}>
                {GAME_TEXT.info.loading}
            </Typography>
        </ModalPlaceholder>
    );
}

interface ErrorContentProps {
    error: Error | null;
    resetErrorBoundary: () => void;
}

/**
 * Error fallback rendered inside the modal when the `GameInfoContent`
 * chunk fails to load (e.g. network error).  Provides a Retry button
 * so the user can re-attempt the lazy load without closing the modal.
 */
function ErrorContent({ error, resetErrorBoundary }: ErrorContentProps) {
    const devDetail = (typeof process === 'undefined'
        ? import.meta.env.DEV
        : process.env['NODE_ENV'] === 'development') &&
        error && (
            <Box
                sx={{
                    backgroundColor: COLORS.surface.elevated,
                    border: `1px solid ${COLORS.border.subtle}`,
                    borderRadius: SPACING.borderRadius.md,
                    padding: 2,
                    marginBottom: 3,
                    textAlign: 'left',
                    overflow: 'auto',
                    maxHeight: '150px',
                    width: '100%',
                }}
            >
                <Typography
                    sx={{
                        color: COLORS.text.secondary,
                        fontSize: '0.75rem',
                        fontFamily: 'monospace',
                        whiteSpace: 'pre-wrap',
                        overflowWrap: 'anywhere',
                    }}
                >
                    {error.toString()}
                </Typography>
            </Box>
        );

    return (
        <ModalPlaceholder>
            <ErrorCard
                title="Failed to Load"
                message="Please check your connection and try again."
                detail={devDetail || undefined}
                sx={{
                    boxShadow: 'none',
                    background: 'transparent',
                    height: 'auto',
                    p: 0,
                }}
            >
                <Button
                    variant="contained"
                    startIcon={<Refresh />}
                    onClick={resetErrorBoundary}
                    sx={errorButtonSx}
                >
                    Retry
                </Button>
            </ErrorCard>
        </ModalPlaceholder>
    );
}

/**
 * Lazy-loading wrapper that renders the Modal shell eagerly and
 * lazy-loads only the inner `GameInfoContent`.
 *
 * Because the Modal (and its backdrop) mount synchronously, there is
 * a single backdrop transition regardless of chunk-load time.  The
 * `Suspense` boundary sits inside the Modal, swapping from a
 * lightweight loading placeholder to the full content without
 * tearing down or re-animating the overlay.
 */
export function LazyGameInfo(props: GameInfoProps): React.ReactElement | null {
    if (!props.open) return null;

    const { open: _open, ...contentProps } = props;

    return (
        <Modal
            open
            onClose={props.toggleOpen}
            aria-labelledby={TITLE_ID}
            slots={{ backdrop: Backdrop }}
            slotProps={{ backdrop: { sx: infoBackdropSx } }}
            sx={infoModalSx}
        >
            <Box sx={infoOuterBoxSx} role="document">
                <ErrorBoundary FallbackComponent={ErrorContent}>
                    <Suspense fallback={<LoadingContent />}>
                        <GameInfoContentLazy
                            {...contentProps}
                            titleId={TITLE_ID}
                        />
                    </Suspense>
                </ErrorBoundary>
            </Box>
        </Modal>
    );
}
