import { useState, useEffect, useRef, useCallback } from 'react';
import { QuizSettings, Question } from '../types/quiz';

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
    // Helper to compute initial values
    const initialize = useCallback((pool: T[]) => {
        const shuffled = [...pool].sort(() => Math.random() - 0.5);
        return {
            currentQuestion: shuffled.length > 0 ? shuffled[0] : null,
            pool: shuffled.length > 0 ? shuffled.slice(1) : [],
            totalQuestions: shuffled.length,
        };
    }, []);

    // State initialization
    // We use a lazy initializer for the first mount
    const [hasInitialized, setHasInitialized] = useState(false);

    const [history, setHistory] = useState<Question<T>[]>([]);
    const [pool, setPool] = useState<T[]>([]);
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

    // Sync refs
    useEffect(() => {
        historyRef.current = history;
    }, [history]);
    useEffect(() => {
        scoreRef.current = score;
    }, [score]);

    // Handle initial mount and changes to initialPool
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
            if (!currentQuestion || showFeedback) return;

            const {
                isCorrect: correct,
                expected,
                points,
            } = checkAnswer(inputValue, currentQuestion, settings);

            const newQuestion: Question<T> = {
                item: currentQuestion,
                userAnswer: inputValue,
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
            inputValue,
            checkAnswer,
            settings,
            nextQuestion,
            advanceDelay,
        ]
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
        },
    };
};
