import { CommonPatterns } from './CommonPatterns';
import { Example } from './Example';
import {
    SLANT_INFO_TITLES,
    SLANT_INSTRUCTIONS,
    slantInfoContentSx,
} from '../config';

import { LazyGameInfo } from '@/features/games/components/GameInfo/LazyGameInfo';
import type { BaseInfoProps } from '@/features/games/types';
import { useMobile } from '@/hooks';

interface SlantInfoProps extends BaseInfoProps {
    handleOpenAnalysis: () => void;
}

/**
 * Game-specific information modal for Slant.
 * Wraps the generic GameInfo component with Slant's instructions,
 * example animation, and analysis toggle.
 */
export function SlantInfo({
    open,
    toggleOpen,
    handleOpenAnalysis,
}: SlantInfoProps) {
    const isMobile = useMobile('sm');

    return (
        <LazyGameInfo
            open={open}
            toggleOpen={toggleOpen}
            titles={SLANT_INFO_TITLES}
            instructions={SLANT_INSTRUCTIONS}
            exampleContent={
                <Example
                    size={isMobile ? 3 : 4}
                    handleOpenAnalysis={handleOpenAnalysis}
                />
            }
            contentSxOverride={slantInfoContentSx}
            persistenceKey="slant_info_step"
            extraSteps={[<CommonPatterns key="patterns" />]}
        />
    );
}
