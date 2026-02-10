import { renderHook, act } from '@testing-library/react';

import { QuizSettings } from '../../types/quiz';
import { useQuizEngine } from '../quiz';

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

const mockCheckAnswer = vi.fn();
const mockOnEndGame = vi.fn();

describe('useQuizEngine', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
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

    test('handles correct answer submission', async () => {
        mockCheckAnswer.mockResolvedValue({
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

        await act(async () => {
            await result.current.actions.submitAnswer('A');
        });

        expect(result.current.state.score).toBe(10);
        expect(result.current.state.feedbackMessage).toBe('Correct!');
        expect(result.current.state.isCorrect).toBe(true);
        expect(result.current.state.showFeedback).toBe(true);

        // Fast forward timer to next question
        act(() => {
            vi.advanceTimersByTime(500);
        });

        expect(result.current.state.showFeedback).toBe(false);
        expect(result.current.state.inputValue).toBe('');
    });

    test('handles incorrect answer submission', async () => {
        mockCheckAnswer.mockResolvedValue({
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

        await act(async () => {
            await result.current.actions.submitAnswer('Wrong');
        });

        expect(result.current.state.score).toBe(0);
        expect(result.current.state.feedbackMessage).toBe('Expected A');
        expect(result.current.state.isCorrect).toBe(false);
        expect(result.current.state.showFeedback).toBe(true);
    });

    test('handleSkip works correctly', async () => {
        const { result } = renderHook(() =>
            useQuizEngine({
                initialPool: mockQuestions,
                settings: mockSettings,
                onEndGame: mockOnEndGame,
                checkAnswer: () =>
                    Promise.resolve({
                        isCorrect: false,
                        expected: 'Skipped',
                        points: 0,
                    }),
            })
        );

        await act(async () => {
            await result.current.actions.handleSkip();
        });

        expect(result.current.state.showFeedback).toBe(true);
        expect(result.current.state.feedbackMessage).toBe('Skipped');
    });

    test('skip advances manually if feedback shown', async () => {
        const { result } = renderHook(() =>
            useQuizEngine({
                initialPool: mockQuestions,
                settings: mockSettings,
                onEndGame: mockOnEndGame,
                checkAnswer: mockCheckAnswer,
            })
        );

        // Trigger generic feedback state
        await act(async () => {
            await result.current.actions.handleSkip(); // First skip shows feedback
        });
        expect(result.current.state.showFeedback).toBe(true);

        // Second skip (Next) should advance immediately
        await act(async () => {
            await result.current.actions.handleSkip();
        });
        expect(result.current.state.showFeedback).toBe(false);
    });

    test('ends game when questions run out', async () => {
        const singleQuestionPool = [mockQuestions[0]];

        const { result } = renderHook(() =>
            useQuizEngine({
                initialPool: singleQuestionPool,
                settings: mockSettings,
                onEndGame: mockOnEndGame,
                checkAnswer: mockCheckAnswer,
            })
        );

        // Answer 1
        await act(async () => {
            await result.current.actions.handleSkip();
        });

        // Advance to finish
        act(() => {
            vi.runAllTimers();
        });

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

    test('handleSubmit calls submitAnswer', async () => {
        mockCheckAnswer.mockResolvedValue({
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

        await act(async () => {
            await result.current.actions.handleSubmit({
                preventDefault: vi.fn(),
            } as unknown as React.SyntheticEvent);
        });

        expect(result.current.state.score).toBe(10);
    });

    test('submitAnswer returns early if already showing feedback', async () => {
        const { result } = renderHook(() =>
            useQuizEngine({
                initialPool: mockQuestions,
                settings: mockSettings,
                onEndGame: mockOnEndGame,
                checkAnswer: mockCheckAnswer.mockResolvedValue({
                    isCorrect: true,
                    expected: '',
                    points: 1,
                }),
            })
        );

        await act(async () => {
            await result.current.actions.submitAnswer('ans1');
        });
        expect(result.current.state.showFeedback).toBe(true);
        expect(mockCheckAnswer).toHaveBeenCalledTimes(1);

        await act(async () => {
            await result.current.actions.submitAnswer('ans2');
        });
        expect(mockCheckAnswer).toHaveBeenCalledTimes(1);
    });

    test('nextQuestion clears advance timer', async () => {
        const { result } = renderHook(() =>
            useQuizEngine({
                initialPool: mockQuestions,
                settings: mockSettings,
                onEndGame: mockOnEndGame,
                checkAnswer: mockCheckAnswer.mockResolvedValue({
                    isCorrect: true,
                    expected: '',
                    points: 1,
                }),
            })
        );

        await act(async () => {
            await result.current.actions.submitAnswer('ans');
        });

        act(() => {
            result.current.actions.nextQuestion();
        });

        expect(result.current.state.showFeedback).toBe(false);
    });

    test('nextQuestion works when timer is null', () => {
        const { result } = renderHook(() =>
            useQuizEngine({
                initialPool: mockQuestions,
                settings: mockSettings,
                onEndGame: mockOnEndGame,
                checkAnswer: mockCheckAnswer,
            })
        );
        act(() => {
            result.current.actions.nextQuestion();
        });
        expect(result.current.state.showFeedback).toBe(false);
    });

    test('handleSkip returns early if no current question', async () => {
        const emptyPool: unknown[] = [];
        const { result } = renderHook(() =>
            useQuizEngine({
                initialPool: emptyPool,
                settings: mockSettings,
                onEndGame: mockOnEndGame,
                checkAnswer: mockCheckAnswer,
            })
        );

        await act(async () => {
            await result.current.actions.handleSkip();
        });
        expect(result.current.state.showFeedback).toBe(false);
    });
});
