import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { GoBackButton, ReturnToHomeButton } from '@/components/ui/ErrorActions';
import { ErrorCard } from '@/components/ui/ErrorCard';
import { ERROR_TEXT, PAGE_TITLES } from '@/config/constants';

/**
 * 404 Not Found page component.
 * Renders a glass card with a standardized error message and navigation
 * actions when the user visits an invalid URL.
 */
export function ErrorPage(): React.ReactElement {
    const navigate = useNavigate();

    useEffect(() => {
        document.title = PAGE_TITLES.error;
    }, []);

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                padding: '20px',
            }}
        >
            <ErrorCard
                title={ERROR_TEXT.title.notFound}
                message={ERROR_TEXT.message.notFound}
            >
                <GoBackButton
                    onClick={() => {
                        void navigate(-1);
                    }}
                />
                <ReturnToHomeButton />
            </ErrorCard>
        </div>
    );
}
