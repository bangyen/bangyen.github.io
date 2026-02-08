import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import QuizGameView from '../QuizGameView';

// Mock the icon to prevent rendering issues
vi.mock('@mui/icons-material', () => ({
    ArrowBackRounded: () => <span data-testid="arrow-back-icon">BackIcon</span>,
}));

const mockActions = {
    setInputValue: vi.fn(),
    handleSubmit: vi.fn(),
    submitAnswer: vi.fn(),
    handleSkip: vi.fn(),
    toggleHint: vi.fn(),
};

const mockQuestion = {
    country: 'Test Country',
    cctld: '.tc',
    flag: 'flag.png',
};

const mockGameState = {
    history: [],
    currentQuestion: mockQuestion,
    inputValue: '',
    showFeedback: false,
    feedbackMessage: '',
    isCorrect: null,
    totalQuestions: 10,
    showHint: false,
    score: 0,
    hasInitialized: true,
};

const mockRenderProps = {
    renderQuestionPrompt: vi.fn().mockReturnValue('Question Prompt'),
    renderQuestionContent: vi.fn().mockReturnValue(<div>Question Content</div>),
    renderHint: vi.fn().mockReturnValue(<div>Hint Content</div>),
    renderFeedbackFlag: vi
        .fn()
        .mockReturnValue(<img src="flag.png" alt="Feedback Flag" />),
    renderFeedbackOrigin: vi.fn().mockReturnValue(<div>Feedback Origin</div>),
};

const defaultProps = {
    gameState: mockGameState,
    actions: mockActions,
    onBackToMenu: vi.fn(),
    modeLabel: 'Test Mode',
    ...mockRenderProps,
};

describe('QuizGameView', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('renders initial state correctly', () => {
        render(<QuizGameView {...defaultProps} />);

        expect(screen.getByText('Test Mode')).toBeInTheDocument();
        expect(screen.getByText('Question 1 of 10')).toBeInTheDocument();
        expect(screen.getByText('0')).toBeInTheDocument(); // Score
        expect(screen.getByText('PTS')).toBeInTheDocument();
        expect(screen.getByText('Question Prompt')).toBeInTheDocument();
        expect(screen.getByText('Question Content')).toBeInTheDocument();
        expect(
            screen.getByPlaceholderText('Type answer...')
        ).toBeInTheDocument();

        // Buttons
        expect(screen.getByText('Quit Quiz')).toBeInTheDocument();
        expect(screen.getByText('Skip')).toBeInTheDocument();
        expect(screen.getByText('Show Hint')).toBeInTheDocument();
        expect(screen.getByText('Submit')).toBeInTheDocument();
    });

    test('handles input changes', () => {
        render(<QuizGameView {...defaultProps} />);

        const input = screen.getByPlaceholderText('Type answer...');
        fireEvent.change(input, { target: { value: 'abc' } });
        expect(mockActions.setInputValue).toHaveBeenCalledWith('abc');
    });

    test('handles Submit click', () => {
        render(
            <QuizGameView
                {...defaultProps}
                gameState={{ ...mockGameState, inputValue: 'answer' }}
            />
        );

        const submitBtn = screen.getByText('Submit');
        // JSDOM doesn't support requestSubmit, so we use fireEvent.submit on the form or fireEvent.click if it's a button type=submit
        // But since we are clicking a button inside a form, we can just spy on handleSubmit
        fireEvent.submit(submitBtn.closest('form')!);
        expect(mockActions.handleSubmit).toHaveBeenCalled();
    });

    test('handles Skip click', () => {
        render(<QuizGameView {...defaultProps} />);

        const skipBtn = screen.getByText('Skip');
        fireEvent.click(skipBtn);
        expect(mockActions.handleSkip).toHaveBeenCalled();
    });

    test('toggles hint', () => {
        render(<QuizGameView {...defaultProps} />);
        const hintBtn = screen.getByText('Show Hint');
        fireEvent.click(hintBtn);
        expect(mockActions.toggleHint).toHaveBeenCalled();
    });

    test('shows hint content when showHint is true', () => {
        render(
            <QuizGameView
                {...defaultProps}
                gameState={{ ...mockGameState, showHint: true }}
            />
        );

        expect(screen.getByText('Hide Hint')).toBeInTheDocument();
        expect(screen.getByText('Hint Content')).toBeInTheDocument();
    });

    test('shows feedback correctly', () => {
        render(
            <QuizGameView
                {...defaultProps}
                gameState={{
                    ...mockGameState,
                    showFeedback: true,
                    isCorrect: true,
                    feedbackMessage: 'Correct!',
                }}
            />
        );

        expect(screen.getByText('Correct!')).toBeInTheDocument();
        expect(screen.getByText('Next')).toBeInTheDocument(); // Skip becomes Next
        expect(mockRenderProps.renderFeedbackFlag).toHaveBeenCalled();
    });

    test('shows feedback origin for incorrect answer', () => {
        render(
            <QuizGameView
                {...defaultProps}
                gameState={{
                    ...mockGameState,
                    showFeedback: true,
                    isCorrect: false,
                    feedbackMessage: 'Wrong!',
                }}
            />
        );

        expect(mockRenderProps.renderFeedbackOrigin).toHaveBeenCalled();
        expect(screen.getByText('Feedback Origin')).toBeInTheDocument();
    });

    test('handles Enter key to submit', () => {
        render(
            <QuizGameView
                {...defaultProps}
                gameState={{ ...mockGameState, inputValue: 'ans' }}
            />
        );

        fireEvent.keyDown(window, { key: 'Enter' });
        expect(mockActions.handleSubmit).toHaveBeenCalled();
    });

    test('handles Enter key to skip if empty or hiding input', () => {
        render(
            <QuizGameView
                {...defaultProps}
                gameState={{ ...mockGameState, inputValue: '' }}
            />
        );
        fireEvent.keyDown(window, { key: 'Enter' });
        expect(mockActions.handleSkip).toHaveBeenCalled();
    });

    test('handles Enter key to Next when feedback shown', () => {
        render(
            <QuizGameView
                {...defaultProps}
                gameState={{ ...mockGameState, showFeedback: true }}
            />
        );
        fireEvent.keyDown(window, { key: 'Enter' });
        expect(mockActions.handleSkip).toHaveBeenCalled();
    });

    test('calls special onKeyDown prop', () => {
        const specialKeyDown = vi.fn();
        render(<QuizGameView {...defaultProps} onKeyDown={specialKeyDown} />);

        fireEvent.keyDown(window, { key: 'ArrowLeft' }); // Not Enter
        expect(specialKeyDown).toHaveBeenCalled();
    });

    test('renders custom actions if provided', () => {
        render(
            <QuizGameView
                {...defaultProps}
                renderCustomActions={() => (
                    <div data-testid="custom">Custom</div>
                )}
            />
        );
        expect(screen.getByTestId('custom')).toBeInTheDocument();
    });

    test('hides input if hideInput is true', () => {
        render(<QuizGameView {...defaultProps} hideInput={true} />);
        expect(
            screen.queryByPlaceholderText('Type answer...')
        ).not.toBeInTheDocument();
        expect(screen.queryByText('Submit')).not.toBeInTheDocument();
    });
});
