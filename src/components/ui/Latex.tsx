import { Box } from '@mui/material';
import katex from 'katex';
import React, { useEffect, useRef } from 'react';

import 'katex/dist/katex.min.css';

export interface LatexProps {
    formula: string;
    block?: boolean;
    sx?: object;
}

export const Latex: React.FC<LatexProps> = ({
    formula,
    block = false,
    sx = {},
}) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            katex.render(formula, containerRef.current, {
                throwOnError: false,
                displayMode: block,
            });
        }
    }, [formula, block]);

    return (
        <Box
            component={block ? 'div' : 'span'}
            ref={containerRef}
            sx={{
                display: block ? 'block' : 'inline-block',
                my: block ? 2 : 0,
                ...sx,
            }}
        />
    );
};
