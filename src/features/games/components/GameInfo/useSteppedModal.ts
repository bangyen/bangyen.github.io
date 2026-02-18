import { useState, useCallback } from 'react';

interface SteppedModalControls {
    /** Current zero-based step index. */
    step: number;
    /** Advance to the next step, or close the modal on the final step. */
    handleNext: () => void;
    /** Go back to the previous step (no-op on step 0). */
    handleBack: () => void;
}

/**
 * Encapsulates the step-navigation state for a multi-step modal.
 *
 * Extracted from `GameInfo` so the component focuses solely on
 * rendering while this hook owns the progression logic. Calling
 * `handleNext` on the final step delegates to `onClose` so the
 * modal can dismiss itself.
 */
export function useSteppedModal(
    totalSteps: number,
    onClose: () => void,
    persistenceKey?: string,
): SteppedModalControls {
    const [step, setStep] = useState(() => {
        if (!persistenceKey) return 0;
        try {
            const saved = localStorage.getItem(persistenceKey);
            const parsed = saved ? parseInt(saved, 10) : 0;
            return isNaN(parsed) || parsed < 0 || parsed >= totalSteps
                ? 0
                : parsed;
        } catch {
            return 0;
        }
    });

    const handleNext = useCallback(() => {
        setStep(prev => {
            const next = prev + 1;
            if (next < totalSteps) {
                if (persistenceKey) {
                    localStorage.setItem(persistenceKey, String(next));
                }
                return next;
            }
            onClose();
            return prev;
        });
    }, [totalSteps, onClose, persistenceKey]);

    const handleBack = useCallback(() => {
        setStep(prev => {
            if (prev > 0) {
                const next = prev - 1;
                if (persistenceKey) {
                    localStorage.setItem(persistenceKey, String(next));
                }
                return next;
            }
            return prev;
        });
    }, [persistenceKey]);

    return { step, handleNext, handleBack };
}
