import type React from 'react';

export interface ProjectInfo {
    path: string;
    description: string;
    technology: string;
}

export interface ProjectCategory {
    title: string;
    icon: React.ElementType;
    color: string;
    projects: Record<string, ProjectInfo>;
}
