import React from 'react';

import { BaseCard } from './BaseCard';
import { HOME_TEXT } from '../../config/constants';

import { OpenInNew } from '@/components/icons';
import type { Publication } from '@/config/constants';
import { COLORS } from '@/config/theme';

export interface PublicationCardProps {
    publication: Publication;
}

/**
 * Card variant for research publications. Delegates all layout to
 * `BaseCard` and only supplies publication-specific data and colours.
 */
export function PublicationCard({
    publication,
}: PublicationCardProps): React.ReactElement {
    return (
        <BaseCard
            url={publication.url}
            category={HOME_TEXT.featuredWork.categories.research}
            CategoryIcon={OpenInNew}
            title={publication.title}
            badge={publication.conference}
            badgeColor={COLORS.surface.success}
            badgeTextColor={COLORS.data.green}
            description={publication.description}
        />
    );
}
