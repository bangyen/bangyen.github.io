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
import { ErrorState } from '@/components/ui/ErrorState';
import { COLORS } from '@/config/theme';
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
 * Lightweight placeholder rendered inside the modal while the
 * `GameInfoContent` chunk loads.  Matches the card dimensions so
 * the modal does not resize when the real content appears.
 */
function LoadingContent() {
    return (
        <Box
            sx={{
                ...spreadSx(infoCardSx),
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Typography sx={{ color: COLORS.text.primary }}>
                {GAME_TEXT.info.loading}
            </Typography>
        </Box>
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
                    fallback={<ErrorState message={GAME_TEXT.info.loadError} />}
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
