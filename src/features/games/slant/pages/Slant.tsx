import { StandardGameLayout } from '../../components/StandardGameLayout';
import { SlantGameContainer } from '../components/SlantGameContainer';
import { SlantInfo } from '../components/SlantInfo';
import { useSlantGame } from '../hooks/useSlantGame';

import { PAGE_TITLES } from '@/config/constants';

export function Slant() {
    const {
        boardSx,
        infoProps,
        trophyProps,
        controlsProps,
        solved,
        analysis,
        ...boardProps
    } = useSlantGame();

    return (
        <StandardGameLayout
            title={PAGE_TITLES.slant}
            infoUrl="https://en.wikipedia.org/wiki/Slant_(puzzle)"
            boardSx={boardSx}
            boardProps={{
                ...boardProps,
                isAnalysisMode: analysis.active,
                analysis,
            }}
            infoProps={infoProps}
            trophyProps={trophyProps}
            controlsProps={controlsProps}
            solved={solved}
            renderBoard={props => <SlantGameContainer {...props} />}
            InfoComponent={SlantInfo}
        />
    );
}
