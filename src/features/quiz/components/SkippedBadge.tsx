import React from 'react';
import { Chip } from '@mui/material';
import { COLORS, TYPOGRAPHY } from '../../../config/theme';
import { QUIZ_UI_CONSTANTS } from '../config/quizConfig';

const SkippedBadge: React.FC = () => (
    <Chip
        label="Skipped"
        size="small"
        variant="outlined"
        sx={{
            height: QUIZ_UI_CONSTANTS.BADGE.HEIGHT,
            fontSize: QUIZ_UI_CONSTANTS.BADGE.FONT_SIZE,
            borderColor: COLORS.surface.error,
            color: COLORS.data.red,
            fontWeight: TYPOGRAPHY.fontWeight.medium,
            '& .MuiChip-label': { px: 1 },
        }}
    />
);

export default SkippedBadge;
