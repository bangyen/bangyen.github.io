import React from 'react';
import { render, screen } from '@testing-library/react';
import { FeaturedWork } from '../FeaturedWork';
import { PublicationCard } from '../FeaturedWork/PublicationCard';
import { ProjectCard, Project } from '../FeaturedWork/ProjectCard';
import { BrowserRouter } from 'react-router-dom';

describe('FeaturedWork Components', () => {
    const mockPublication = {
        title: 'Pub Title',
        authors: 'Author Names',
        venue: 'Conference Name',
        date: '2023',
        description: 'Publication Description',
        link: 'https://example.com',
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
                </BrowserRouter>
            );
            expect(screen.getByText(/Featured Work/i)).toBeInTheDocument();
        });
    });

    describe('PublicationCard', () => {
        test('renders publication details', () => {
            render(<PublicationCard publication={mockPublication as any} />);
            expect(screen.getByText(mockPublication.title)).toBeInTheDocument();
            expect(
                screen.getByText(mockPublication.description)
            ).toBeInTheDocument();
        });
    });

    describe('ProjectCard', () => {
        test('renders project details', () => {
            render(
                <BrowserRouter>
                    <ProjectCard project={mockProject} />
                </BrowserRouter>
            );
            expect(screen.getByText(mockProject.title)).toBeInTheDocument();
            expect(
                screen.getByText(mockProject.description)
            ).toBeInTheDocument();
            expect(screen.getByText('React')).toBeInTheDocument();
        });
    });
});
