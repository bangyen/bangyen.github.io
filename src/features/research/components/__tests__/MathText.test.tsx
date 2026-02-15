// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import React from 'react';

import { MathText } from '../MathText';

describe('MathText', () => {
    test('renders plain text without superscripts', () => {
        render(<MathText text="Simple text" />);
        expect(screen.getByText('Simple text')).toBeInTheDocument();
    });

    test('renders text with single superscript', () => {
        const { container } = render(<MathText text="x^{2}" />);

        expect(screen.getByText('x')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();

        const sup = container.querySelector('sup');
        expect(sup).toBeInTheDocument();
        expect(sup).toHaveTextContent('2');
    });

    test('renders text with multiple superscripts', () => {
        const { container } = render(<MathText text="a^{b} + c^{d}" />);

        expect(screen.getByText(/a/)).toBeInTheDocument();
        expect(screen.getByText(/b/)).toBeInTheDocument();
        expect(screen.getByText(/c/)).toBeInTheDocument();
        expect(screen.getByText(/d/)).toBeInTheDocument();

        const sups = container.querySelectorAll('sup');
        expect(sups).toHaveLength(2);
        expect(sups[0]).toHaveTextContent('b');
        expect(sups[1]).toHaveTextContent('d');
    });

    test('converts notation in aria-label for accessibility', () => {
        render(<MathText text="2^{10} * 3^{5}" />);

        const wrapper = screen.getByLabelText(
            '2 to the power of 10 times 3 to the power of 5',
        );
        expect(wrapper).toBeInTheDocument();
    });

    test('handles empty text', () => {
        const { container } = render(<MathText text="" />);
        expect(container.firstChild).toBeInTheDocument();
    });

    test('handles malformed superscript notation', () => {
        // Missing closing brace or wrong start should treated as plain text or partial parts
        render(<MathText text="x^{2" />);
        expect(screen.getByText('x^{2')).toBeInTheDocument();
    });

    test('applies correct styling to superscript', () => {
        const { container } = render(<MathText text="x^{n}" />);
        const sup = container.querySelector('sup');

        expect(sup).toHaveStyle({
            fontSize: '0.6em',
            verticalAlign: 'super',
        });
    });
});
