import React from 'react';

/**
 * Renders text with superscript notation for mathematical expressions
 * Converts ^{text} to superscript format
 */
export const MathText: React.FC<{ text: string }> = ({ text }) => {
    const parts = text.split(/(\^{[^}]+})/g);
    return (
        <span
            aria-label={text
                .replaceAll(/\^{([^}]+)}/g, ' to the power of $1')
                .replaceAll('*', ' times ')}
        >
            <span aria-hidden="true">
                {parts.map((part, i) => {
                    const key = `${part}-${String(i)}`;
                    if (part.startsWith('^{') && part.endsWith('}')) {
                        const exponent = part.slice(2, -1);
                        return (
                            <sup
                                key={key}
                                style={{
                                    fontSize: '0.6em',
                                    verticalAlign: 'super',
                                    marginLeft: '1px',
                                }}
                            >
                                {exponent}
                            </sup>
                        );
                    }
                    return <span key={key}>{part}</span>;
                })}
            </span>
        </span>
    );
};
