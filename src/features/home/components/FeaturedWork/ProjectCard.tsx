import React from 'react';

import { BaseCard } from './BaseCard';

import { GitHub } from '@/components/icons';
import { COLORS } from '@/config/theme';

export interface Project {
    title: string;
    technology: string;
    url: string;
    description: string;
}

export interface ProjectCardProps {
    project: Project;
}

/**
 * Card variant for engineering projects. Delegates all layout to
 * `BaseCard` and only supplies project-specific data and colours.
 */
export function ProjectCard({ project }: ProjectCardProps): React.ReactElement {
    return (
        <BaseCard
            url={project.url}
            category="Engineering"
            CategoryIcon={GitHub}
            title={project.title}
            badge={project.technology}
            badgeColor={COLORS.interactive.selected}
            badgeTextColor={COLORS.primary.main}
            description={project.description}
        />
    );
}
