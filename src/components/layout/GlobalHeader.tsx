import { Box } from '@mui/material';
import { Link } from 'react-router-dom';

import {
    getHeaderSx,
    headerLeftSlotSx,
    headerRightSlotSx,
    iconButtonHoverSx,
} from './GlobalHeader.styles';
import { GitHub, HomeRounded as Home, InfoRounded as Info } from '../icons';
import { MenuButton } from './ProjectMenu';
import { ThemeToggle } from '../ui/ThemeToggle';
import { TooltipButton } from '../ui/TooltipButton';

import { URLS } from '@/config/constants';

export interface GlobalHeaderProps {
    showHome?: boolean;
    githubUrl?: string;
    infoUrl?: string;
    transparent?: boolean;
}
export function GlobalHeader({
    showHome = false,
    githubUrl = URLS.githubProfile,
    infoUrl,
    transparent = true,
}: GlobalHeaderProps) {
    return (
        <Box
            component="header"
            onClick={e => {
                e.stopPropagation();
            }}
            sx={getHeaderSx(transparent)}
        >
            <Box sx={headerLeftSlotSx}>
                <MenuButton />
            </Box>
            <Box sx={headerRightSlotSx}>
                <ThemeToggle />
                {infoUrl ? (
                    <TooltipButton
                        component="a"
                        href={infoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Documentation"
                        Icon={Info}
                        sx={iconButtonHoverSx}
                    />
                ) : (
                    <TooltipButton
                        component="a"
                        href={githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="View on GitHub"
                        Icon={GitHub}
                        sx={iconButtonHoverSx}
                    />
                )}
                {showHome && (
                    <TooltipButton
                        component={Link}
                        to="/"
                        title="Back to Home"
                        Icon={Home}
                        sx={iconButtonHoverSx}
                    />
                )}
            </Box>
        </Box>
    );
}
