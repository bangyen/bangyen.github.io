import { Board } from '../../components/Board';
import { StandardGameLayout } from '../../components/StandardGameLayout';
import { LightsOutInfo as Info } from '../components/LightsOutInfo';
import { useLightsOutGame } from '../hooks/useLightsOutGame';

import { PAGE_TITLES } from '@/config/constants';

export function LightsOut() {
    const { boardProps, layoutProps, infoProps, gameState, trophyProps } =
        useLightsOutGame();

    return (
        <StandardGameLayout
            title={PAGE_TITLES.lightsOut}
            infoUrl="https://en.wikipedia.org/wiki/Lights_Out_(game)"
            boardProps={boardProps}
            layoutProps={layoutProps}
            infoProps={infoProps}
            gameState={gameState}
            trophyProps={trophyProps}
            showTrophy={gameState.solved}
            renderBoard={props => <Board {...props} />}
            InfoComponent={Info}
        />
    );
}
