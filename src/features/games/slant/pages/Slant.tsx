import { Box } from '@mui/material';

import { StandardGameLayout } from '../../components/StandardGameLayout';
import { SlantGameContainer } from '../components/SlantGameContainer';
import { SlantInfo } from '../components/SlantInfo';
import { useSlantGame } from '../hooks/useSlantGame';

import { PAGE_TITLES } from '@/config/constants';

export function Slant() {
    const {
        state,
        size,
        rows,
        cols,
        cellProps,
        overlayProps,
        boardSx,
        infoProps,
        controlsProps,
        analysis,
        solved,
        generating,
        dimensionsMismatch,
        trophyProps,
    } = useSlantGame();

    return (
        <StandardGameLayout
            title={PAGE_TITLES.slant}
            infoUrl="https://en.wikipedia.org/wiki/Gokigen_Naname"
            boardProps={{
                state,
                size,
                rows,
                cols,
                cellProps,
                overlayProps,
                isAnalysisMode: analysis.active,
                generating,
                dimensionsMismatch,
                analysis,
            }}
            layoutProps={{ boardSx }}
            infoProps={infoProps}
            gameState={{ solved, controlsProps }}
            trophyProps={trophyProps}
            renderBoard={props => (
                <Box onClick={infoProps.handleBoxClick}>
                    <SlantGameContainer {...props} />
                </Box>
            )}
            InfoComponent={SlantInfo}
            onPageClick={analysis.active ? analysis.onClose : undefined}
        />
    );
}
