import { Backdrop, Box, Modal, Typography } from '@mui/material';
import React, { Suspense } from 'react';

import {
    infoBackdropSx,
    infoModalSx,
    infoOuterBoxSx,
    infoCardSx,
} from './GameInfo.styles';

import type { GameInfoProps } from './index';

import { ErrorBoundary } from '@/components/layout/ErrorBoundary';
import { DevErrorDetail } from '@/components/ui/DevErrorDetail';
import {
    TryAgainButton,
    ReturnToGameButton,
} from '@/components/ui/ErrorActions';
import { ErrorCard } from '@/components/ui/ErrorCard';
import { ERROR_TEXT } from '@/config/constants';
import { COLORS } from '@/config/theme';
import { GAME_TEXT } from '@/features/games/config/constants';

const GameInfoContentLazy = React.lazy(() =>
    import('./index').then(m => ({ default: m.GameInfoContent })),
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
                ...(infoCardSx as Record<string, unknown>),
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
    onClose?: () => void;
}

/**
 * Error fallback rendered inside the modal when the `GameInfoContent`
 * chunk fails to load (e.g. network error).  Provides a Retry button
 * so the user can re-attempt the lazy load without closing the modal,
 * and a Return to Game button to exit the modal.
 */
function ErrorContent({
    error,
    resetErrorBoundary,
    onClose,
}: ErrorContentProps) {
    const devDetail = error ? (
        <DevErrorDetail error={error} maxHeight="150px" />
    ) : null;

    return (
        <ModalPlaceholder>
            <ErrorCard
                title={ERROR_TEXT.title.failedToLoad}
                message={ERROR_TEXT.message.failedToLoad}
                detail={devDetail || undefined}
                sx={{
                    boxShadow: 'none',
                    background: 'transparent',
                    height: 'auto',
                }}
            >
                <TryAgainButton onClick={resetErrorBoundary} />
                {onClose && <ReturnToGameButton onClick={onClose} />}
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
                <ErrorBoundary
                    FallbackComponent={ErrorContent}
                    fallbackProps={{ onClose: props.toggleOpen }}
                >
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
