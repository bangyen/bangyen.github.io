import { useMemo } from 'react';
import { QuizType, QuizSettings, QuizItem } from '../types/quiz';

interface UseQuizFilterProps {
    data: QuizItem[];
    quizType: QuizType;
    settings: QuizSettings;
}

export const useQuizFilter = ({
    data,
    quizType,
    settings,
}: UseQuizFilterProps) => {
    const filteredPool = useMemo(() => {
        let filtered = data;

        // Language Filter (only valid for cctld really, but generic check)
        if (
            settings.filterLanguage &&
            settings.filterLanguage !== 'All' &&
            quizType === 'cctld'
        ) {
            if (settings.filterLanguage === 'Non-English') {
                filtered = filtered.filter(
                    (item: any) => item.language !== 'English'
                );
            } else {
                filtered = filtered.filter(
                    (item: any) => item.language === settings.filterLanguage
                );
            }
        }

        // Zone Filter (Telephone only)
        if (
            settings.filterZone &&
            settings.filterZone !== 'All' &&
            quizType === 'telephone'
        ) {
            const zones = settings.filterZone.split(',');
            filtered = filtered.filter((item: any) =>
                zones.some((z: string) => item.code.startsWith(`+${z}`))
            );
        }

        // Vehicle Convention Filter
        if (
            settings.filterConvention &&
            settings.filterConvention !== 'All' &&
            quizType === 'vehicle'
        ) {
            filtered = filtered.filter(
                (item: any) =>
                    item.conventions &&
                    item.conventions.includes(Number(settings.filterConvention))
            );
        }

        // Driving Side Switch Filter
        if (
            settings.filterSwitch &&
            settings.filterSwitch !== 'All' &&
            quizType === 'driving_side'
        ) {
            filtered = filtered.filter((item: any) =>
                settings.filterSwitch === 'Switched'
                    ? item.switched
                    : !item.switched
            );
        }

        // Letter Filter
        if (settings.filterLetter) {
            let letters = settings.filterLetter
                .toLowerCase()
                .split(',')
                .map((l: string) => l.trim())
                .filter((l: string) => l);

            // Special handling for legacy split (spaces) if singular comma usage
            if (letters.length <= 1 && !settings.filterLetter.includes(',')) {
                const spaceSplit = settings.filterLetter
                    .toLowerCase()
                    .split(/\s+/)
                    .filter((l: string) => l);
                if (spaceSplit.length > 1) {
                    letters = spaceSplit;
                } else {
                    letters = settings.filterLetter
                        .toLowerCase()
                        .split('')
                        .filter((l: string) => l.trim());
                }
            }

            if (letters.length > 0) {
                filtered = filtered.filter((item: any) => {
                    let text = '';
                    if (quizType === 'cctld') {
                        text =
                            settings.mode === 'toCountry'
                                ? item.code.toLowerCase().replace('.', '')
                                : item.country.toLowerCase();
                    } else if (quizType === 'driving_side') {
                        text = item.country.toLowerCase();
                    } else if (quizType === 'telephone') {
                        text = item.country.toLowerCase();
                    } else if (quizType === 'vehicle') {
                        text =
                            settings.mode === 'toCountry'
                                ? item.code.toLowerCase()
                                : item.country.toLowerCase();
                    }
                    return letters.some((l: string) => text.startsWith(l));
                });
            }
        }

        if (settings.maxQuestions !== 'All') {
            return [...filtered]
                .sort(() => Math.random() - 0.5)
                .slice(0, settings.maxQuestions as number);
        }
        return filtered;
    }, [data, quizType, settings]);

    return filteredPool;
};
