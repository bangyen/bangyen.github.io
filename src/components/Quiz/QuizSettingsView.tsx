import React from 'react';
import {
    Typography,
    Grid,
    Button,
    TextField,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Card,
} from '@mui/material';
import { COLORS, SPACING, COMPONENT_VARIANTS } from '../../config/theme';
import { QuizSettings } from '../../types/quiz';

interface QuizSettingsProps<S extends QuizSettings> {
    settings: S;
    onUpdate: (s: S) => void;
    onStart: () => void;
    children?: React.ReactNode;
    title?: string;
    maxQuestionOptions: number[];
}

const QuizSettingsView = <S extends QuizSettings>({
    settings,
    onUpdate,
    onStart,
    children,
    title = 'Game Settings',
    maxQuestionOptions,
}: QuizSettingsProps<S>) => {
    const commonSelectProps = {
        MenuProps: {
            BackdropProps: {
                sx: { backdropFilter: 'none', backgroundColor: 'transparent' },
            },
        },
    };

    return (
        <Card
            sx={{
                ...COMPONENT_VARIANTS.card,
                p: 3,
                mb: 4,
                width: '100%',
                maxWidth: SPACING.maxWidth.sm,
                mx: 'auto',
            }}
        >
            <Typography variant="h5" sx={{ mb: 3, textAlign: 'center' }}>
                {title}
            </Typography>
            <Grid container spacing={3}>
                {children}
                <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                        <InputLabel>Question Limit</InputLabel>
                        <Select
                            value={settings.maxQuestions}
                            label="Question Limit"
                            onChange={e =>
                                onUpdate({
                                    ...settings,
                                    maxQuestions: e.target.value as
                                        | number
                                        | 'All',
                                })
                            }
                            sx={{
                                color: COLORS.text.primary,
                                '.MuiOutlinedInput-notchedOutline': {
                                    borderColor: COLORS.border.subtle,
                                },
                            }}
                            {...commonSelectProps}
                        >
                            <MenuItem value="All">All</MenuItem>
                            {maxQuestionOptions.map(opt => (
                                <MenuItem key={opt} value={opt}>
                                    {opt}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
        </Card>
    );
};

export default QuizSettingsView;
