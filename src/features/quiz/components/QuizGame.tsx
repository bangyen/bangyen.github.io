import React, { useEffect, useRef } from 'react';
import { Button, Typography } from '@mui/material';
import { useQuizEngine } from '../hooks/quiz';
import QuizGameView from './QuizGameView';
import {
    CCTLD,
    QuizType,
    QuizSettings,
    Question,
    QuizItem,
} from '../types/quiz';
import { QUIZ_CONFIGS, QUIZ_UI_CONSTANTS } from '../config/quizConfig';
import { COLORS, SHADOWS, SPACING } from '../../../config/theme';

interface QuizGameProps {
    quizType: QuizType;
    settings: QuizSettings;
    initialPool: QuizItem[];
    onEndGame: (history: Question<QuizItem>[], score: number) => void;
    onBackToMenu: () => void;
}

const QuizGame: React.FC<QuizGameProps> = ({
    quizType,
    settings,
    initialPool,
    onEndGame,
    onBackToMenu,
}) => {
    const config = QUIZ_CONFIGS[quizType];
    const { state, actions } = useQuizEngine<QuizItem>({
        initialPool,
        settings,
        onEndGame,
        checkAnswer: config.checkAnswer,
    });

    const { currentQuestion, showFeedback } = state;

    const inputRef = useRef<HTMLInputElement>(null);
    const nextButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (showFeedback) {
            nextButtonRef.current?.focus();
        } else {
            requestAnimationFrame(() => {
                inputRef.current?.focus();
            });
        }
    }, [showFeedback, currentQuestion]);

    // Special handling for Driving Side which uses custom component inputs
    if (quizType === 'driving_side' && settings.mode !== 'toCountry') {
        return (
            <QuizGameView
                gameState={state}
                actions={actions}
                onBackToMenu={onBackToMenu}
                modeLabel="Guessing Side"
                hideInput={true}
                hideHint={true}
                renderQuestionPrompt={() =>
                    config.renderQuestionPrompt(settings.mode)
                }
                onKeyDown={e => {
                    if (state.showFeedback) return;
                    if (e.key === 'ArrowLeft') {
                        e.preventDefault();
                        actions.submitAnswer('Left');
                    } else if (e.key === 'ArrowRight') {
                        e.preventDefault();
                        actions.submitAnswer('Right');
                    }
                }}
                renderQuestionContent={item =>
                    config.renderQuestionContent(item, settings.mode)
                }
                renderCustomActions={(state, actions) => (
                    <>
                        <Button
                            variant="contained"
                            onClick={() => actions.submitAnswer?.('Left')}
                            disabled={state.showFeedback}
                            sx={{
                                flex: 1,
                                py: QUIZ_UI_CONSTANTS.ACTION_BUTTON.PY,
                                whiteSpace: 'nowrap',
                                '&.Mui-disabled': {
                                    backgroundColor:
                                        COLORS.interactive.disabled,
                                    color: COLORS.interactive.disabledText,
                                    borderColor: 'transparent',
                                },
                            }}
                        >
                            Left
                        </Button>
                        <Button
                            variant="contained"
                            onClick={() => actions.submitAnswer?.('Right')}
                            disabled={state.showFeedback}
                            sx={{
                                flex: 1,
                                py: QUIZ_UI_CONSTANTS.ACTION_BUTTON.PY,
                                whiteSpace: 'nowrap',
                                '&.Mui-disabled': {
                                    backgroundColor:
                                        COLORS.interactive.disabled,
                                    color: COLORS.interactive.disabledText,
                                    borderColor: 'transparent',
                                },
                            }}
                        >
                            Right
                        </Button>
                    </>
                )}
                renderHint={() => (
                    <Typography variant="body2">
                        Think about the region and historical influences.
                    </Typography>
                )}
                renderFeedbackOrigin={config.renderFeedbackOrigin}
            />
        );
    }

    return (
        <QuizGameView
            gameState={state}
            actions={actions}
            onBackToMenu={onBackToMenu}
            inputRef={inputRef}
            nextButtonRef={nextButtonRef}
            modeLabel={
                settings.mode === 'toCountry'
                    ? 'Guessing Country'
                    : settings.mode === 'toCode'
                      ? 'Guessing Code'
                      : 'Quiz'
            }
            inputPlaceholder={
                settings.mode === 'toCountry'
                    ? 'Type country name...'
                    : 'Type answer...'
            }
            renderQuestionPrompt={() =>
                config.renderQuestionPrompt(settings.mode)
            }
            renderQuestionContent={item =>
                config.renderQuestionContent(item, settings.mode)
            }
            renderHint={item => {
                if (quizType === 'cctld') {
                    return (
                        <Typography
                            variant="body2"
                            color="textSecondary"
                            sx={{
                                textAlign: 'center',
                                fontStyle: 'italic',
                            }}
                        >
                            Hint: {(item as CCTLD).language} origin
                        </Typography>
                    );
                }
                return (
                    <Typography variant="body2" color="textSecondary">
                        Hint functionality coming soon...
                    </Typography>
                );
            }}
            hideHint={quizType !== 'cctld'}
            renderFeedbackFlag={item =>
                item.flag && (
                    <img
                        src={item.flag}
                        alt={`Flag of ${item.country}`}
                        style={{
                            height: `${QUIZ_UI_CONSTANTS.FEEDBACK.FLAG_HEIGHT.toString()}px`,
                            width: 'auto',
                            borderRadius: SPACING.borderRadius.sm,
                            boxShadow: SHADOWS.sm,
                        }}
                    />
                )
            }
            renderFeedbackOrigin={config.renderFeedbackOrigin}
        />
    );
};

export default QuizGame;
