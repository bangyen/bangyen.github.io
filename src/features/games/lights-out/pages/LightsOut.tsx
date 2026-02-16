import { Board } from '../../components/Board';
import { GameControls } from '../../components/GameControls';
import { GamePageLayout } from '../../components/GamePageLayout';
import { LightsOutInfo as Info } from '../components/LightsOutInfo';
import { useLightsOutGame } from '../hooks/useLightsOutGame';

import { PAGE_TITLES } from '@/config/constants';

export function LightsOut() {
    const { boardProps, controlsProps, layoutProps, infoProps, trophyProps } =
        useLightsOutGame();

    return (
        <GamePageLayout
            title={PAGE_TITLES.lightsOut}
            infoUrl="https://en.wikipedia.org/wiki/Lights_Out_(game)"
            trophyProps={trophyProps}
            layout={{ boardSx: layoutProps.boardSx }}
            controls={<GameControls {...controlsProps} />}
        >
            <Board {...boardProps} />
            <Info {...infoProps} />
        </GamePageLayout>
    );
}
