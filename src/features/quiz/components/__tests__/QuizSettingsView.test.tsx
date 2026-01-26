import React from 'react';
import { render, screen } from '@testing-library/react';
import QuizSettingsView from '../QuizSettingsView';
import { QuizSettings } from '../../types/quiz';

describe('QuizSettingsView', () => {
    const mockSettings: QuizSettings = {
        mode: 'toCountry',
        allowRepeats: false,
        maxQuestions: 10,
    };

    const mockProps = {
        settings: mockSettings,
        onUpdate: jest.fn(),
        onStart: jest.fn(),
    };

    test('renders default title when no title is provided', () => {
        render(
            <QuizSettingsView {...mockProps}>
                <div data-testid="settings-child">Child Component</div>
            </QuizSettingsView>
        );

        expect(screen.getByText('Game Settings')).toBeInTheDocument();
        expect(screen.getByTestId('settings-child')).toBeInTheDocument();
    });

    test('renders custom title when provided', () => {
        render(
            <QuizSettingsView {...mockProps} title="Custom Quiz Title">
                <div>Child</div>
            </QuizSettingsView>
        );

        expect(screen.getByText('Custom Quiz Title')).toBeInTheDocument();
    });

    test('renders children within the component', () => {
        render(
            <QuizSettingsView {...mockProps}>
                <ul>
                    <li>Option 1</li>
                    <li>Option 2</li>
                </ul>
            </QuizSettingsView>
        );

        expect(screen.getByText('Option 1')).toBeInTheDocument();
        expect(screen.getByText('Option 2')).toBeInTheDocument();
    });
});
