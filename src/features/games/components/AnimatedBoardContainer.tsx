import { Box, keyframes, styled } from '@mui/material';

const popIn = keyframes`
    0% { transform: scale(0.95); opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
`;

export const AnimatedBoardContainer = styled(Box)(() => ({
    animation: `${popIn} 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)`,
}));
