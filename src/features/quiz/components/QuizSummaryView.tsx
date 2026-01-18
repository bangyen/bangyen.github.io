import React from 'react';
import { Box, Typography, Button, Fade, Stack, Card } from '@mui/material';
import {
    ArrowBackRounded as ArrowBackIcon,
    RefreshRounded as RefreshIcon,
} from '@mui/icons-material';
import { COLORS, SPACING, COMPONENT_VARIANTS } from '../../../config/theme';
import { Question } from '../types/quiz';

interface QuizSummaryViewProps<T> {
    score: number;
    history: Question<T>[];
    onRestart: () => void;
    onBackToMenu: () => void;
    renderHistoryItem: (q: Question<T>, index: number) => React.ReactNode;
}

const QuizSummaryView = <T,>({
    score,
    history,
    onRestart,
    onBackToMenu,
    renderHistoryItem,
}: QuizSummaryViewProps<T>) => {
    return (
        <Fade in>
            <Box
                sx={{
                    width: '100%',
                    maxWidth: SPACING.maxWidth.sm,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    mx: 'auto',
                }}
            >
                <Card
                    sx={{
                        ...COMPONENT_VARIANTS.card,
                        p: 4,
                        mb: 4,
                        width: '100%',
                    }}
                >
                    <Typography
                        variant="h4"
                        sx={{ mb: 2, textAlign: 'center' }}
                    >
                        Quiz Complete!
                    </Typography>
                    <Typography
                        variant="h2"
                        sx={{
                            color: COLORS.primary.main,
                            mb: 4,
                            textAlign: 'center',
                        }}
                    >
                        {score} / {history.length}
                    </Typography>

                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: 2,
                        }}
                    >
                        <Button
                            variant="contained"
                            startIcon={<RefreshIcon />}
                            onClick={onRestart}
                            sx={{ flex: 1 }}
                        >
                            Replay
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<ArrowBackIcon />}
                            onClick={onBackToMenu}
                            sx={{ flex: 1 }}
                        >
                            Menu
                        </Button>
                    </Box>
                </Card>

                <Typography
                    variant="h6"
                    align="center"
                    sx={{ mb: 2, width: '100%' }}
                >
                    History
                </Typography>
                <Stack
                    spacing={2}
                    sx={{
                        width: '100%',
                    }}
                >
                    {history.map((q, i) => renderHistoryItem(q, i))}
                </Stack>
            </Box>
        </Fade>
    );
};

export default QuizSummaryView;
