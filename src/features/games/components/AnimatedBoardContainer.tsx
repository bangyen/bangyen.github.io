import { styled } from '@mui/material';
import { motion } from 'framer-motion';

import {
    boardPopIn as boardPopInVariant,
    boardPopInTransition,
} from '../config/animations';

export const AnimatedBoardContainer = styled(motion.div)({
    willChange: 'transform, opacity',
});

// Re-export grouped variants for backward compatibility and convenience
// eslint-disable-next-line react-refresh/only-export-components
export const boardPopIn = {
    ...boardPopInVariant,
    transition: boardPopInTransition,
} as const;
