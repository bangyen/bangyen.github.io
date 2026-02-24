import { Box, styled } from '@mui/material';

export const BoardContainer = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2rem',
    width: '100%',
    maxWidth: 'max-content',
    margin: '0 auto',
});

export const AnimatedBoardContainer = styled('div')({
    willChange: 'transform, opacity',
    animation: 'board-pop-in 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    '@keyframes board-pop-in': {
        '0%': { transform: 'scale(0.95)', opacity: 0 },
        '100%': { transform: 'scale(1)', opacity: 1 },
    },
});
