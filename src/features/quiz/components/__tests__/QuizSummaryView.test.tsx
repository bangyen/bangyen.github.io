import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import QuizSummaryView from '../QuizSummaryView';
import { Question } from '../../types/quiz';

// Mock MUI icons
jest.mock('@mui/icons-material', () => ({
    ArrowBackRounded: () => <div data-testid="ArrowBackIcon" />,
    RefreshRounded: () => <div data-testid="RefreshIcon" />,
}));

// Mock Fade to avoid transition issues in tests
jest.mock('@mui/material', () => {
    const original = jest.requireActual('@mui/material');
    return {
        ...original,
        Fade: ({ children }: { children: React.ReactElement }) => children,
    };
});

describe('QuizSummaryView', () => {
    const mockHistory: Question<string>[] = [
        {
            id: '1',
            item: 'Item 1',
            userAnswer: 'Item 1',
            isCorrect: true,
            pointsEarned: 1,
        },
        {
            id: '2',
            item: 'Item 2',
            userAnswer: 'Wrong',
            isCorrect: false,
            pointsEarned: 0,
        },
    ];

    const mockProps = {
        score: 1,
        history: mockHistory,
        onRestart: jest.fn(),
        onBackToMenu: jest.fn(),
        renderHistoryItem: (q: Question<string>, index: number) => (
            <div key={index} data-testid={`history-item-${index}`}>
                {q.item}
            </div>
        ),
    };

    test('renders quiz completion message and score', () => {
        render(<QuizSummaryView {...mockProps} />);

        expect(screen.getByText('Quiz Complete!')).toBeInTheDocument();
        expect(screen.getByText('1 / 2')).toBeInTheDocument();
    });

    test('calls onRestart when Replay button is clicked', () => {
        render(<QuizSummaryView {...mockProps} />);

        fireEvent.click(screen.getByText('Replay'));
        expect(mockProps.onRestart).toHaveBeenCalledTimes(1);
    });

    test('calls onBackToMenu when Menu button is clicked', () => {
        render(<QuizSummaryView {...mockProps} />);

        fireEvent.click(screen.getByText('Menu'));
        expect(mockProps.onBackToMenu).toHaveBeenCalledTimes(1);
    });

    test('renders all history items', () => {
        render(<QuizSummaryView {...mockProps} />);

        expect(screen.getByText('History')).toBeInTheDocument();
        expect(screen.getByTestId('history-item-0')).toHaveTextContent(
            'Item 1'
        );
        expect(screen.getByTestId('history-item-1')).toHaveTextContent(
            'Item 2'
        );
    });
});
