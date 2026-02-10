import { Typography, Grid, Card } from '@mui/material';
import React from 'react';

import { QuizSettings } from '../types/quiz';

import { SPACING, COMPONENT_VARIANTS } from '@/config/theme';

interface QuizSettingsProps<S extends QuizSettings> {
    settings: S;
    onUpdate: (s: S) => void;
    onStart: () => void;
    questions?: { length: number }; // Made optional as it seems unused or mocked
    children?: React.ReactNode;
    title?: string;
    maxQuestionOptions?: number[];
}

const QuizSettingsView = <S extends QuizSettings>({
    settings: _settings,
    onUpdate: _onUpdate,
    onStart: _onStart,
    questions: _questions,
    children,
    title = 'Game Settings',
    maxQuestionOptions: _maxQuestionOptions,
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
