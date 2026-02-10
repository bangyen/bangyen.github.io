import { render, screen } from '@testing-library/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import Error from '../Error';

describe('Error Page', () => {
    test('renders 404 and error message', () => {
        render(
            <BrowserRouter>
                <Error />
            </BrowserRouter>
        );

        expect(screen.getByText('404')).toBeInTheDocument();
        expect(screen.getByText('Page Not Found')).toBeInTheDocument();
        expect(
            screen.getByText(/The page you're looking for doesn't exist/i)
        ).toBeInTheDocument();
    });

    test('sets document title', () => {
        render(
            <BrowserRouter>
                <Error />
            </BrowserRouter>
        );
        expect(document.title).toBe('Page Not Found | Bangyen');
    });

    test('contains link to home', () => {
        render(
            <BrowserRouter>
                <Error />
            </BrowserRouter>
        );
        const homeLink = screen.getByRole('link', { name: /Back to Home/i });
        expect(homeLink).toHaveAttribute('href', '/');
    });
});
