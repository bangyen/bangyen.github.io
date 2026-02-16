import type { GameControlsProps } from '../components/GameControls';
import type { TrophyOverlayProps } from '../components/TrophyOverlay';

export interface GameFeatureState<
    B = unknown,
    C = unknown,
    L = unknown,
    I = unknown,
> {
    boardProps: B;
    controlsProps: GameControlsProps & C;
    layoutProps: L;
    infoProps: I;
    trophyProps: TrophyOverlayProps;
}
