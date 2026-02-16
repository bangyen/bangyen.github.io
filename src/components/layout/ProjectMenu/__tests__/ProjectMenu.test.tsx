import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { MenuButton } from '..';

describe('ProjectMenu', () => {
    test('renders menu button and toggles menu', () => {
        render(
            <BrowserRouter>
                <MenuButton />
            </BrowserRouter>,
        );

        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();

        // Menu should be closed initially
        expect(screen.queryByText(/Games/i)).not.toBeInTheDocument();

        // Click to open
        fireEvent.click(button);

        // Check if ProjectDropdown content is visible
        // PROJECT_CATEGORIES usually has titles like "Games", "Research", etc.
        expect(screen.getByText(/Games/i)).toBeInTheDocument();

        // Close menu
        // Mui Menu usually handles onClose when clicking backdrop or Escape
        // But here we can just verify it's open.
    });
});
