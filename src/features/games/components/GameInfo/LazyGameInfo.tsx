import React from 'react';

import type { GameInfoProps } from './index';

import { ErrorState } from '@/components/ui/ErrorState';
import { LazySuspense } from '@/components/ui/LazySuspense';
import { GAME_TEXT } from '@/features/games/config/constants';
import { lazyNamed } from '@/utils/lazyNamed';

const GameInfoLazy = lazyNamed(() => import('./index'), 'GameInfo');

/**
 * Lazy-loading wrapper around `GameInfo` that centralises the
 * open-guard, suspense boundary, and error fallback every game's
 * info modal needs.  Individual game Info components can focus
 * exclusively on building game-specific content and props.
 */
export function LazyGameInfo(props: GameInfoProps): React.ReactElement | null {
    if (!props.open) return null;

    return (
        <LazySuspense
            message={GAME_TEXT.info.loading}
            errorFallback={<ErrorState message={GAME_TEXT.info.loadError} />}
        >
            <GameInfoLazy {...props} />
        </LazySuspense>
    );
}
