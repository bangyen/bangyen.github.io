import { render, screen } from '@testing-library/react';
import React from 'react';

import { QuizSettings, Question, QuizItem } from '../../types/quiz';
import QuizHistoryItem from '../QuizHistoryItem';

// Mock dependencies
vi.mock('../SkippedBadge', () => ({
    default: () => <span data-testid="skipped-badge">Skipped</span>,
}));

vi.mock('@mui/icons-material', () => ({
    CheckCircleRounded: () => <span data-testid="check-icon">Icon</span>,
}));

const mockItem = {
    country: 'Test Country',
    flag: 'test-flag.png',
};

// We need to typecase loosely to test specific modes like CCTLD without strict type constraints in tests
const mockCCTLDItem = {
    ...mockItem,
    type: 'cctld' as const,
    code: '.tc',
    language: 'Test',
};
const mockPhoneItem = { ...mockItem, type: 'telephone' as const, code: '+1' };
const mockVehicleItem = { ...mockItem, type: 'vehicle' as const, code: 'TC' };
const mockDrivingSideItem = {
    ...mockItem,
    type: 'driving_side' as const,
    side: 'Left' as const,
    switched: false,
};

const mockQuestion: Question<QuizItem> = {
    id: '1',
    item: mockCCTLDItem as unknown as QuizItem,
    userAnswer: 'result',
    isCorrect: true,
    pointsEarned: 1,
};

const mockSettings: QuizSettings = {
    mode: 'guessing',
    maxQuestions: 10,
    allowRepeats: false,
};

const mockConfig = {
    renderFeedbackOrigin: vi.fn(),
};

describe('QuizHistoryItem', () => {
    test('renders correct answer (1 point)', () => {
        render(
            <QuizHistoryItem
                question={mockQuestion}
                selectedQuiz="cctld"
                settings={mockSettings}
                activeConfig={mockConfig}
            />
        );

        expect(screen.getByText('Test Country')).toBeInTheDocument();
        expect(screen.getByText('RESULT')).toBeInTheDocument(); // normalized to uppercase
        expect(screen.getByTestId('check-icon')).toBeInTheDocument();
    });

    test('renders partial answer (0.5 point)', () => {
        const partialQuestion = {
            ...mockQuestion,
            pointsEarned: 0.5,
            userAnswer: 'partial',
        };
        render(
            <QuizHistoryItem
                question={partialQuestion}
                selectedQuiz="cctld"
                settings={mockSettings}
                activeConfig={mockConfig}
            />
        );

        expect(screen.getByText(/0.5 pts/)).toBeInTheDocument();
    });

    test('renders incorrect answer (0 point)', () => {
        const incorrectQuestion = {
            ...mockQuestion,
            pointsEarned: 0,
            userAnswer: 'wrong',
            isCorrect: false,
        };
        render(
            <QuizHistoryItem
                question={incorrectQuestion}
                selectedQuiz="cctld"
                settings={mockSettings}
                activeConfig={mockConfig}
            />
        );

        expect(screen.getByText('WRONG')).toBeInTheDocument();
        expect(screen.getByTestId('check-icon')).toBeInTheDocument();
    });

    test('renders skipped answer', () => {
        const skippedQuestion = {
            ...mockQuestion,
            pointsEarned: 0,
            userAnswer: '',
        };
        render(
            <QuizHistoryItem
                question={skippedQuestion}
                selectedQuiz="cctld"
                settings={mockSettings}
                activeConfig={mockConfig}
            />
        );

        expect(screen.getByTestId('skipped-badge')).toBeInTheDocument();
    });

    test('renders toCode mode for CCTLD', () => {
        const q = { ...mockQuestion, item: mockCCTLDItem, userAnswer: 'tc' };
        render(
            <QuizHistoryItem
                question={q}
                selectedQuiz="cctld"
                settings={{ ...mockSettings, mode: 'toCode' }}
                activeConfig={mockConfig}
            />
        );

        // In toCode mode:
        // Title logic: settings.mode === 'toCountry' ? code : country. -> Country
        expect(screen.getByText('Test Country')).toBeInTheDocument();
        expect(screen.getByText('.tc')).toBeInTheDocument();
    });

    test('renders toCountry mode for CCTLD', () => {
        const q = { ...mockQuestion, item: mockCCTLDItem };
        render(
            <QuizHistoryItem
                question={q}
                selectedQuiz="cctld"
                settings={{ ...mockSettings, mode: 'toCountry' }} // Question is Code, Answer is Country
                activeConfig={mockConfig}
            />
        );

        expect(screen.getByText('.tc')).toBeInTheDocument(); // Code as title

        // Answer section contains "Answer: Test Country"
        expect(screen.getByText(/Test Country/)).toBeInTheDocument();
    });

    test('renders Driving Side quiz', () => {
        const q: Question<QuizItem> = {
            ...mockQuestion,
            item: mockDrivingSideItem as unknown as QuizItem,
            userAnswer: 'left',
        };
        render(
            <QuizHistoryItem
                question={q}
                selectedQuiz="driving_side"
                settings={mockSettings}
                activeConfig={mockConfig}
            />
        );

        expect(screen.getByText('Test Country')).toBeInTheDocument();
        expect(screen.getByText('LEFT')).toBeInTheDocument();
    });

    test('renders Telephone quiz in toCode mode', () => {
        const q = { ...mockQuestion, item: mockPhoneItem, userAnswer: '1' };
        render(
            <QuizHistoryItem
                question={q}
                selectedQuiz="telephone"
                settings={{ ...mockSettings, mode: 'toCode' }}
                activeConfig={mockConfig}
            />
        );

        expect(screen.getByText('+1')).toBeInTheDocument();
    });

    test('renders Vehicle quiz', () => {
        const q = { ...mockQuestion, item: mockVehicleItem, userAnswer: 'tc' };
        render(
            <QuizHistoryItem
                question={q}
                selectedQuiz="vehicle"
                settings={mockSettings}
                activeConfig={mockConfig}
            />
        );
        expect(screen.getByText('TC')).toBeInTheDocument();
    });

    test('renders feedback origin if provided', () => {
        const activeConfigWithFeedback = {
            renderFeedbackOrigin: vi
                .fn()
                .mockReturnValue(<span>Feedback Origin</span>),
        };

        render(
            <QuizHistoryItem
                question={mockQuestion}
                selectedQuiz="cctld"
                settings={mockSettings}
                activeConfig={activeConfigWithFeedback}
            />
        );

        expect(screen.getByText('Feedback Origin')).toBeInTheDocument();
        expect(
            activeConfigWithFeedback.renderFeedbackOrigin
        ).toHaveBeenCalled();
    });
});
