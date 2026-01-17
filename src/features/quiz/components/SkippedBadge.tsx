import React from 'react';
import { Chip } from '@mui/material';
import { COLORS } from '../../../config/theme';

const SkippedBadge: React.FC = () => (
    <Chip
        label="Skipped"
        size="small"
        variant="outlined"
        sx={{
            height: 20,
            fontSize: '0.75rem',
            borderColor: COLORS.surface.error,
            color: COLORS.data.red,
            fontWeight: 'medium',
            '& .MuiChip-label': { px: 1 },
        }}
    />
);

export default SkippedBadge;
