import { Backdrop, Typography } from '@mui/material';
import React, { Suspense } from 'react';

import { infoBackdropSx, infoModalSx } from './GameInfo.styles';

import type { GameInfoProps } from './index';

import { ErrorBoundary } from '@/components/layout/ErrorBoundary';
import { ErrorState } from '@/components/ui/ErrorState';
import { COLORS } from '@/config/theme';
import { GAME_TEXT } from '@/features/games/config/constants';
import { lazyNamed } from '@/utils/lazyNamed';
import { spreadSx } from '@/utils/muiUtils';

const GameInfoLazy = lazyNamed(() => import('./index'), 'GameInfo');

/**
 * Full-screen overlay fallback shown while the GameInfo chunk loads.
 *
 * Uses the same backdrop styling as the loaded modal so the user sees
 * a consistent overlay instead of an inline block that shifts the
 * game board layout.
 */
function ModalLoadingFallback() {
    return (
        <Backdrop
            open
            sx={{ ...spreadSx(infoBackdropSx), ...spreadSx(infoModalSx) }}
        >
            <Typography sx={{ color: COLORS.text.primary }}>
                {GAME_TEXT.info.loading}
            </Typography>
        </Backdrop>
    );
}

/**
 * Lazy-loading wrapper around `GameInfo` that centralises the
 * open-guard, suspense boundary, and error fallback every game's
 * info modal needs.  Individual game Info components can focus
 * exclusively on building game-specific content and props.
 *
 * The loading fallback renders as a fixed-position overlay (matching
 * the loaded modal) so it never occupies inline space and cannot
 * shift the game board.
 */
export function LazyGameInfo(props: GameInfoProps): React.ReactElement | null {
    if (!props.open) return null;

    return (
        <ErrorBoundary
            fallback={<ErrorState message={GAME_TEXT.info.loadError} />}
        >
            <Suspense fallback={<ModalLoadingFallback />}>
                <GameInfoLazy {...props} />
            </Suspense>
        </ErrorBoundary>
    );
}
