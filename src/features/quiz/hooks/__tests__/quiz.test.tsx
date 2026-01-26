import { renderHook, act } from '@testing-library/react';
import { useQuizEngine, useQuizFilter } from '../quiz';
import { QuizSettings, QuizType } from '../../types/quiz';

// Mock crypto.randomUUID
Object.defineProperty(global, 'crypto', {
    value: {
        randomUUID: () => 'test-uuid',
    },
});

const mockQuestions = [
    { country: 'Country A', cctld: '.a' },
    { country: 'Country B', cctld: '.b' },
    { country: 'Country C', cctld: '.c' },
];

const mockSettings: QuizSettings = {
    mode: 'toCountry',
    maxQuestions: 10,
    allowRepeats: false,
};

const mockCheckAnswer = jest.fn();
const mockOnEndGame = jest.fn();

describe('useQuizEngine', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    test('initializes correctly', () => {
        const { result } = renderHook(() =>
            useQuizEngine({
                initialPool: mockQuestions,
                settings: mockSettings,
                onEndGame: mockOnEndGame,
                checkAnswer: mockCheckAnswer,
            })
        );

        expect(result.current.state.hasInitialized).toBe(true);
        expect(result.current.state.totalQuestions).toBe(3);
        expect(result.current.state.score).toBe(0);
        expect(result.current.state.currentQuestion).toBeDefined();
        expect(result.current.state.showFeedback).toBe(false);
    });

    test('updates input value', () => {
        const { result } = renderHook(() =>
            useQuizEngine({
                initialPool: mockQuestions,
                settings: mockSettings,
                onEndGame: mockOnEndGame,
                checkAnswer: mockCheckAnswer,
            })
        );

        act(() => {
            result.current.actions.setInputValue('test');
        });
        expect(result.current.state.inputValue).toBe('test');
    });

    test('handles correct answer submission', () => {
        mockCheckAnswer.mockReturnValue({
            isCorrect: true,
            expected: 'A',
            points: 10,
        });

        const { result } = renderHook(() =>
            useQuizEngine({
                initialPool: mockQuestions,
                settings: mockSettings,
                onEndGame: mockOnEndGame,
                checkAnswer: mockCheckAnswer,
                advanceDelay: { correct: 500, incorrect: 1000 },
            })
        );

        act(() => {
            result.current.actions.submitAnswer('A');
        });

        expect(result.current.state.score).toBe(10);
        expect(result.current.state.feedbackMessage).toBe('Correct!');
        expect(result.current.state.isCorrect).toBe(true);
        expect(result.current.state.showFeedback).toBe(true);

        // Fast forward timer to next question
        act(() => {
            jest.advanceTimersByTime(500);
        });

        expect(result.current.state.showFeedback).toBe(false);
        expect(result.current.state.inputValue).toBe('');
    });

    test('handles incorrect answer submission', () => {
        mockCheckAnswer.mockReturnValue({
            isCorrect: false,
            expected: 'Expected A',
            points: 0,
        });

        const { result } = renderHook(() =>
            useQuizEngine({
                initialPool: mockQuestions,
                settings: mockSettings,
                onEndGame: mockOnEndGame,
                checkAnswer: mockCheckAnswer,
            })
        );

        act(() => {
            result.current.actions.submitAnswer('Wrong');
        });

        expect(result.current.state.score).toBe(0);
        expect(result.current.state.feedbackMessage).toBe('Expected A');
        expect(result.current.state.isCorrect).toBe(false);
        expect(result.current.state.showFeedback).toBe(true);
    });

    test('handleSkip works correctly', () => {
        const { result } = renderHook(() =>
            useQuizEngine({
                initialPool: mockQuestions,
                settings: mockSettings,
                onEndGame: mockOnEndGame,
                checkAnswer: () => ({
                    isCorrect: false,
                    expected: 'Skipped',
                    points: 0,
                }),
            })
        );

        act(() => {
            result.current.actions.handleSkip();
        });

        expect(result.current.state.showFeedback).toBe(true);
        expect(result.current.state.feedbackMessage).toBe('Skipped');
    });

    test('skip advances manually if feedback shown', () => {
        const { result } = renderHook(() =>
            useQuizEngine({
                initialPool: mockQuestions,
                settings: mockSettings,
                onEndGame: mockOnEndGame,
                checkAnswer: mockCheckAnswer,
            })
        );

        // Trigger generic feedback state
        act(() => {
            result.current.actions.handleSkip(); // First skip shows feedback
        });
        expect(result.current.state.showFeedback).toBe(true);

        // Second skip (Next) should advance immediately
        act(() => {
            result.current.actions.handleSkip();
        });
        expect(result.current.state.showFeedback).toBe(false);
    });

    test('ends game when questions run out', () => {
        const singleQuestionPool = [mockQuestions[0]]; // Define outside or maintain reference

        const { result } = renderHook(() =>
            useQuizEngine({
                initialPool: singleQuestionPool,
                settings: mockSettings,
                onEndGame: mockOnEndGame,
                checkAnswer: mockCheckAnswer,
            })
        );

        // Answer 1
        act(() => {
            result.current.actions.handleSkip();
        });

        // Advance to finish
        act(() => {
            jest.runAllTimers();
        });

        // Try to go next again (should trigger end game internal check usually happens on nextQuestion call)
        // Actually nextQuestion is called by timer.
        // If pool is empty, it calls onEndGame.

        expect(mockOnEndGame).toHaveBeenCalled();
    });

    test('toggles hint', () => {
        const { result } = renderHook(() =>
            useQuizEngine({
                initialPool: mockQuestions,
                settings: mockSettings,
                onEndGame: mockOnEndGame,
                checkAnswer: mockCheckAnswer,
            })
        );

        act(() => {
            result.current.actions.toggleHint();
        });
        expect(result.current.state.showHint).toBe(true);

        act(() => {
            result.current.actions.toggleHint();
        });
        expect(result.current.state.showHint).toBe(false);
    });

    test('handleSubmit calls submitAnswer', () => {
        mockCheckAnswer.mockReturnValue({
            isCorrect: true,
            expected: '',
            points: 10,
        });
        const { result } = renderHook(() =>
            useQuizEngine({
                initialPool: mockQuestions,
                settings: mockSettings,
                onEndGame: mockOnEndGame,
                checkAnswer: mockCheckAnswer,
            })
        );

        act(() => {
            result.current.actions.setInputValue('test');
        });

        act(() => {
            result.current.actions.handleSubmit({
                preventDefault: jest.fn(),
            } as any);
        });

        expect(result.current.state.score).toBe(10);
    });
});

describe('useQuizFilter', () => {
    const mockData = [
        { country: 'USA', language: 'English', code: '.us' },
        { country: 'France', language: 'French', code: '.fr' },
        { country: 'Germany', language: 'German', code: '.de' },
    ];

    test('filters by language', () => {
        const { result } = renderHook(() =>
            useQuizFilter({
                data: mockData as any,
                quizType: 'cctld',
                settings: { ...mockSettings, filterLanguage: 'English' },
            })
        );

        expect(result.current).toHaveLength(1);
        expect(result.current[0].country).toBe('USA');
    });

    test('filters by letters', () => {
        const { result } = renderHook(() =>
            useQuizFilter({
                data: mockData as any,
                quizType: 'cctld',
                settings: { ...mockSettings, filterLetter: 'f' },
            })
        );

        expect(result.current).toHaveLength(1);
        expect(result.current[0].country).toBe('France');
    });

    test('respects max questions', () => {
        const { result } = renderHook(() =>
            useQuizFilter({
                data: mockData as any,
                quizType: 'cctld',
                settings: { ...mockSettings, maxQuestions: 1 },
            })
        );
        expect(result.current).toHaveLength(1);
    });
});
