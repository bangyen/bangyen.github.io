import React from 'react';
import { Typography, Grid, Card } from '@mui/material';
import { SPACING, COMPONENT_VARIANTS } from '../../../config/theme';
import { QuizSettings } from '../types/quiz';

interface QuizSettingsProps<S extends QuizSettings> {
    _settings: S;
    _onUpdate: (s: S) => void;
    _onStart: () => void;
    _questions: { length: number };
    children?: React.ReactNode;
    title?: string;
    _maxQuestionOptions?: number[];
}

const QuizSettingsView = <S extends QuizSettings>({
    _settings,
    _onUpdate,
    _onStart,
    _questions,
    children,
    title = 'Game Settings',
    _maxQuestionOptions,
}: QuizSettingsProps<S>) => {
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
            </Grid>
        </Card>
    );
};

export default QuizSettingsView;
