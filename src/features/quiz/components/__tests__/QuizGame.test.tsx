import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import QuizGame from '../QuizGame';
import { useQuizEngine } from '../../hooks/quiz';

// Mock the hook
jest.mock('../../hooks/quiz');

// Mock QuizGameView to simplify finding it and check props
jest.mock('../QuizGameView', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const MockQuizGameView = (props: any) => (
        <div
            data-testid="quiz-game-view"
            onKeyDown={props.onKeyDown}
            tabIndex={0}
            role="button"
        >
            <span>Mode Label: {props.modeLabel}</span>
            {props.renderCustomActions && (
                <div data-testid="custom-actions">
                    {props.renderCustomActions(props.gameState, props.actions)}
                </div>
            )}
            <div data-testid="question-prompt">
                {props.renderQuestionPrompt && props.renderQuestionPrompt()}
            </div>
            <div data-testid="question-content">
                {props.renderQuestionContent &&
                    props.renderQuestionContent(
                        props.gameState.currentQuestion
                    )}
            </div>
            <div data-testid="hint">
                {props.renderHint &&
                    props.renderHint(props.gameState.currentQuestion)}
            </div>
            <div data-testid="feedback-flag">
                {props.renderFeedbackFlag &&
                    props.renderFeedbackFlag(props.gameState.currentQuestion)}
            </div>
            <button onClick={props.onBackToMenu}>Back</button>
            <input ref={props.inputRef} placeholder={props.inputPlaceholder} />
            <button ref={props.nextButtonRef}>Next</button>
        </div>
    );
    MockQuizGameView.displayName = 'QuizGameView';
    return MockQuizGameView;
});

const mockOnEndGame = jest.fn();
const mockOnBackToMenu = jest.fn();

const defaultProps = {
    quizType: 'cctld' as const,
    settings: { mode: 'toCountry', maxQuestions: 10, allowRepeats: false },
    initialPool: [],
    onEndGame: mockOnEndGame,
    onBackToMenu: mockOnBackToMenu,
};

// Mock state and actions
const mockActions = {
    submitAnswer: jest.fn(),
    nextQuestion: jest.fn(),
};

const mockState = {
    currentQuestion: {
        country: 'Test',
        cctld: '.te',
        flag: 'flag.png',
        language: 'Esperanto',
    },
    showFeedback: false,
    score: 0,
    history: [],
    streak: 0,
    timeLeft: 10,
    isGameOver: false,
};

describe('QuizGame', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (useQuizEngine as jest.Mock).mockReturnValue({
            state: mockState,
            actions: mockActions,
        });
    });

    test('renders standard quiz view correctly', () => {
        render(<QuizGame {...defaultProps} />);

        expect(screen.getByTestId('quiz-game-view')).toBeInTheDocument();
        expect(
            screen.getByText('Mode Label: Guessing Country')
        ).toBeInTheDocument();
        // Check renders passed through
        // Hint for CCTLD should be rendered
        expect(screen.getByText(/Hint: Esperanto origin/)).toBeInTheDocument();
        // Flag should be rendered
        expect(screen.getByAltText('Flag of Test')).toBeInTheDocument();
    });

    test('renders Guessing Code mode label', () => {
        render(
            <QuizGame
                {...defaultProps}
                settings={{ ...defaultProps.settings, mode: 'toCode' }}
            />
        );

        expect(
            screen.getByText('Mode Label: Guessing Code')
        ).toBeInTheDocument();
    });

    test('calls focus on input when feedback is hidden', () => {
        jest.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => {
            cb(0);
            return 0;
        });

        render(<QuizGame {...defaultProps} />);
        const input = screen.getByPlaceholderText('Type country name...');
        expect(input).toBeInTheDocument();
    });

    test('does NOT focus on input if feedback is shown', () => {
        (useQuizEngine as jest.Mock).mockReturnValue({
            state: { ...mockState, showFeedback: true },
            actions: mockActions,
        });
        const requestSpy = jest.spyOn(window, 'requestAnimationFrame');

        render(<QuizGame {...defaultProps} />);
        expect(requestSpy).not.toHaveBeenCalled();
    });

    // Driving Side special case
    test('renders special Driving Side view (Left/Right buttons)', () => {
        render(
            <QuizGame
                {...defaultProps}
                quizType="driving_side"
                settings={{ ...defaultProps.settings, mode: 'guessingSide' }}
            />
        );

        expect(screen.getByTestId('quiz-game-view')).toBeInTheDocument();
        expect(
            screen.getByText('Mode Label: Guessing Side')
        ).toBeInTheDocument();

        // Check custom actions are rendered
        expect(screen.getByTestId('custom-actions')).toBeInTheDocument();
        expect(screen.getByText('Left')).toBeInTheDocument();
        expect(screen.getByText('Right')).toBeInTheDocument();
    });

    test('handles Left/Right button clicks in Driving Side', () => {
        render(
            <QuizGame
                {...defaultProps}
                quizType="driving_side"
                settings={{ ...defaultProps.settings, mode: 'guessingSide' }}
            />
        );

        fireEvent.click(screen.getByText('Left'));
        expect(mockActions.submitAnswer).toHaveBeenCalledWith('Left');

        fireEvent.click(screen.getByText('Right'));
        expect(mockActions.submitAnswer).toHaveBeenCalledWith('Right');
    });

    test('handles Arrow keys in Driving Side', () => {
        render(
            <QuizGame
                {...defaultProps}
                quizType="driving_side"
                settings={{ ...defaultProps.settings, mode: 'guessingSide' }}
            />
        );

        const view = screen.getByTestId('quiz-game-view');

        fireEvent.keyDown(view, { key: 'ArrowLeft' });
        expect(mockActions.submitAnswer).toHaveBeenCalledWith('Left');

        mockActions.submitAnswer.mockClear();
        fireEvent.keyDown(view, { key: 'ArrowRight' });
        expect(mockActions.submitAnswer).toHaveBeenCalledWith('Right');

        mockActions.submitAnswer.mockClear();
        fireEvent.keyDown(view, { key: 'ArrowUp' }); // Should ignore
        expect(mockActions.submitAnswer).not.toHaveBeenCalled();
    });

    test('ignores arrow keys when feedback is shown in Driving Side', () => {
        (useQuizEngine as jest.Mock).mockReturnValue({
            state: { ...mockState, showFeedback: true },
            actions: mockActions,
        });

        render(
            <QuizGame
                {...defaultProps}
                quizType="driving_side"
                settings={{ ...defaultProps.settings, mode: 'guessingSide' }}
            />
        );

        const view = screen.getByTestId('quiz-game-view');
        fireEvent.keyDown(view, { key: 'ArrowLeft' });
        expect(mockActions.submitAnswer).not.toHaveBeenCalled();
    });

    test('renders placeholder hint for non-cctld types', () => {
        render(
            <QuizGame
                {...defaultProps}
                quizType="vehicle"
                // Settings might differ but defaultProps should be okay for basic render
            />
        );
        expect(
            screen.getByText('Hint functionality coming soon...')
        ).toBeInTheDocument();
    });
});
