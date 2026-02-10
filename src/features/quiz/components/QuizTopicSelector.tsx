import {
    FormControl,
    Select,
    MenuItem,
    SelectChangeEvent,
} from '@mui/material';
import React from 'react';

import { QuizType } from '../types/quiz';

import { COLORS, SPACING, ANIMATIONS } from '@/config/theme';

interface QuizTopicSelectorProps {
    uniqueId: string;
    selectedQuiz: QuizType;
    onQuizChange: (event: SelectChangeEvent<unknown>) => void;
}

const QuizTopicSelector: React.FC<QuizTopicSelectorProps> = ({
    uniqueId,
    selectedQuiz,
    onQuizChange,
}) => {
    return (
        <FormControl
            size="small"
            sx={{
                width: 'auto',
                minWidth: { xs: 180, sm: 200 },
                flexShrink: 0,
                marginRight: { xs: 0, sm: -4 },
                '& .MuiOutlinedInput-root': {
                    ...ANIMATIONS.presets.glass,
                    borderRadius: SPACING.borderRadius.full,
                    color: COLORS.text.primary,
                    fontWeight: 'medium',
                    '& fieldset': {
                        border: `1px solid ${COLORS.border.subtle}`,
                    },
                    '&:hover fieldset': {
                        borderColor: COLORS.primary.main,
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: COLORS.primary.main,
                    },
                },
                '& .MuiSelect-select': {
                    py: 1,
                    px: { xs: 2, sm: 3 },
                    textAlign: 'center',
                },
                '& .MuiSvgIcon-root': {
                    color: COLORS.text.secondary,
                },
            }}
        >
            <Select
                id={uniqueId}
                value={selectedQuiz}
                onChange={onQuizChange}
                MenuProps={{
                    autoFocus: false,
                    BackdropProps: {
                        sx: {
                            backdropFilter: 'none',
                            backgroundColor: 'transparent',
                        },
                    },
                    PaperProps: {
                        sx: {
                            ...ANIMATIONS.presets.glass,
                            borderRadius: SPACING.borderRadius.lg,
                            mt: 1,
                            '& .MuiMenuItem-root': {
                                color: COLORS.text.secondary,
                                transition: ANIMATIONS.transition,
                                '&:hover': {
                                    backgroundColor: COLORS.interactive.hover,
                                    color: COLORS.text.primary,
                                },
                                '&.Mui-selected': {
                                    backgroundColor:
                                        COLORS.interactive.selected,
                                    color: COLORS.primary.main,
                                    fontWeight: 'bold',
                                },
                            },
                        },
                    },
                }}
            >
                <MenuItem value="cctld">Domains</MenuItem>
                <MenuItem value="driving_side">Driving Side</MenuItem>
                <MenuItem value="telephone">Telephone Codes</MenuItem>
                <MenuItem value="vehicle">Vehicle Registration</MenuItem>
            </Select>
        </FormControl>
    );
};

export default QuizTopicSelector;
