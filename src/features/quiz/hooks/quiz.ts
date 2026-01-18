import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { QuizSettings, Question, QuizType, QuizItem } from '../types/quiz';

// Quiz Engine Hook
interface QuizEngineProps<T> {
    initialPool: T[];
    settings: QuizSettings;
    onEndGame: (history: Question<T>[], score: number) => void;
    checkAnswer: (
        input: string,
        item: T,
        settings: QuizSettings
    ) => {
        isCorrect: boolean;
        expected: string;
        points: number;
    };
    advanceDelay?: {
        correct: number;
        incorrect: number;
    };
}

export const useQuizEngine = <T>({
    initialPool,
    settings,
    onEndGame,
    checkAnswer,
    advanceDelay = { correct: 1000, incorrect: 3000 },
}: QuizEngineProps<T>) => {
    const [hasInitialized, setHasInitialized] = useState(false);
    const [history, setHistory] = useState<Question<T>[]>([]);
    const [_pool, setPool] = useState<T[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState<T | null>(null);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [inputValue, setInputValue] = useState('');
    const [showFeedback, setShowFeedback] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [showHint, setShowHint] = useState(false);
    const [score, setScore] = useState(0);

    const historyRef = useRef(history);
    const scoreRef = useRef(score);
    const advanceTimerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        historyRef.current = history;
    }, [history]);
    useEffect(() => {
        scoreRef.current = score;
    }, [score]);

    const initialize = useCallback((newPool: T[]) => {
        const shuffled = [...newPool].sort(() => Math.random() - 0.5);
        return {
            currentQuestion: shuffled.length > 0 ? shuffled[0] : null,
            pool: shuffled.length > 0 ? shuffled.slice(1) : [],
            totalQuestions: shuffled.length,
        };
    }, []);

    useEffect(() => {
        const init = initialize(initialPool);
        setCurrentQuestion(init.currentQuestion);
        setPool(init.pool);
        setTotalQuestions(init.totalQuestions);
        setHistory([]);
        setScore(0);
        setInputValue('');
        setShowFeedback(false);
        setShowHint(false);
        setIsCorrect(null);
        setHasInitialized(true);
    }, [initialPool, initialize]);

    const nextQuestion = useCallback(() => {
        setPool(prevPool => {
            if (prevPool.length === 0) {
                onEndGame(historyRef.current, scoreRef.current);
                return [];
            }

            if (advanceTimerRef.current) {
                clearTimeout(advanceTimerRef.current);
                advanceTimerRef.current = null;
            }

            const next = prevPool[0];
            setCurrentQuestion(next);
            setInputValue('');
            setShowFeedback(false);
            setShowHint(false);
            setIsCorrect(null);
            return prevPool.slice(1);
        });
    }, [onEndGame]);

    const submitAnswer = useCallback(
        (value: string) => {
            if (!currentQuestion || showFeedback) return;

            const {
                isCorrect: correct,
                expected,
                points,
            } = checkAnswer(value, currentQuestion, settings);

            const newQuestion: Question<T> = {
                item: currentQuestion,
                userAnswer: value,
                isCorrect: correct,
                pointsEarned: points,
            };

            setHistory(prev => [...prev, newQuestion]);
            if (correct) {
                setScore(prev => prev + points);
                setFeedbackMessage('Correct!');
                setIsCorrect(true);
            } else {
                setFeedbackMessage(expected);
                setIsCorrect(false);
            }

            setShowFeedback(true);
            advanceTimerRef.current = setTimeout(
                nextQuestion,
                correct ? advanceDelay.correct : advanceDelay.incorrect
            );
        },
        [
            currentQuestion,
            showFeedback,
            checkAnswer,
            settings,
            nextQuestion,
            advanceDelay,
        ]
    );

    const handleSkip = useCallback(() => {
        if (!currentQuestion) return;

        if (showFeedback) {
            nextQuestion();
            return;
        }

        const { expected } = checkAnswer('', currentQuestion, settings);

        const newQuestion: Question<T> = {
            item: currentQuestion,
            userAnswer: '',
            isCorrect: false,
            pointsEarned: 0,
        };

        setHistory(prev => [...prev, newQuestion]);
        setFeedbackMessage(expected);
        setIsCorrect(false);
        setShowFeedback(true);

        advanceTimerRef.current = setTimeout(
            nextQuestion,
            advanceDelay.incorrect
        );
    }, [
        currentQuestion,
        showFeedback,
        nextQuestion,
        checkAnswer,
        settings,
        advanceDelay.incorrect,
    ]);

    const handleSubmit = useCallback(
        (e?: React.FormEvent) => {
            e?.preventDefault();
            submitAnswer(inputValue);
        },
        [inputValue, submitAnswer]
    );

    const toggleHint = useCallback(() => {
        setShowHint(prev => !prev);
    }, []);

    return {
        state: {
            history,
            currentQuestion,
            inputValue,
            showFeedback,
            feedbackMessage,
            isCorrect,
            totalQuestions,
            showHint,
            score,
            currentIndex: history.length,
            hasInitialized,
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

// Quiz Filter Hook
interface UseQuizFilterProps {
    data: QuizItem[];
    quizType: QuizType;
    settings: QuizSettings;
}

export const useQuizFilter = ({
    data,
    quizType,
    settings,
}: UseQuizFilterProps) => {
    return useMemo(() => {
        let filtered = data;

        if (
            settings.filterLanguage &&
            settings.filterLanguage !== 'All' &&
            quizType === 'cctld'
        ) {
            if (settings.filterLanguage === 'Non-English') {
                filtered = filtered.filter(
                    (item: any) => item.language !== 'English'
                );
            } else {
                filtered = filtered.filter(
                    (item: any) => item.language === settings.filterLanguage
                );
            }
        }

        if (
            settings.filterZone &&
            settings.filterZone !== 'All' &&
            quizType === 'telephone'
        ) {
            const zones = settings.filterZone.split(',');
            filtered = filtered.filter((item: any) =>
                zones.some((z: string) => item.code.startsWith(`+${z}`))
            );
        }

        if (
            settings.filterConvention &&
            settings.filterConvention !== 'All' &&
            quizType === 'vehicle'
        ) {
            filtered = filtered.filter(
                (item: any) =>
                    item.conventions &&
                    item.conventions.includes(Number(settings.filterConvention))
            );
        }

        if (
            settings.filterSwitch &&
            settings.filterSwitch !== 'All' &&
            quizType === 'driving_side'
        ) {
            filtered = filtered.filter((item: any) =>
                settings.filterSwitch === 'Switched'
                    ? item.switched
                    : !item.switched
            );
        }

        if (settings.filterLetter) {
            let letters = settings.filterLetter
                .toLowerCase()
                .split(',')
                .map((l: string) => l.trim())
                .filter((l: string) => l);

            if (letters.length <= 1 && !settings.filterLetter.includes(',')) {
                const spaceSplit = settings.filterLetter
                    .toLowerCase()
                    .split(/\s+/)
                    .filter((l: string) => l);
                if (spaceSplit.length > 1) {
                    letters = spaceSplit;
                } else {
                    letters = settings.filterLetter
                        .toLowerCase()
                        .split('')
                        .filter((l: string) => l.trim());
                }
            }

            if (letters.length > 0) {
                filtered = filtered.filter((item: any) => {
                    let text = '';
                    if (quizType === 'cctld') {
                        text =
                            settings.mode === 'toCountry'
                                ? item.code.toLowerCase().replace('.', '')
                                : item.country.toLowerCase();
                    } else if (quizType === 'driving_side') {
                        text = item.country.toLowerCase();
                    } else if (quizType === 'telephone') {
                        text = item.country.toLowerCase();
                    } else if (quizType === 'vehicle') {
                        text =
                            settings.mode === 'toCountry'
                                ? item.code.toLowerCase()
                                : item.country.toLowerCase();
                    }
                    return letters.some((l: string) => text.startsWith(l));
                });
            }
        }

        if (settings.maxQuestions !== 'All') {
            return [...filtered]
                .sort(() => Math.random() - 0.5)
                .slice(0, settings.maxQuestions as number);
        }
        return filtered;
    }, [data, quizType, settings]);
};
