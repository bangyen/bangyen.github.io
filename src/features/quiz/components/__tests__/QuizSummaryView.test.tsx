import { vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import QuizSummaryView from '../QuizSummaryView';
import { Question } from '../../types/quiz';

// Mock MUI icons
vi.mock('@mui/icons-material', () => ({
    ArrowBackRounded: () => <div data-testid="ArrowBackIcon" />,
    RefreshRounded: () => <div data-testid="RefreshIcon" />,
}));

// Mock Fade to avoid transition issues in tests
// Mock Fade and useMediaQuery to avoid transition issues and control media queries in tests
const mockUseMediaQuery = vi.fn((_query: string) => false);
vi.mock('@mui/material', async importOriginal => {
    const original = await importOriginal<Record<string, any>>();
    return {
        ...original,
        Fade: ({ children }: { children: React.ReactElement }) => children,
        useMediaQuery: (query: string) => mockUseMediaQuery(query),
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
        onRestart: vi.fn(),
        onBackToMenu: vi.fn(),
        renderHistoryItem: (q: Question<string>, index: number) => (
            <div key={index} data-testid={`history-item-${index.toString()}`}>
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
