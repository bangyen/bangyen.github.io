import React from 'react';
import { Card, Box, Typography } from '@mui/material';
import { CheckCircleRounded as CheckCircleIcon } from '@mui/icons-material';
import { COLORS } from '../../../config/theme';
import { QuizConfig } from '../config/quizConfig';
import SkippedBadge from './SkippedBadge';
import {
    Question,
    QuizItem,
    QuizType,
    QuizSettings,
    CCTLD,
    DrivingSide,
    TelephoneCode,
    VehicleCode,
} from '../types/quiz';

interface QuizHistoryItemProps {
    question: Question<QuizItem>;
    selectedQuiz: QuizType;
    settings: QuizSettings;
    activeConfig: Pick<QuizConfig, 'renderFeedbackOrigin'>;
}

const QuizHistoryItem: React.FC<QuizHistoryItemProps> = ({
    question: q,
    selectedQuiz,
    settings,
    activeConfig,
}) => {
    return (
        <Card
            sx={{
                p: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                bgcolor:
                    q.pointsEarned === 1
                        ? COLORS.surface.success
                        : q.pointsEarned === 0.5
                          ? COLORS.surface.warning
                          : COLORS.surface.error,
                border: `1px solid ${COLORS.border.subtle} `,
                flexShrink: 0,
            }}
        >
            <Box sx={{ textAlign: 'left', flex: 1, minWidth: 0 }}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mb: 1,
                    }}
                >
                    {q.item.flag && (
                        <img
                            src={q.item.flag}
                            alt={`Flag of ${q.item.country}`}
                            style={{
                                height: '16px',
                                width: 'auto',
                                borderRadius: '1px',
                            }}
                        />
                    )}
                    <Typography variant="body1" fontWeight="bold" noWrap>
                        {(() => {
                            if (selectedQuiz === 'driving_side') {
                                return q.item.country;
                            }
                            return settings.mode === 'toCountry'
                                ? (
                                      q.item as
                                          | CCTLD
                                          | TelephoneCode
                                          | VehicleCode
                                  ).code
                                : q.item.country;
                        })()}
                    </Typography>
                </Box>
                <Typography variant="body2" color="textSecondary" noWrap>
                    Answer:{' '}
                    {(() => {
                        if (selectedQuiz === 'driving_side') {
                            return (q.item as DrivingSide).side;
                        }
                        return settings.mode === 'toCountry'
                            ? q.item.country
                            : (q.item as CCTLD | TelephoneCode | VehicleCode)
                                  .code;
                    })()}
                </Typography>
                {activeConfig.renderFeedbackOrigin && (
                    <Box sx={{ mt: 0.5, opacity: 0.8 }}>
                        {activeConfig.renderFeedbackOrigin(q.item)}
                    </Box>
                )}
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: 1,
                    flexShrink: 0,
                    ml: 2,
                }}
            >
                <Typography
                    variant="body2"
                    component="div"
                    sx={{
                        color:
                            q.pointsEarned === 1
                                ? COLORS.data.green
                                : q.pointsEarned === 0.5
                                  ? COLORS.data.amber
                                  : COLORS.data.red,
                        fontWeight: q.pointsEarned > 0 ? 'bold' : 'normal',
                        maxWidth: '150px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: 'block',
                        fontSize: '0.75rem',
                    }}
                >
                    {(() => {
                        const answer = q.userAnswer.trim();
                        if (!answer) return <SkippedBadge />;

                        let normalizedAnswer = answer;
                        if (selectedQuiz === 'cctld') {
                            if (settings.mode === 'toCode') {
                                normalizedAnswer = (
                                    normalizedAnswer.startsWith('.')
                                        ? normalizedAnswer
                                        : '.' + normalizedAnswer
                                ).toLowerCase();
                            } else {
                                normalizedAnswer =
                                    normalizedAnswer.toUpperCase();
                            }
                        } else if (selectedQuiz === 'telephone') {
                            if (settings.mode === 'toCode') {
                                normalizedAnswer = normalizedAnswer.startsWith(
                                    '+'
                                )
                                    ? normalizedAnswer.toUpperCase()
                                    : '+' + normalizedAnswer.toUpperCase();
                            } else {
                                normalizedAnswer =
                                    normalizedAnswer.toUpperCase();
                            }
                        } else {
                            normalizedAnswer = normalizedAnswer.toUpperCase();
                        }

                        return (
                            <Typography component="span" variant="inherit">
                                {normalizedAnswer}
                                {q.pointsEarned === 0.5 && ' (0.5 pts)'}
                            </Typography>
                        );
                    })()}
                </Typography>
                {q.pointsEarned === 1 ? (
                    <CheckCircleIcon fontSize="small" color="success" />
                ) : q.pointsEarned === 0.5 ? (
                    <CheckCircleIcon
                        fontSize="small"
                        sx={{
                            color: COLORS.data.amber,
                        }}
                    />
                ) : (
                    q.userAnswer.trim() && (
                        <CheckCircleIcon fontSize="small" color="error" />
                    )
                )}
            </Box>
        </Card>
    );
};

export default QuizHistoryItem;
