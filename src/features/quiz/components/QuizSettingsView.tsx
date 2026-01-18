import React from 'react';
import { Typography, Grid, Card } from '@mui/material';
import { SPACING, COMPONENT_VARIANTS } from '../../../config/theme';
import { QuizSettings } from '../types/quiz';

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
