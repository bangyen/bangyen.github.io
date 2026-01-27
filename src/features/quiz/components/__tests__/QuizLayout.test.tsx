import React from 'react';
import { render, screen } from '@testing-library/react';
import QuizLayout from '../QuizLayout';

// Mock GlobalHeader to simplify Layout testing
jest.mock('@/components/layout/GlobalHeader', () => ({
    GlobalHeader: ({ infoUrl }: { infoUrl: string }) => (
        <div data-testid="global-header" data-infourl={infoUrl}>
            Global Header
        </div>
    ),
}));

describe('QuizLayout', () => {
    const mockProps = {
        title: 'Quiz Title',
        subtitle: 'Quiz Subtitle',
        infoUrl: 'https://example.com/info',
    };

    test('renders title and subtitle', () => {
        render(
            <QuizLayout {...mockProps}>
                <div data-testid="quiz-content">Quiz Content</div>
            </QuizLayout>
        );

        expect(screen.getByText('Quiz Title')).toBeInTheDocument();
        expect(screen.getByText('Quiz Subtitle')).toBeInTheDocument();
        expect(screen.getByTestId('quiz-content')).toBeInTheDocument();
    });

    test('renders GlobalHeader with infoUrl', () => {
        render(
            <QuizLayout {...mockProps}>
                <div>Content</div>
            </QuizLayout>
        );

        const header = screen.getByTestId('global-header');
        expect(header).toBeInTheDocument();
        expect(header).toHaveAttribute('data-infourl', mockProps.infoUrl);
    });

    test('renders headerContent in both desktop and mobile locations', () => {
        render(
            <QuizLayout
                {...mockProps}
                headerContent={
                    <div data-testid="custom-header">Custom Header</div>
                }
            >
                <div>Content</div>
            </QuizLayout>
        );

        // headerContent is rendered twice in the DOM (one for xs:block/flex, one for sm:flex)
        // according to the component logic (lines 111-127)
        const customHeaderElements = screen.getAllByTestId('custom-header');
        expect(customHeaderElements.length).toBe(2);
    });

    test('renders only one title when headerContent is provided', () => {
        render(
            <QuizLayout {...mockProps} headerContent={<div>Custom</div>}>
                <div>Content</div>
            </QuizLayout>
        );

        // When headerContent exists, the title is still rendered (lines 95-106)
        expect(screen.getByText('Quiz Title')).toBeInTheDocument();
    });
});
