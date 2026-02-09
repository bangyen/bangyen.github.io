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
const testCheckAnswer = async (
    quizType: keyof typeof QUIZ_CONFIGS,
    input: string,
    item: QuizItem,
    settings: QuizSettings,
    shouldBeCorrect: boolean
) => {
    const result = await QUIZ_CONFIGS[quizType].checkAnswer(
        input,
        item,
        settings
    );
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
            type: 'cctld',
            code: '.us',
            country: 'United States',
            flag: 'us.png',
            language: 'English',
        };

        describe('checkAnswer', () => {
            test('toCountry: handles exact match', async () => {
                await testCheckAnswer(
                    'cctld',
                    'United States',
                    mockItem,
                    { mode: 'toCountry' } as QuizSettings,
                    true
                );
            });
            test('toCountry: handles case insensitive', async () => {
                await testCheckAnswer(
                    'cctld',
                    'united states',
                    mockItem,
                    { mode: 'toCountry' } as QuizSettings,
                    true
                );
            });
            test('toCountry: handles aliases', async () => {
                await testCheckAnswer(
                    'cctld',
                    'USA',
                    mockItem,
                    { mode: 'toCountry' } as QuizSettings,
                    true
                );
            });
            test('toCountry: rejects wrong answer', async () => {
                await testCheckAnswer(
                    'cctld',
                    'Canada',
                    mockItem,
                    { mode: 'toCountry' } as QuizSettings,
                    false
                );
            });

            test('toCode: handles exact match', async () => {
                await testCheckAnswer(
                    'cctld',
                    '.us',
                    mockItem,
                    { mode: 'toCode' } as QuizSettings,
                    true
                );
            });
            test('toCode: handles missing dot', async () => {
                await testCheckAnswer(
                    'cctld',
                    'us',
                    mockItem,
                    { mode: 'toCode' } as QuizSettings,
                    true
                );
            });
            test('toCode: case insensitive', async () => {
                await testCheckAnswer(
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
            type: 'telephone',
            code: '+1',
            country: 'United States',
            flag: 'us.png',
        };

        describe('checkAnswer', () => {
            test('toCountry: exact match', async () => {
                await testCheckAnswer(
                    'telephone',
                    'United States',
                    mockItem,
                    { mode: 'toCountry' } as QuizSettings,
                    true
                );
            });

            test('toCode: handles with plus', async () => {
                await testCheckAnswer(
                    'telephone',
                    '+1',
                    mockItem,
                    { mode: 'toCode' } as QuizSettings,
                    true
                );
            });
            test('toCode: handles without plus', async () => {
                await testCheckAnswer(
                    'telephone',
                    '1',
                    mockItem,
                    { mode: 'toCode' } as QuizSettings,
                    true
                );
            });
            // Some crazy formats ?
            test('toCode: handles spaces', async () => {
                await testCheckAnswer(
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
            type: 'vehicle',
            code: 'USA',
            country: 'United States',
            flag: 'us.png',
        };

        describe('checkAnswer', () => {
            test('toCode: handles correct code', async () => {
                await testCheckAnswer(
                    'vehicle',
                    'USA',
                    mockItem,
                    { mode: 'toCode' } as QuizSettings,
                    true
                );
            });
            test('toCode: case insensitive', async () => {
                await testCheckAnswer(
                    'vehicle',
                    'usa',
                    mockItem,
                    { mode: 'toCode' } as QuizSettings,
                    true
                );
            });
            test('toCountry: handles correct country', async () => {
                await testCheckAnswer(
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
            type: 'driving_side',
            side: 'Right',
            country: 'United States',
            flag: 'us.png',
            switched: false,
        };

        describe('checkAnswer', () => {
            test('guessing (side): correct', async () => {
                // mode 'guessing' (default) -> user types side
                await testCheckAnswer(
                    'driving_side',
                    'Right',
                    mockItem,
                    { mode: 'guessing' } as QuizSettings,
                    true
                );
            });
            test('guessing (side): case insensitive', async () => {
                await testCheckAnswer(
                    'driving_side',
                    'right',
                    mockItem,
                    { mode: 'guessing' } as QuizSettings,
                    true
                );
            });
            test('guessing (side): wrong', async () => {
                await testCheckAnswer(
                    'driving_side',
                    'left',
                    mockItem,
                    { mode: 'guessing' } as QuizSettings,
                    false
                );
            });

            test('toCountry: correct', async () => {
                await testCheckAnswer(
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
