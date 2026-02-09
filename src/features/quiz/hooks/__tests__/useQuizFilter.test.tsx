import { renderHook } from '@testing-library/react';
import { useQuizFilter } from '../quiz';
import { QuizSettings, QuizItem, QuizType } from '../../types/quiz';

const mockSettings: QuizSettings = {
    mode: 'guessing',
    maxQuestions: 10,
    allowRepeats: false,
};

describe('useQuizFilter', () => {
    test('filters by language (cctld)', () => {
        const data = [
            {
                type: 'cctld' as const,
                country: 'USA',
                language: 'English',
                code: '.xx',
            },
            {
                type: 'cctld' as const,
                country: 'France',
                language: 'French',
                code: '.xx',
            },
        ];
        const { result } = renderHook(() =>
            useQuizFilter({
                data: data as unknown as QuizItem[],
                quizType: 'cctld',
                settings: { ...mockSettings, filterLanguage: 'English' },
            })
        );
        expect(result.current).toHaveLength(1);
        expect(result.current[0]!.country).toBe('USA');
    });

    test('filters by specific language (not All/Non-English)', () => {
        const data = [
            {
                type: 'cctld' as const,
                country: 'USA',
                language: 'English',
                code: '.xx',
            },
            {
                type: 'cctld' as const,
                country: 'France',
                language: 'French',
                code: '.xx',
            },
        ];
        const { result } = renderHook(() =>
            useQuizFilter({
                data: data as unknown as QuizItem[],
                quizType: 'cctld',
                settings: { ...mockSettings, filterLanguage: 'French' },
            })
        );
        expect(result.current).toHaveLength(1);
        expect(result.current[0]!.country).toBe('France');
    });

    test('filters by non-english language (cctld)', () => {
        const data = [
            {
                type: 'cctld' as const,
                country: 'USA',
                language: 'English',
                code: '.xx',
            },
            {
                type: 'cctld' as const,
                country: 'France',
                language: 'French',
                code: '.xx',
            },
        ];
        const { result } = renderHook(() =>
            useQuizFilter({
                data: data as unknown as QuizItem[],
                quizType: 'cctld',
                settings: { ...mockSettings, filterLanguage: 'Non-English' },
            })
        );
        expect(result.current).toHaveLength(1);
        expect(result.current[0]!.country).toBe('France');
    });

    test('filters by zone (telephone)', () => {
        const data = [
            { type: 'telephone' as const, country: 'USA', code: '+1' },
            { type: 'telephone' as const, country: 'UK', code: '+44' },
        ];
        const { result } = renderHook(() =>
            useQuizFilter({
                data: data as unknown as QuizItem[],
                quizType: 'telephone',
                settings: { ...mockSettings, filterZone: '1' },
            })
        );
        expect(result.current).toHaveLength(1);
        expect(result.current[0]!.country).toBe('USA');
    });

    test('filters by multiple zones (telephone)', () => {
        const data = [
            { type: 'telephone' as const, country: 'USA', code: '+1' },
            { type: 'telephone' as const, country: 'UK', code: '+44' },
            { type: 'telephone' as const, country: 'France', code: '+33' },
        ];
        const { result } = renderHook(() =>
            useQuizFilter({
                data: data as unknown as QuizItem[],
                quizType: 'telephone',
                settings: { ...mockSettings, filterZone: '1,44' },
            })
        );
        expect(result.current).toHaveLength(2);
    });

    test('filters by convention (vehicle)', () => {
        const data = [
            {
                type: 'vehicle' as const,
                country: 'A',
                code: 'XX',
                conventions: [1909],
            },
            {
                type: 'vehicle' as const,
                country: 'B',
                code: 'XX',
                conventions: [1949],
            },
        ];
        const { result } = renderHook(() =>
            useQuizFilter({
                data: data as unknown as QuizItem[],
                quizType: 'vehicle',
                settings: { ...mockSettings, filterConvention: '1909' },
            })
        );
        expect(result.current).toHaveLength(1);
        expect(result.current[0]!.country).toBe('A');
    });

    test('filters by switch (driving_side)', () => {
        const data = [
            {
                type: 'driving_side' as const,
                country: 'A',
                side: 'Left' as const,
                switched: true,
            },
            {
                type: 'driving_side' as const,
                country: 'B',
                side: 'Left' as const,
                switched: false,
            },
        ];
        const { result } = renderHook(() =>
            useQuizFilter({
                data: data as unknown as QuizItem[],
                quizType: 'driving_side',
                settings: {
                    ...mockSettings,
                    mode: 'guessing',
                    filterSwitch: 'Switched',
                },
            })
        );
        expect(result.current).toHaveLength(1);
        expect(result.current[0]!.country).toBe('A');

        const { result: result2 } = renderHook(() =>
            useQuizFilter({
                data: data as unknown as QuizItem[],
                quizType: 'driving_side',
                settings: {
                    ...mockSettings,
                    mode: 'guessing',
                    filterSwitch: 'Never switched',
                },
            })
        );
        expect(result2.current).toHaveLength(1);
        expect(result2.current[0]!.country).toBe('B');
    });

    test('filters by side in toCountry mode (driving_side)', () => {
        const data = [
            {
                type: 'driving_side' as const,
                country: 'A',
                side: 'Left' as const,
                switched: true,
            },
            {
                type: 'driving_side' as const,
                country: 'B',
                side: 'Right' as const,
                switched: true,
            },
            {
                type: 'driving_side' as const,
                country: 'C',
                side: 'Left' as const,
                switched: false,
            },
        ];
        const { result } = renderHook(() =>
            useQuizFilter({
                data: data as unknown as QuizItem[],
                quizType: 'driving_side',
                settings: {
                    ...mockSettings,
                    mode: 'toCountry',
                    filterSide: 'Left',
                },
            })
        );
        expect(result.current).toHaveLength(1);
        expect(result.current[0]!.country).toBe('A');
    });

    test('handles complex filterLetter logic', () => {
        const data = [
            {
                type: 'cctld' as const,
                country: 'Apple',
                code: '.ap',
                language: 'English',
            },
            {
                type: 'cctld' as const,
                country: 'Banana',
                code: '.ba',
                language: 'English',
            },
            {
                type: 'cctld' as const,
                country: 'Cherry',
                code: '.ch',
                language: 'English',
            },
        ];

        // Space separated
        const { result: res1 } = renderHook(() =>
            useQuizFilter({
                data: data as unknown as QuizItem[],
                quizType: 'cctld',
                settings: {
                    ...mockSettings,
                    mode: 'toCode',
                    filterLetter: 'ap ba',
                },
            })
        );
        expect(res1.current).toHaveLength(2);

        // Individual letters (no comma/space)
        const { result: res2 } = renderHook(() =>
            useQuizFilter({
                data: data as unknown as QuizItem[],
                quizType: 'cctld',
                settings: {
                    ...mockSettings,
                    mode: 'toCode',
                    filterLetter: 'ab',
                },
            })
        );
        expect(res2.current).toHaveLength(2);
    });

    test('filters by letters for other quiz types', () => {
        const vehicles = [
            { type: 'vehicle' as const, country: 'Albania', code: 'AL' },
            { type: 'vehicle' as const, country: 'Belgium', code: 'B' },
        ];
        const { result } = renderHook(() =>
            useQuizFilter({
                data: vehicles as unknown as QuizItem[],
                quizType: 'vehicle',
                settings: {
                    ...mockSettings,
                    mode: 'toCountry',
                    filterLetter: 'a',
                },
            })
        );
        expect(result.current).toHaveLength(1);
        expect(result.current[0]!.country).toBe('Albania');
    });

    test('filters by letters for driving_side and telephone', () => {
        const data = [
            { type: 'telephone' as const, country: 'USA', code: '+1' },
            { type: 'telephone' as const, country: 'UK', code: '+44' },
        ];
        // Telephone
        const { result: res1 } = renderHook(() =>
            useQuizFilter({
                data: data as unknown as QuizItem[],
                quizType: 'telephone',
                settings: { ...mockSettings, filterLetter: 'u' },
            })
        );
        expect(res1.current).toHaveLength(2);

        // Driving side
        const { result: res2 } = renderHook(() =>
            useQuizFilter({
                data: [
                    {
                        type: 'driving_side' as const,
                        country: 'Albania',
                        side: 'Left' as const,
                    },
                    {
                        type: 'driving_side' as const,
                        country: 'Belgium',
                        side: 'Right' as const,
                    },
                ] as unknown as QuizItem[],
                quizType: 'driving_side',
                settings: { ...mockSettings, filterLetter: 'a' },
            })
        );
        expect(res2.current).toHaveLength(1);
    });

    test('returns all if maxQuestions is All', () => {
        const data = [
            {
                type: 'cctld' as const,
                country: 'A',
                code: '.a',
                language: 'English',
            },
            {
                type: 'cctld' as const,
                country: 'B',
                code: '.b',
                language: 'English',
            },
        ];
        const { result } = renderHook(() =>
            useQuizFilter({
                data: data as unknown as QuizItem[],
                quizType: 'cctld',
                settings: { ...mockSettings, maxQuestions: 'All' },
            })
        );
        expect(result.current).toHaveLength(2);
    });

    test('filters by switch in toCountry mode (driving_side) - branch coverage', () => {
        const data = [
            {
                type: 'driving_side' as const,
                country: 'A',
                side: 'Left' as const,
                switched: true,
            },
            {
                type: 'driving_side' as const,
                country: 'B',
                side: 'Left' as const,
                switched: false,
            },
        ];
        const { result } = renderHook(() =>
            useQuizFilter({
                data: data as unknown as QuizItem[],
                quizType: 'driving_side',
                settings: {
                    ...mockSettings,
                    mode: 'toCountry',
                    filterSwitch: 'Switched',
                },
            })
        );
        expect(result.current).toHaveLength(1);
        expect(result.current[0]!.country).toBe('A');
    });

    test('filters by letters with empty/whitespace input', () => {
        const data = [
            {
                type: 'cctld' as const,
                country: 'A',
                code: '.a',
                language: 'English',
            },
        ];
        const { result } = renderHook(() =>
            useQuizFilter({
                data: data as unknown as QuizItem[],
                quizType: 'cctld',
                settings: { ...mockSettings, filterLetter: ' ' },
            })
        );
        expect(result.current).toHaveLength(1);
    });

    test('filters by letters in toCode mode for vehicle', () => {
        const data = [
            { type: 'vehicle' as const, country: 'Albania', code: 'AL' },
        ];
        const { result } = renderHook(() =>
            useQuizFilter({
                data: data as unknown as QuizItem[],
                quizType: 'vehicle',
                settings: {
                    ...mockSettings,
                    mode: 'toCode',
                    filterLetter: 'a',
                },
            })
        );
        expect(result.current).toHaveLength(1);
    });

    test('filters by comma separated letters', () => {
        const data = [
            {
                type: 'cctld' as const,
                country: 'Apple',
                code: '.ap',
                language: 'English',
            },
            {
                type: 'cctld' as const,
                country: 'Banana',
                code: '.ba',
                language: 'English',
            },
        ];
        const { result } = renderHook(() =>
            useQuizFilter({
                data: data as unknown as QuizItem[],
                quizType: 'cctld',
                settings: { ...mockSettings, filterLetter: 'a,b' },
            })
        );
        expect(result.current).toHaveLength(2);
    });

    test('filters by letters in guessing mode for cctld and vehicle', () => {
        const cctlds = [
            {
                type: 'cctld' as const,
                country: 'Albania',
                code: '.al',
                language: 'Albanian',
            },
        ];
        const vehicles = [
            { type: 'vehicle' as const, country: 'Belgium', code: 'B' },
        ];

        // cctld guessing mode
        const { result: res1 } = renderHook(() =>
            useQuizFilter({
                data: cctlds as unknown as QuizItem[],
                quizType: 'cctld',
                settings: {
                    ...mockSettings,
                    mode: 'guessing',
                    filterLetter: 'a',
                },
            })
        );
        expect(res1.current).toHaveLength(1);

        // vehicle guessing mode
        const { result: res2 } = renderHook(() =>
            useQuizFilter({
                data: vehicles as unknown as QuizItem[],
                quizType: 'vehicle',
                settings: {
                    ...mockSettings,
                    mode: 'guessing',
                    filterLetter: 'b',
                },
            })
        );
        expect(res2.current).toHaveLength(1);

        // non-specialized quiz (capitals)
        const { result: res3 } = renderHook(() =>
            useQuizFilter({
                data: [{ country: 'France' }] as unknown as QuizItem[],
                quizType: 'capitals' as unknown as QuizType,
                settings: { ...mockSettings, filterLetter: 'f' },
            })
        );
        // Current implementation sets text to '' for unknown types
        expect(res3.current).toHaveLength(1);

        // cctld toCountry mode
        const { result: res4 } = renderHook(() =>
            useQuizFilter({
                data: [
                    {
                        type: 'cctld' as const,
                        country: 'Albania',
                        code: '.al',
                        language: 'Albanian',
                    },
                ] as unknown as QuizItem[],
                quizType: 'cctld',
                settings: {
                    ...mockSettings,
                    mode: 'toCountry',
                    filterLetter: 'a',
                },
            })
        );
        expect(res4.current).toHaveLength(1);
    });

    test('respects max questions', () => {
        const data = [
            {
                type: 'cctld' as const,
                country: 'A',
                code: '.a',
                language: 'English',
            },
            {
                type: 'cctld' as const,
                country: 'B',
                code: '.b',
                language: 'English',
            },
            {
                type: 'cctld' as const,
                country: 'C',
                code: '.c',
                language: 'English',
            },
        ];
        const { result } = renderHook(() =>
            useQuizFilter({
                data: data as unknown as QuizItem[],
                quizType: 'cctld',
                settings: { ...mockSettings, maxQuestions: 2 },
            })
        );
        expect(result.current).toHaveLength(2);
    });
});
