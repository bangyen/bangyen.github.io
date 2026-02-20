import { Board } from '../../components/Board';
import { GameControls } from '../../components/GameControls';
import { GamePage } from '../../components/GamePage';
import { TrophyOverlay } from '../../components/TrophyOverlay';
import { LightsOutInfo as Info } from '../components/LightsOutInfo';
import { useLightsOutGame } from '../hooks/useLightsOutGame';

import { PAGE_TITLES } from '@/config/constants';

export function LightsOut() {
    const { boardProps, layoutProps, infoProps, gameState, trophyProps } =
        useLightsOutGame();

    return (
        <>
            <GamePage
                title={PAGE_TITLES.lightsOut}
                infoUrl="https://en.wikipedia.org/wiki/Lights_Out_(game)"
            >
                <GamePage.Content>
                    <GamePage.BoardContainer sx={layoutProps.boardSx}>
                        <Board {...boardProps} />
                        <TrophyOverlay
                            show={gameState.solved}
                            {...trophyProps}
                        />
                    </GamePage.BoardContainer>
                </GamePage.Content>
                <GameControls {...gameState.controlsProps}>
                    <GameControls.Refresh />
                    <GameControls.ResizeMinus />
                    <GameControls.ResizePlus />
                    <GameControls.Info onClick={infoProps.toggleOpen} />
                </GameControls>
            </GamePage>
            <Info {...infoProps} />
        </>
    );
}
