import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import { FeaturedWork } from '../FeaturedWork';
import { ProjectCard } from '../FeaturedWork/ProjectCard';
import { PublicationCard } from '../FeaturedWork/PublicationCard';

import type { Project, Publication } from '@/config/constants';

describe('FeaturedWork Components', () => {
    const mockPublication: Publication = {
        title: 'Pub Title',
        conference: 'Conference Name',
        url: 'https://example.com',
        description: 'Publication Description',
    };

    const mockProject: Project = {
        title: 'Proj Title',
        description: 'Project Description',
        url: 'https://github.com/proj',
        technology: 'React',
    };

    describe('FeaturedWork', () => {
        test('renders featured work sections', () => {
            render(
                <BrowserRouter>
                    <FeaturedWork />
                </BrowserRouter>,
            );
            expect(screen.getByText(/Featured Work/i)).toBeInTheDocument();
        });
    });

    describe('PublicationCard', () => {
        test('renders publication details', () => {
            render(<PublicationCard publication={mockPublication} />);
            expect(screen.getByText(mockPublication.title)).toBeInTheDocument();
            expect(
                screen.getByText(mockPublication.description),
            ).toBeInTheDocument();
        });
    });

    describe('ProjectCard', () => {
        test('renders project details', () => {
            render(
                <BrowserRouter>
                    <ProjectCard project={mockProject} />
                </BrowserRouter>,
            );
            expect(screen.getByText(mockProject.title)).toBeInTheDocument();
            expect(
                screen.getByText(mockProject.description),
            ).toBeInTheDocument();
            expect(screen.getByText('React')).toBeInTheDocument();
        });
    });
});
