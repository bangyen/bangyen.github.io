import React from 'react';
import { Chip } from '@mui/material';
import { COLORS } from '../../config/theme';

const SkippedBadge: React.FC = () => (
    <Chip
        label="Skipped"
        size="small"
        variant="outlined"
        sx={{
            height: 20,
            fontSize: '0.75rem',
            borderColor: 'rgba(239, 83, 80, 0.3)',
            color: COLORS.data.red,
            fontWeight: 'medium',
            '& .MuiChip-label': { px: 1 },
        }}
    />
);

export default SkippedBadge;
