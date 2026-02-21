import type { SxProps, Theme } from '@mui/material';
import { Box } from '@mui/material';
import katex from 'katex';
import { useEffect, useRef } from 'react';

import 'katex/dist/katex.min.css';

export interface LatexProps {
    formula: string;
    block?: boolean;
    sx?: SxProps<Theme>;
}

export function Latex({ formula, block = false, sx }: LatexProps) {
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
            sx={
                [
                    {
                        display: block ? 'block' : 'inline-block',
                        my: block ? 2 : 0,
                    },
                    sx,
                ] as SxProps<Theme>
            }
        />
    );
}
