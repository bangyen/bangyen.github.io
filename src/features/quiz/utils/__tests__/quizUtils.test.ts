import { normalize, isSmartMatch } from '../quizUtils';

describe('quizUtils', () => {
    describe('normalize', () => {
        test('converts to lowercase', () => {
            expect(normalize('HELLO')).toBe('hello');
        });

        test('removes accents', () => {
            expect(normalize('café')).toBe('cafe');
            expect(normalize('São Paulo')).toBe('sao paulo');
        });

        test('converts st. to saint', () => {
            expect(normalize('St. Louis')).toBe('saint louis');
            expect(normalize('st. petersburg')).toBe('saint petersburg');
        });

        test('removes leading "the"', () => {
            expect(normalize('The Netherlands')).toBe('netherlands');
            expect(normalize('the gambia')).toBe('gambia');
        });

        test('removes non-alphanumeric characters except dots', () => {
            expect(normalize('hello-world')).toBe('helloworld');
            expect(normalize('test.codes')).toBe('test.codes');
        });
    });

    describe('isSmartMatch', () => {
        test('exact normalized match', () => {
            expect(isSmartMatch('France', 'France')).toBe(true);
            expect(isSmartMatch('FRANCE', 'france')).toBe(true);
        });

        test('handles aliases', () => {
            const aliases = {
                'united states': ['usa', 'us', 'america'],
            };
            expect(isSmartMatch('USA', 'United States', aliases)).toBe(true);
            expect(isSmartMatch('america', 'United States', aliases)).toBe(
                true
            );
        });

        test('handles parentheses - full match without parens', () => {
            expect(
                isSmartMatch('Cocos Islands', 'Cocos (Keeling) Islands')
            ).toBe(true);
        });

        test('handles parentheses - first part before parens', () => {
            expect(isSmartMatch('Cocos', 'Cocos (Keeling) Islands')).toBe(true);
        });

        test('handles "and" - matches first part before "and"', () => {
            expect(isSmartMatch('Trinidad', 'Trinidad and Tobago')).toBe(true);
            expect(isSmartMatch('Antigua', 'Antigua and Barbuda')).toBe(true);
            expect(isSmartMatch('Bosnia', 'Bosnia and Herzegovina')).toBe(true);
        });

        test('handles strings without "and" - no special processing', () => {
            expect(isSmartMatch('France', 'France')).toBe(true);
            expect(isSmartMatch('Germany', 'Germany')).toBe(true);
            expect(isSmartMatch('Japan', 'Japan')).toBe(true);
        });

        test('returns false for non-matching strings', () => {
            expect(isSmartMatch('France', 'Germany')).toBe(false);
            expect(isSmartMatch('USA', 'Canada')).toBe(false);
        });

        test('handles complex cases with accents and "and"', () => {
            expect(isSmartMatch('São Tomé', 'São Tomé and Príncipe')).toBe(
                true
            );
        });
    });
});
