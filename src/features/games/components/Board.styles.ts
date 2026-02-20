import { Box, styled } from '@mui/material';

import { LAYOUT } from '@/config/theme';

export const BoardContainer = styled(Box)({
    display: 'grid',
    placeItems: 'center',
});

export const LayerContainer = styled(Box, {
    shouldForwardProp: prop => prop !== 'isOverlay',
})<{ isOverlay?: boolean }>(({ isOverlay }) => ({
    gridArea: '1/1',
    ...(isOverlay && {
        zIndex: LAYOUT.zIndex.base + 1,
    }),
}));
