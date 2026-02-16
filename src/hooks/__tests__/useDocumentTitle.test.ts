import { renderHook } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';

import { useDocumentTitle } from '../useDocumentTitle';

describe('useDocumentTitle', () => {
    const originalTitle = document.title;

    beforeEach(() => {
        document.title = originalTitle;
    });

    it('sets document.title when a non-empty title is provided', () => {
        renderHook(() => {
            useDocumentTitle('My Page');
        });
        expect(document.title).toBe('My Page');
    });

    it('does not change document.title when title is undefined', () => {
        document.title = 'Existing Title';
        renderHook(() => {
            useDocumentTitle(undefined);
        });
        expect(document.title).toBe('Existing Title');
    });

    it('does not change document.title when title is an empty string', () => {
        document.title = 'Existing Title';
        renderHook(() => {
            useDocumentTitle('');
        });
        expect(document.title).toBe('Existing Title');
    });

    it('updates document.title when title changes', () => {
        const { rerender } = renderHook(
            ({ title }: { title?: string }) => {
                useDocumentTitle(title);
            },
            { initialProps: { title: 'First' } },
        );
        expect(document.title).toBe('First');

        rerender({ title: 'Second' });
        expect(document.title).toBe('Second');
    });

    it('preserves existing title when updated to undefined', () => {
        const { rerender } = renderHook(
            ({ title }: { title: string | undefined }) => {
                useDocumentTitle(title);
            },
            { initialProps: { title: 'Set' as string | undefined } },
        );
        expect(document.title).toBe('Set');

        rerender({ title: undefined });
        expect(document.title).toBe('Set');
    });
});
