import { StandardGameLayout } from '../../components/StandardGameLayout';
import { LightsOutBoard as Board } from '../components/LightsOutBoard';
import { LightsOutInfo as Info } from '../components/LightsOutInfo';
import { useLightsOutGame } from '../hooks/useLightsOutGame';

import { PAGE_TITLES } from '@/config/constants';

export function LightsOut() {
    const {
        boardSx,
        infoProps,
        trophyProps,
        controlsProps,
        solved,
        ...boardProps
    } = useLightsOutGame();

    return (
        <StandardGameLayout
            title={PAGE_TITLES.lightsOut}
            infoUrl="https://en.wikipedia.org/wiki/Lights_Out_(game)"
            boardSx={boardSx}
            boardProps={boardProps}
            infoProps={infoProps}
            trophyProps={trophyProps}
            controlsProps={controlsProps}
            solved={solved}
            renderBoard={props => <Board {...props} />}
            InfoComponent={Info}
        />
    );
}
