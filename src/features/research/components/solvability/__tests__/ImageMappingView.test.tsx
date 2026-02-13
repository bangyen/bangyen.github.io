import { ThemeProvider, createTheme } from '@mui/material/styles';
import { render, screen } from '@testing-library/react';
import React from 'react';

import { ImageMappingView } from '../ImageMappingView';

const theme = createTheme();

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

describe('ImageMappingView', () => {
    const imageMapping = [
        { state: '0x1', toggle: '0x3' },
        { state: '0x2', toggle: '0x6' },
    ];

    it('renders nothing when imageMapping is empty', () => {
        const { container } = render(
            <ImageMappingView imageMapping={[]} isFullSubspace={true} />
        );
        expect(container.firstChild).toBeNull();
    });

    it('renders Chasing Table when isFullSubspace is true', () => {
        render(
            <TestWrapper>
                <ImageMappingView
                    imageMapping={imageMapping}
                    isFullSubspace={true}
                />
            </TestWrapper>
        );

        expect(screen.getByText('Chasing Table')).toBeInTheDocument();
        expect(screen.getByText('0x1')).toBeInTheDocument();
        expect(screen.getByText('0x3')).toBeInTheDocument();
        expect(
            screen.queryByText('... and other reachable combinations')
        ).not.toBeInTheDocument();
    });

    it('renders column headers', () => {
        render(
            <TestWrapper>
                <ImageMappingView
                    imageMapping={imageMapping}
                    isFullSubspace={true}
                />
            </TestWrapper>
        );

        expect(screen.getByText('BOTTOM RESIDUAL')).toBeInTheDocument();
        expect(screen.getByText('TOP CORRECTION')).toBeInTheDocument();
    });

    it('renders Image Basis when isFullSubspace is false', () => {
        render(
            <TestWrapper>
                <ImageMappingView
                    imageMapping={imageMapping}
                    isFullSubspace={false}
                />
            </TestWrapper>
        );

        expect(screen.getByText('Image Basis')).toBeInTheDocument();
        expect(
            screen.getByText('... and other reachable combinations')
        ).toBeInTheDocument();
    });
});
