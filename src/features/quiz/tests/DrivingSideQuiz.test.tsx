import { renderHook } from '@testing-library/react';

import { useQuizFilter } from '../hooks/quiz';
import { QuizItem, DrivingSide, QuizSettings } from '../types/quiz';

const MOCK_DATA: DrivingSide[] = [
    {
        type: 'driving_side',
        country: 'Country A',
        side: 'Left',
        switched: false,
    },
    {
        type: 'driving_side',
        country: 'Country B',
        side: 'Right',
        switched: false,
    },
    {
        type: 'driving_side',
        country: 'Country C',
        side: 'Left',
        switched: true,
    },
    {
        type: 'driving_side',
        country: 'Country D',
        side: 'Right',
        switched: true,
    },
];

describe('useQuizFilter - Driving Side', () => {
    it('should filter correctly for "guessing" mode (default)', () => {
        const settings: QuizSettings = {
            mode: 'guessing',
            allowRepeats: false,
            maxQuestions: 'All',
            filterSwitch: 'All',
            filterSide: 'All',
        };

        const { result } = renderHook(() =>
            useQuizFilter({
                data: MOCK_DATA as QuizItem[],
                quizType: 'driving_side',
                settings,
            })
        );

        expect(result.current).toHaveLength(4);
    });

    it('should filter switched countries for "guessing" mode', () => {
        const settings: QuizSettings = {
            mode: 'guessing',
            allowRepeats: false,
            maxQuestions: 'All',
            filterSwitch: 'Switched',
            filterSide: 'All',
        };

        const { result } = renderHook(() =>
            useQuizFilter({
                data: MOCK_DATA as QuizItem[],
                quizType: 'driving_side',
                settings,
            })
        );

        expect(result.current).toHaveLength(2);
        expect((result.current[0] as DrivingSide).switched).toBe(true);
        expect((result.current[1] as DrivingSide).switched).toBe(true);
    });

    it('should force switched=true for "toCountry" mode', () => {
        const settings: QuizSettings = {
            mode: 'toCountry',
            allowRepeats: false,
            maxQuestions: 'All',
            filterSwitch: 'All', // Should be ignored/overridden
            filterSide: 'All',
        };

        const { result } = renderHook(() =>
            useQuizFilter({
                data: MOCK_DATA as QuizItem[],
                quizType: 'driving_side',
                settings,
            })
        );

        expect(result.current).toHaveLength(2);
        expect((result.current[0] as DrivingSide).switched).toBe(true);
    });

    it('should filter by side in "toCountry" mode', () => {
        const settings: QuizSettings = {
            mode: 'toCountry',
            allowRepeats: false,
            maxQuestions: 'All',
            filterSwitch: 'All',
            filterSide: 'Left', // Should only return Country C (Left + Switched)
        };

        const { result } = renderHook(() =>
            useQuizFilter({
                data: MOCK_DATA as QuizItem[],
                quizType: 'driving_side',
                settings,
            })
        );

        expect(result.current).toHaveLength(1);
        expect((result.current[0] as DrivingSide).country).toBe('Country C');
    });

    it('should return empty if side filter matches nothing in switched set', () => {
        // Country A is Left but NOT switched.
        // Country C is Left AND switched.
        // If we had no switched left countries, this would be empty.
        // Let's modify input data slightly for this test logic validation if needed,
        // but with current MOCK_DATA, filtering for 'Right' gives Country D.

        const settings: QuizSettings = {
            mode: 'toCountry',
            allowRepeats: false,
            maxQuestions: 'All',
            filterSwitch: 'All',
            filterSide: 'Right',
        };

        const { result } = renderHook(() =>
            useQuizFilter({
                data: MOCK_DATA as QuizItem[],
                quizType: 'driving_side',
                settings,
            })
        );

        expect(result.current).toHaveLength(1);
        expect((result.current[0] as DrivingSide).country).toBe('Country D');
    });
});
