import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import WikipediaQuizPage from '../pages/WikipediaQuizPage';
import { Question, QuizItem } from '../types/quiz';

// Mock child components to isolate Page logic
jest.mock('../components/QuizGame', () => {
    return function MockQuizGame({
        onEndGame,
        onBackToMenu,
    }: {
        onEndGame: (history: Question<QuizItem>[], score: number) => void;
        onBackToMenu: () => void;
    }) {
        return (
            <div data-testid="quiz-game">
                <button
                    onClick={() => onEndGame([], 10)}
                    data-testid="end-game-btn"
                >
                    End Game
                </button>
                <button onClick={onBackToMenu} data-testid="back-menu-btn">
                    Back to Menu
                </button>
            </div>
        );
    };
});

jest.mock('../components/QuizSummaryView', () => {
    return function MockQuizSummaryView({
        onBackToMenu,
        onRestart,
    }: {
        onBackToMenu: () => void;
        onRestart: () => void;
    }) {
        return (
            <div data-testid="quiz-summary">
                <button onClick={onBackToMenu} data-testid="summary-back-btn">
                    Back to Menu
                </button>
                <button onClick={onRestart} data-testid="summary-restart-btn">
                    Restart
                </button>
            </div>
        );
    };
});

jest.mock('../components/QuizSettingsView', () => {
    return function MockQuizSettingsView({ onStart }: { onStart: () => void }) {
        return (
            <div data-testid="quiz-settings">
                <button onClick={onStart} data-testid="start-quiz-btn">
                    Start Quiz
                </button>
            </div>
        );
    };
});

// Mock QuizLayout to just render children and header
jest.mock('../components/QuizLayout', () => {
    return function MockQuizLayout({
        children,
        headerContent,
    }: {
        children: React.ReactNode;
        headerContent: React.ReactNode;
    }) {
        return (
            <div data-testid="quiz-layout">
                <div data-testid="quiz-header">{headerContent}</div>
                {children}
            </div>
        );
    };
});

// Mock hooks
jest.mock('../hooks/quiz', () => ({
    useQuizFilter: jest.fn(() => ['question1', 'question2']), // Return mock filtered pool
}));

describe('WikipediaQuizPage Integration', () => {
    const renderWithRouter = (initialEntry = '/quiz?type=cctld') => {
        return render(
            <MemoryRouter initialEntries={[initialEntry]}>
                <Routes>
                    <Route path="/quiz" element={<WikipediaQuizPage />} />
                </Routes>
            </MemoryRouter>
        );
    };

    it('renders the menu state by default', () => {
        renderWithRouter();
        expect(screen.getByTestId('quiz-settings')).toBeInTheDocument();
        expect(screen.queryByTestId('quiz-game')).not.toBeInTheDocument();
    });

    it('starts the game when handleStart is triggered', () => {
        renderWithRouter();

        // Find and click the start button (mocked in QuizSettingsView)
        const startBtn = screen.getByTestId('start-quiz-btn');
        fireEvent.click(startBtn);

        expect(screen.getByTestId('quiz-game')).toBeInTheDocument();
        expect(screen.queryByTestId('quiz-settings')).not.toBeInTheDocument();
    });

    it('transitions to summary view when game ends', () => {
        renderWithRouter();

        // Start Game
        fireEvent.click(screen.getByTestId('start-quiz-btn'));

        // End Game
        const endBtn = screen.getByTestId('end-game-btn');
        fireEvent.click(endBtn);

        expect(screen.getByTestId('quiz-summary')).toBeInTheDocument();
    });

    it('returns to menu from summary view', () => {
        renderWithRouter();

        // Start -> End -> Summary
        fireEvent.click(screen.getByTestId('start-quiz-btn'));
        fireEvent.click(screen.getByTestId('end-game-btn'));

        // Back to Menu
        const backBtn = screen.getByTestId('summary-back-btn');
        fireEvent.click(backBtn);

        expect(screen.getByTestId('quiz-settings')).toBeInTheDocument();
    });

    it('restarts game from summary view', () => {
        renderWithRouter();

        // Start -> End -> Summary
        fireEvent.click(screen.getByTestId('start-quiz-btn'));
        fireEvent.click(screen.getByTestId('end-game-btn'));

        // Restart
        const restartBtn = screen.getByTestId('summary-restart-btn');
        fireEvent.click(restartBtn);

        expect(screen.getByTestId('quiz-game')).toBeInTheDocument();
    });
});
