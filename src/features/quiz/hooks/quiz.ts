import { useReducer, useEffect, useRef, useCallback, useMemo } from 'react';
import { QuizItem, QuizSettings, QuizType, Question } from '../types/quiz';
import { QUIZ_CONFIGS } from '../config/quizConfig';
import { applyQuestionLimit } from '../config/quizFilters';

/**
 * State managed by the quiz engine reducer.
 */
interface QuizEngineState<T> {
    /** Whether the quiz has been initialized */
    hasInitialized: boolean;
    /** History of all answered questions */
    history: Question<T>[];
    /** Remaining questions in the pool */
    pool: T[];
    /** Current question being displayed */
    currentQuestion: T | null;
    /** Total number of questions in the quiz */
    totalQuestions: number;
    /** Current input value from the user */
    inputValue: string;
    /** Whether feedback is currently being shown */
    showFeedback: boolean;
    /** Feedback message to display */
    feedbackMessage: string;
    /** Whether the last answer was correct (null if no answer yet) */
    isCorrect: boolean | null;
    /** Whether the hint is currently visible */
    showHint: boolean;
    /** Current score */
    score: number;
}

/**
 * Actions that can be dispatched to the quiz engine reducer.
 */
type QuizEngineAction<T> =
    | {
          type: 'INITIALIZE';
          payload: {
              pool: T[];
              totalQuestions: number;
              currentQuestion: T | null;
          };
      }
    | { type: 'NEXT_QUESTION' }
    | {
          type: 'SUBMIT_ANSWER';
          payload: {
              question: Question<T>;
              feedbackMessage: string;
              points: number;
          };
      }
    | {
          type: 'SKIP_QUESTION';
          payload: { question: Question<T>; feedbackMessage: string };
      }
    | { type: 'SET_INPUT'; payload: string }
    | { type: 'TOGGLE_HINT' }
    | { type: 'END_GAME' };

/**
 * Reducer for managing quiz engine state.
 * Centralizes all state transitions for better predictability and debugging.
 */
function quizEngineReducer<T>(
    state: QuizEngineState<T>,
    action: QuizEngineAction<T>
): QuizEngineState<T> {
    switch (action.type) {
        case 'INITIALIZE':
            return {
                ...state,
                pool: action.payload.pool,
                currentQuestion: action.payload.currentQuestion,
                totalQuestions: action.payload.totalQuestions,
                history: [],
                score: 0,
                inputValue: '',
                showFeedback: false,
                showHint: false,
                isCorrect: null,
                hasInitialized: true,
            };

        case 'NEXT_QUESTION': {
            if (state.pool.length === 0) {
                return { ...state, currentQuestion: null };
            }
            const next = state.pool[0] ?? null;
            return {
                ...state,
                currentQuestion: next,
                pool: state.pool.slice(1),
                inputValue: '',
                showFeedback: false,
                showHint: false,
                isCorrect: null,
            };
        }

        case 'SUBMIT_ANSWER':
            return {
                ...state,
                history: [...state.history, action.payload.question],
                score: action.payload.question.isCorrect
                    ? state.score + action.payload.points
                    : state.score,
                feedbackMessage: action.payload.feedbackMessage,
                isCorrect: action.payload.question.isCorrect,
                showFeedback: true,
            };

        case 'SKIP_QUESTION':
            return {
                ...state,
                history: [...state.history, action.payload.question],
                feedbackMessage: action.payload.feedbackMessage,
                isCorrect: false,
                showFeedback: true,
            };

        case 'SET_INPUT':
            return {
                ...state,
                inputValue: action.payload,
            };

        case 'TOGGLE_HINT':
            return {
                ...state,
                showHint: !state.showHint,
            };

        case 'END_GAME':
            return {
                ...state,
                pool: [],
                currentQuestion: null,
            };

        default:
            return state;
    }
}

/**
 * Props for the quiz engine hook.
 */
interface QuizEngineProps<T> {
    /** Initial pool of questions */
    initialPool: T[];
    /** Quiz settings */
    settings: QuizSettings;
    /** Callback when the game ends */
    onEndGame: (history: Question<T>[], score: number) => void;
    /** Function to check if an answer is correct */
    checkAnswer: (
        input: string,
        item: T,
        settings: QuizSettings
    ) => Promise<{
        isCorrect: boolean;
        expected: string;
        points: number;
    }>;
    /** Delay before advancing to next question */
    advanceDelay?: {
        correct: number;
        incorrect: number;
    };
}

/**
 * Custom hook for managing quiz game state and logic.
 *
 * This hook uses useReducer for centralized state management, making state
 * transitions more predictable and easier to debug. All complex state updates
 * like "Submit Answer", "Next Question", and "End Game" are handled through
 * a single reducer function.
 *
 * @template T - Type of quiz items
 * @param props - Configuration for the quiz engine
 * @returns Quiz state and action handlers
 *
 * @example
 * ```tsx
 * const { state, actions } = useQuizEngine({
 *   initialPool: questions,
 *   settings: quizSettings,
 *   onEndGame: (history, score) => console.log('Final score:', score),
 *   checkAnswer: async (input, item, settings) => ({
 *     isCorrect: input === item.answer,
 *     expected: item.answer,
 *     points: 10
 *   })
 * });
 * ```
 */
export const useQuizEngine = <T>({
    initialPool,
    settings,
    onEndGame,
    checkAnswer,
    advanceDelay = { correct: 1000, incorrect: 3000 },
}: QuizEngineProps<T>) => {
    const [state, dispatch] = useReducer(quizEngineReducer<T>, {
        hasInitialized: false,
        history: [],
        pool: [],
        currentQuestion: null,
        totalQuestions: 0,
        inputValue: '',
        showFeedback: false,
        feedbackMessage: '',
        isCorrect: null,
        showHint: false,
        score: 0,
    });

    const advanceTimerRef = useRef<NodeJS.Timeout | null>(null);
    const onEndGameRef = useRef(onEndGame);

    // Keep onEndGame ref up to date
    useEffect(() => {
        onEndGameRef.current = onEndGame;
    }, [onEndGame]);

    /**
     * Initializes the quiz with a shuffled pool of questions.
     */
    const initialize = useCallback((newPool: T[]) => {
        const shuffled = [...newPool].sort(() => Math.random() - 0.5);
        return {
            currentQuestion: shuffled.length > 0 ? (shuffled[0] ?? null) : null,
            pool: shuffled.length > 0 ? shuffled.slice(1) : [],
            totalQuestions: shuffled.length,
        };
    }, []);

    // Initialize quiz when pool changes
    useEffect(() => {
        const init = initialize(initialPool);
        dispatch({
            type: 'INITIALIZE',
            payload: init,
        });
    }, [initialPool, initialize]);

    /**
     * Advances to the next question or ends the game if no questions remain.
     */
    const nextQuestion = useCallback(() => {
        if (advanceTimerRef.current) {
            clearTimeout(advanceTimerRef.current);
            advanceTimerRef.current = null;
        }

        if (state.pool.length === 0) {
            dispatch({ type: 'END_GAME' });
            onEndGameRef.current(state.history, state.score);
            return;
        }

        dispatch({ type: 'NEXT_QUESTION' });
    }, [state.pool.length, state.history, state.score]);

    /**
     * Submits an answer and schedules advancement to the next question.
     */
    const submitAnswer = useCallback(
        async (value: string) => {
            if (!state.currentQuestion || state.showFeedback) return;

            const {
                isCorrect: correct,
                expected,
                points,
            } = await checkAnswer(value, state.currentQuestion, settings);

            const newQuestion: Question<T> = {
                id: crypto.randomUUID(),
                item: state.currentQuestion,
                userAnswer: value,
                isCorrect: correct,
                pointsEarned: points,
            };

            dispatch({
                type: 'SUBMIT_ANSWER',
                payload: {
                    question: newQuestion,
                    feedbackMessage: correct ? 'Correct!' : expected,
                    points,
                },
            });

            advanceTimerRef.current = setTimeout(
                nextQuestion,
                correct ? advanceDelay.correct : advanceDelay.incorrect
            );
        },
        [
            state.currentQuestion,
            state.showFeedback,
            checkAnswer,
            settings,
            nextQuestion,
            advanceDelay,
        ]
    );

    /**
     * Skips the current question and shows the correct answer.
     */
    const handleSkip = useCallback(async () => {
        if (!state.currentQuestion) return;

        if (state.showFeedback) {
            nextQuestion();
            return;
        }

        const { expected } = await checkAnswer(
            '',
            state.currentQuestion,
            settings
        );

        const newQuestion: Question<T> = {
            id: crypto.randomUUID(),
            item: state.currentQuestion,
            userAnswer: '',
            isCorrect: false,
            pointsEarned: 0,
        };

        dispatch({
            type: 'SKIP_QUESTION',
            payload: {
                question: newQuestion,
                feedbackMessage: expected,
            },
        });

        advanceTimerRef.current = setTimeout(
            nextQuestion,
            advanceDelay.incorrect
        );
    }, [
        state.currentQuestion,
        state.showFeedback,
        nextQuestion,
        checkAnswer,
        settings,
        advanceDelay.incorrect,
    ]);

    /**
     * Handles form submission.
     */
    const handleSubmit = useCallback(
        async (e?: React.SyntheticEvent) => {
            e?.preventDefault();
            await submitAnswer(state.inputValue);
        },
        [state.inputValue, submitAnswer]
    );

    /**
     * Toggles hint visibility.
     */
    const toggleHint = useCallback(() => {
        dispatch({ type: 'TOGGLE_HINT' });
    }, []);

    /**
     * Updates the input value.
     */
    const setInputValue = useCallback((value: string) => {
        dispatch({ type: 'SET_INPUT', payload: value });
    }, []);

    return {
        state: {
            history: state.history,
            currentQuestion: state.currentQuestion,
            inputValue: state.inputValue,
            showFeedback: state.showFeedback,
            feedbackMessage: state.feedbackMessage,
            isCorrect: state.isCorrect,
            totalQuestions: state.totalQuestions,
            showHint: state.showHint,
            score: state.score,
            currentIndex: state.history.length,
            hasInitialized: state.hasInitialized,
        },
        actions: {
            setInputValue,
            handleSubmit,
            handleSkip,
            toggleHint,
            nextQuestion,
            submitAnswer,
        },
    };
};

/**
 * Props for the quiz filter hook.
 */
interface UseQuizFilterProps {
    /** Quiz items to filter */
    data: QuizItem[];
    /** Type of quiz */
    quizType: QuizType;
    /** Quiz settings containing filter criteria */
    settings: QuizSettings;
}

/**
 * Custom hook for filtering quiz items based on settings.
 *
 * Applies all configured filters for the quiz type and limits the number
 * of questions based on settings. Results are memoized for performance.
 *
 * @param props - Filter configuration
 * @returns Filtered array of quiz items
 *
 * @example
 * ```tsx
 * const filteredQuestions = useQuizFilter({
 *   data: allQuestions,
 *   quizType: 'cctld',
 *   settings: { filterLanguage: 'English', maxQuestions: 10 }
 * });
 * ```
 */
export const useQuizFilter = ({
    data,
    quizType,
    settings,
}: UseQuizFilterProps) => {
    return useMemo(() => {
        const config = QUIZ_CONFIGS[quizType];
        let filtered = data;

        // Apply all configured filters for this quiz type
        // Config might be undefined for unknown quiz types (e.g., in tests)
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/prefer-optional-chain
        if (config && config.filters) {
            for (const filterFn of config.filters) {
                filtered = filterFn(filtered, settings);
            }
        }

        // Apply question limit (randomization + slicing)
        filtered = applyQuestionLimit(filtered, settings);

        return filtered;
    }, [data, quizType, settings]);
};
