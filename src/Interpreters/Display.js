import { EditorContext, Text } from './Editor';

import { Box, Typography, Chip, IconButton } from '../components/mui';
import { useContext } from 'react';
import { COLORS, TYPOGRAPHY } from '../config/theme';
import { GlassCard } from '../helpers';

import {
    CodeRounded,
    DataArrayRounded,
    TextFieldsRounded,
    PlusOneRounded,
    ViewModuleRounded,
    ViewListRounded,
} from '../components/icons';

export function Program({ compact = false }) {
    const { code, index } = useContext(EditorContext);

    if (code === undefined) return null;

    if (compact) {
        return (
            <CompactDisplay
                Icon={CodeRounded}
                title="Program"
                data={[...code]}
                pointer={index}
            />
        );
    }

    return (
        <Display
            Icon={CodeRounded}
            title="Program"
            data={[...code]}
            pointer={index}
        >
            <Text text={'\xA0'} />
        </Display>
    );
}

export function Tape({ compact = false }) {
    const { tape, pointer, tapeFlag } = useContext(EditorContext);

    if (!tapeFlag) return null;

    if (compact) {
        return (
            <CompactDisplay
                Icon={DataArrayRounded}
                title="Tape"
                data={tape}
                pointer={pointer}
            />
        );
    }

    return (
        <Display
            Icon={DataArrayRounded}
            title="Tape"
            data={tape}
            pointer={pointer}
        >
            <Text text={'\xA0'} />
        </Display>
    );
}

export function Output({ compact = false }) {
    const { output, outFlag } = useContext(EditorContext);

    if (!outFlag) return null;

    if (compact) {
        return (
            <CompactDisplay
                Icon={TextFieldsRounded}
                title="Output"
                data={[output]}
            />
        );
    }

    return (
        <Display Icon={TextFieldsRounded} title="Output" data={[output]}>
            <Text text={'\xA0'} />
        </Display>
    );
}

export function Register({ compact = false }) {
    const { register, regFlag } = useContext(EditorContext);

    if (!regFlag) return null;

    if (compact) {
        return (
            <CompactDisplay
                Icon={PlusOneRounded}
                title="Register"
                data={[register]}
            />
        );
    }

    return (
        <Display Icon={PlusOneRounded} title="Register" data={[register]}>
            <Text text={'\xA0'} />
        </Display>
    );
}

function Display(props) {
    const { Icon, title, data, pointer, children } = props;

    const values = data.map((val, ind) => {
        const color = pointer === ind ? 'info' : 'inherit';

        return (
            <Text
                key={title + ind}
                color={color}
                text={val}
                sx={{
                    fontSize: TYPOGRAPHY.fontSize.body,
                    fontWeight: TYPOGRAPHY.fontWeight.semibold,
                    fontFamily: 'monospace',
                }}
            />
        );
    });

    return (
        <Box sx={{ height: '100%' }}>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    marginBottom: 1,
                }}
            >
                <Icon sx={{ color: COLORS.primary.main }} />
                <Typography
                    variant="subtitle2"
                    sx={{
                        color: COLORS.primary.main,
                        fontWeight: TYPOGRAPHY.fontWeight.semibold,
                        fontSize: TYPOGRAPHY.fontSize.body,
                    }}
                >
                    {title}
                </Typography>
            </Box>
            <Scrollable>
                {values}
                {children}
            </Scrollable>
        </Box>
    );
}

function CompactDisplay(props) {
    const { Icon, title, data, pointer } = props;

    const values = data.map((val, ind) => {
        const color = pointer === ind ? 'info' : 'inherit';
        return (
            <Chip
                key={title + ind}
                label={val}
                size="small"
                sx={{
                    backgroundColor:
                        color === 'info'
                            ? COLORS.primary.main
                            : COLORS.surface.glass,
                    color:
                        color === 'info'
                            ? COLORS.text.primary
                            : COLORS.text.primary,
                    fontFamily: 'monospace',
                    fontSize: TYPOGRAPHY.fontSize.caption,
                    height: '32px',
                    border: `1px solid ${COLORS.border.subtle}`,
                    backdropFilter: 'blur(24px) saturate(180%)',
                }}
            />
        );
    });

    return (
        <GlassCard
            sx={{
                height: '100%',
                minHeight: '24rem',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    marginBottom: 1,
                }}
            >
                <Icon
                    sx={{
                        color: COLORS.primary.main,
                        fontSize: TYPOGRAPHY.fontSize.body,
                    }}
                />
                <Typography
                    variant="caption"
                    sx={{
                        color: COLORS.primary.main,
                        fontWeight: TYPOGRAPHY.fontWeight.semibold,
                        fontSize: TYPOGRAPHY.fontSize.caption,
                    }}
                >
                    {title}
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {values}
            </Box>
        </GlassCard>
    );
}

export function DisplayModeToggle({ compactMode, setCompactMode }) {
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                marginBottom: 2,
            }}
        >
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Display Mode:
            </Typography>
            <IconButton
                onClick={() => setCompactMode(!compactMode)}
                sx={{
                    color: compactMode ? 'primary.light' : 'text.secondary',
                    padding: 0.5,
                }}
            >
                {compactMode ? <ViewModuleRounded /> : <ViewListRounded />}
            </IconButton>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {compactMode ? 'Compact' : 'Expanded'}
            </Typography>
        </Box>
    );
}

function Scrollable(props) {
    return (
        <GlassCard
            sx={{
                overflowX: 'auto',
                width: '100%',
                maxWidth: '100%',
                height: '60px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: 2,
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    width: 'max-content',
                    minWidth: 0,
                }}
            >
                {props.children}
            </Box>
        </GlassCard>
    );
}
