import { render, screen } from '@testing-library/react';
import React from 'react';

import { MathText } from '../MathText';

describe('MathText', () => {
    it('renders normal text correctly', () => {
        render(<MathText text="Normal text" />);
        expect(screen.getByText('Normal text')).toBeInTheDocument();
    });

    it('renders superscript notation correctly', () => {
        const { container } = render(<MathText text="x^{2} + y^{3}" />);

        const superscripts = container.querySelectorAll('sup');
        expect(superscripts).toHaveLength(2);
        expect(superscripts[0]).toHaveTextContent('2');
        expect(superscripts[1]).toHaveTextContent('3');

        expect(screen.getByText(/x/)).toBeInTheDocument();
        expect(screen.getByText(/\+ y/)).toBeInTheDocument();
    });

    it('has correct aria-label for accessibility', () => {
        render(<MathText text="x^{2} * y^{3}" />);
        const element = screen.getByLabelText(
            /x to the power of 2 times y to the power of 3/
        );
        expect(element).toBeInTheDocument();
    });

    it('handles text without superscripts', () => {
        render(<MathText text="a + b = c" />);
        expect(screen.getByText(/a \+ b = c/)).toBeInTheDocument();
    });

    it('handles multiple parts correctly', () => {
        const { container } = render(<MathText text="2^{n} + 1" />);
        expect(screen.getByText(/2/)).toBeInTheDocument();
        expect(container.querySelector('sup')).toHaveTextContent('n');
        expect(screen.getByText(/\+ 1/)).toBeInTheDocument();
    });
});
