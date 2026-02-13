import React from 'react';

import { RESEARCH_STYLES } from '../../config/constants';

import { HelpOutlineRounded, CloseRounded } from '@/components/icons';
import {
    Box,
    Typography,
    TextField,
    Button,
    Tooltip,
    IconButton,
} from '@/components/mui';
import { COLORS, TYPOGRAPHY } from '@/config/theme';

interface SolvabilityHeaderProps {
    n: string;
    loading: boolean;
    onNChange: (value: string) => void;
    onAnalyze: () => void;
    onCancel: () => void;
}

export const SolvabilityHeader: React.FC<SolvabilityHeaderProps> = ({
    n,
    loading,
    onNChange,
    onAnalyze,
    onCancel,
}) => {
    return (
        <>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography
                    variant="h6"
                    sx={{
                        color: COLORS.text.primary,
                        fontWeight: TYPOGRAPHY.fontWeight.bold,
                    }}
                >
                    Solvability Analyzer
                </Typography>
                <Tooltip title="Analyze the solvability and kernel properties for a square n x n grid.">
                    <IconButton
                        size="small"
                        sx={{ ml: 1, color: COLORS.text.secondary }}
                        aria-label="Solvability analyzer documentation"
                    >
                        <HelpOutlineRounded fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Box>
            <Box sx={{ mb: 3 }}>
                <TextField
                    fullWidth
                    label="Grid Size (n)"
                    variant="outlined"
                    value={n}
                    onChange={e => {
                        onNChange(e.target.value);
                    }}
                    size="small"
                    sx={{ input: { color: COLORS.text.primary } }}
                />
            </Box>
            {loading ? (
                <Button
                    fullWidth
                    variant="outlined"
                    onClick={onCancel}
                    startIcon={<CloseRounded />}
                    sx={{
                        color: COLORS.text.secondary,
                        borderColor: COLORS.border.subtle,
                        height: RESEARCH_STYLES.LAYOUT.BUTTON_HEIGHT,
                        '&:hover': {
                            backgroundColor: RESEARCH_STYLES.GLASS.SLIGHT,
                            borderColor: COLORS.text.secondary,
                        },
                    }}
                >
                    Cancel Analysis
                </Button>
            ) : (
                <Button
                    fullWidth
                    variant="contained"
                    onClick={onAnalyze}
                    sx={{
                        backgroundColor: COLORS.primary.main,
                        border: '1px solid transparent',
                        height: RESEARCH_STYLES.LAYOUT.BUTTON_HEIGHT,
                        '&:hover': { backgroundColor: COLORS.primary.dark },
                    }}
                >
                    Analyze Solvability
                </Button>
            )}
        </>
    );
};
