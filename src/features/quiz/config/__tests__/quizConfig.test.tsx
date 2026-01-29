import React from 'react';
import { render, screen } from '@testing-library/react';
import { QUIZ_CONFIGS } from '../quizConfig';
import {
    QuizItem,
    CCTLD,
    TelephoneCode,
    VehicleCode,
    DrivingSide,
    QuizSettings,
} from '../../types/quiz';

// Utils for testing checkAnswer
const testCheckAnswer = (
    quizType: keyof typeof QUIZ_CONFIGS,
    input: string,
    item: QuizItem,
    settings: QuizSettings,
    shouldBeCorrect: boolean
) => {
    const result = QUIZ_CONFIGS[quizType].checkAnswer(input, item, settings);
    expect(result.isCorrect).toBe(shouldBeCorrect);
    if (shouldBeCorrect) {
        expect(result.points).toBe(1);
    } else {
        expect(result.points).toBe(0);
    }
};

describe('QUIZ_CONFIGS', () => {
    describe('cctld', () => {
        const config = QUIZ_CONFIGS.cctld;
        const mockItem: CCTLD = {
            code: '.us',
            country: 'United States',
            flag: 'us.png',
            language: 'English',
        };

        describe('checkAnswer', () => {
            test('toCountry: handles exact match', () => {
                testCheckAnswer(
                    'cctld',
                    'United States',
                    mockItem,
                    { mode: 'toCountry' } as QuizSettings,
                    true
                );
            });
            test('toCountry: handles case insensitive', () => {
                testCheckAnswer(
                    'cctld',
                    'united states',
                    mockItem,
                    { mode: 'toCountry' } as QuizSettings,
                    true
                );
            });
            test('toCountry: handles aliases', () => {
                testCheckAnswer(
                    'cctld',
                    'USA',
                    mockItem,
                    { mode: 'toCountry' } as QuizSettings,
                    true
                );
            });
            test('toCountry: rejects wrong answer', () => {
                testCheckAnswer(
                    'cctld',
                    'Canada',
                    mockItem,
                    { mode: 'toCountry' } as QuizSettings,
                    false
                );
            });

            test('toCode: handles exact match', () => {
                testCheckAnswer(
                    'cctld',
                    '.us',
                    mockItem,
                    { mode: 'toCode' } as QuizSettings,
                    true
                );
            });
            test('toCode: handles missing dot', () => {
                testCheckAnswer(
                    'cctld',
                    'us',
                    mockItem,
                    { mode: 'toCode' } as QuizSettings,
                    true
                );
            });
            test('toCode: case insensitive', () => {
                testCheckAnswer(
                    'cctld',
                    'US',
                    mockItem,
                    { mode: 'toCode' } as QuizSettings,
                    true
                );
            });
        });

        describe('rendering', () => {
            test('renderQuestionPrompt', () => {
                expect(config.renderQuestionPrompt('toCountry')).toContain(
                    'What country'
                );
                expect(config.renderQuestionPrompt('toCode')).toContain(
                    'ccTLD'
                );
            });

            test('renderQuestionContent (toCode display)', () => {
                render(
                    config.renderQuestionContent(
                        mockItem,
                        'toCode'
                    ) as React.ReactElement
                );
                // In toCode mode, we ask "What is the ccTLD for: ???". Wait.
                // Question prompt says "What is the ccTLD for:".
                // Content should show the COUNTRY.
                // Code:
                // {mode === 'toCountry' ? cctldItem.code : cctldItem.country}
                // If mode is 'toCode' (Guess Code from Country), we show Country.
                expect(screen.getByText('United States')).toBeInTheDocument();
            });

            test('renderFeedbackOrigin', () => {
                const itemWithExpl = {
                    ...mockItem,
                    explanation: 'Test Explanation',
                };
                const Feedback = () =>
                    config.renderFeedbackOrigin!(
                        itemWithExpl
                    ) as React.ReactElement;
                render(<Feedback />);
                expect(screen.getByText('Origin:')).toBeInTheDocument();
                expect(
                    screen.getByText('Test Explanation')
                ).toBeInTheDocument();
            });
        });
    });

    describe('telephone', () => {
        const config = QUIZ_CONFIGS.telephone;
        const mockItem: TelephoneCode = {
            code: '+1',
            country: 'United States',
            flag: 'us.png',
        };

        describe('checkAnswer', () => {
            test('toCountry: exact match', () => {
                testCheckAnswer(
                    'telephone',
                    'United States',
                    mockItem,
                    { mode: 'toCountry' } as QuizSettings,
                    true
                );
            });

            test('toCode: handles with plus', () => {
                testCheckAnswer(
                    'telephone',
                    '+1',
                    mockItem,
                    { mode: 'toCode' } as QuizSettings,
                    true
                );
            });
            test('toCode: handles without plus', () => {
                testCheckAnswer(
                    'telephone',
                    '1',
                    mockItem,
                    { mode: 'toCode' } as QuizSettings,
                    true
                );
            });
            // Some crazy formats ?
            test('toCode: handles spaces', () => {
                testCheckAnswer(
                    'telephone',
                    ' + 1 ',
                    mockItem,
                    { mode: 'toCode' } as QuizSettings,
                    true
                );
            });
        });

        test('renderQuestionContent', () => {
            // mode toCountry -> Show Code (+1)
            render(
                config.renderQuestionContent(
                    mockItem,
                    'toCountry'
                ) as React.ReactElement
            );
            expect(screen.getByText('+1')).toBeInTheDocument();
        });

        test('renderQuestionPrompt', () => {
            expect(config.renderQuestionPrompt('toCountry')).toContain(
                'What country'
            );
            expect(config.renderQuestionPrompt('toCode')).toContain(
                'telephone code'
            );
        });
    });

    describe('vehicle', () => {
        const config = QUIZ_CONFIGS.vehicle;
        const mockItem: VehicleCode = {
            code: 'USA',
            country: 'United States',
            flag: 'us.png',
        };

        describe('checkAnswer', () => {
            test('toCode: handles correct code', () => {
                testCheckAnswer(
                    'vehicle',
                    'USA',
                    mockItem,
                    { mode: 'toCode' } as QuizSettings,
                    true
                );
            });
            test('toCode: case insensitive', () => {
                testCheckAnswer(
                    'vehicle',
                    'usa',
                    mockItem,
                    { mode: 'toCode' } as QuizSettings,
                    true
                );
            });
            test('toCountry: handles correct country', () => {
                testCheckAnswer(
                    'vehicle',
                    'United States',
                    mockItem,
                    { mode: 'toCountry' } as QuizSettings,
                    true
                );
            });
        });

        test('renderQuestionPrompt', () => {
            expect(config.renderQuestionPrompt('toCountry')).toContain(
                'What country'
            );
            expect(config.renderQuestionPrompt('toCode')).toContain(
                'vehicle registration code'
            );
        });
    });

    describe('driving_side', () => {
        const config = QUIZ_CONFIGS.driving_side;
        const mockItem: DrivingSide = {
            side: 'Right',
            country: 'United States',
            flag: 'us.png',
            switched: false,
        };

        describe('checkAnswer', () => {
            test('guessing (side): correct', () => {
                // mode 'guessing' (default) -> user types side
                testCheckAnswer(
                    'driving_side',
                    'Right',
                    mockItem,
                    { mode: 'guessing' } as QuizSettings,
                    true
                );
            });
            test('guessing (side): case insensitive', () => {
                testCheckAnswer(
                    'driving_side',
                    'right',
                    mockItem,
                    { mode: 'guessing' } as QuizSettings,
                    true
                );
            });
            test('guessing (side): wrong', () => {
                testCheckAnswer(
                    'driving_side',
                    'left',
                    mockItem,
                    { mode: 'guessing' } as QuizSettings,
                    false
                );
            });

            test('toCountry: correct', () => {
                testCheckAnswer(
                    'driving_side',
                    'United States',
                    mockItem,
                    { mode: 'toCountry' } as QuizSettings,
                    true
                );
            });
        });

        test('renderQuestionContent (toCountry)', () => {
            // mode toCountry -> Show Side info "Drives on the Right"
            const itemWithExpl = {
                ...mockItem,
                explanation: 'Drives on the <b>Right</b>. Test explanation.',
            };
            render(
                config.renderQuestionContent(
                    itemWithExpl,
                    'toCountry'
                ) as React.ReactElement
            );
            // The code strips "Drives on the <b>Right</b>. "
            expect(screen.getByText('Drives on the Right')).toBeInTheDocument();
            // Explanation logic test
            expect(screen.getByText('Test explanation.')).toBeInTheDocument();
        });

        test('renderFeedbackOrigin', () => {
            const itemWithExpl = {
                ...mockItem,
                explanation: 'Drives on the <b>Right</b>. Partial explanation.',
            };
            const Feedback = () =>
                config.renderFeedbackOrigin!(
                    itemWithExpl
                ) as React.ReactElement;
            render(<Feedback />);
            expect(
                screen.getByText('Partial explanation.')
            ).toBeInTheDocument();
        });

        test('renderFeedbackOrigin: handles empty', () => {
            const itemNoExpl = { ...mockItem, explanation: '' };
            const result = config.renderFeedbackOrigin!(itemNoExpl);
            expect(result).toBeNull();
        });
    });
});
