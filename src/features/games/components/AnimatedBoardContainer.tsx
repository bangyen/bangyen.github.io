import { styled } from '@mui/material';
import { motion } from 'framer-motion';

export const AnimatedBoardContainer = styled(motion.div)({
    willChange: 'transform, opacity',
});

// Default animation props to be applied to AnimatedBoardContainer
// eslint-disable-next-line react-refresh/only-export-components
export const boardPopIn = {
    initial: { transform: 'scale(0.95)', opacity: 0 },
    animate: { transform: 'scale(1)', opacity: 1 },
    transition: {
        transform: {
            type: 'spring',
            damping: 15,
            stiffness: 200,
        },
        opacity: {
            duration: 0.3,
            ease: 'easeOut',
        },
    },
} as const;
