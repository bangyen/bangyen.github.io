import React, { useContext, memo } from 'react';
import { Box, Typography, Chip, IconButton } from '../../components/mui';
import { EditorContext } from './EditorContext';
import { Text } from './components/Text';
import { COLORS, TYPOGRAPHY } from '../../config/theme';
import { GlassCard } from '../../components/ui/GlassCard';

import {
    CodeRounded,
    DataArrayRounded,
    TextFieldsRounded,
    PlusOneRounded,
    ViewModuleRounded,
    ViewListRounded,
} from '../../components/icons';

// Type assertion for GlassCard component
const TypedGlassCard = GlassCard as React.ComponentType<{
    children?: React.ReactNode;
    sx?: Record<string, unknown>;
}>;

interface DisplayProps {
    Icon: React.ElementType;
    title: string;
    data: (string | number)[];
    pointer?: number;
    children?: React.ReactNode;
}

interface CompactDisplayProps {
    Icon: React.ElementType;
    title: string;
    data: (string | number)[];
    pointer?: number;
}

interface DisplayModeToggleProps {
    compactMode: boolean;
    setCompactMode: (value: boolean) => void;
}

interface ProgramProps {
    compact?: boolean;
}

interface TapeProps {
    compact?: boolean;
}

interface OutputProps {
    compact?: boolean;
}

interface RegisterProps {
    compact?: boolean;
}

export const Program = memo(function Program({
    compact = false,
}: ProgramProps) {
    const editorContext = useContext(EditorContext);
    if (!editorContext) return null;

    const { code, index } = editorContext;

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
});

export const Tape = memo(function Tape({ compact = false }: TapeProps) {
    const editorContext = useContext(EditorContext);
    if (!editorContext) return null;

    const { tape, pointer, tapeFlag } = editorContext;

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
});

export const Output = memo(function Output({ compact = false }: OutputProps) {
    const editorContext = useContext(EditorContext);
    if (!editorContext) return null;

    const { output, outFlag } = editorContext;

    if (!outFlag) return null;

    // Normalize output to array of strings or numbers
    const outputArray = Array.isArray(output) ? output : [output];

    if (compact) {
        return (
            <CompactDisplay
                Icon={TextFieldsRounded}
                title="Output"
                data={outputArray}
            />
        );
    }

    return (
        <Display Icon={TextFieldsRounded} title="Output" data={outputArray}>
            <Text text={'\xA0'} />
        </Display>
    );
});

export const Register = memo(function Register({
    compact = false,
}: RegisterProps) {
    const editorContext = useContext(EditorContext);
    if (!editorContext) return null;

    const { register, regFlag } = editorContext;

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
});

function Display({ Icon, title, data, pointer, children }: DisplayProps) {
    const items = React.useMemo(
        () =>
            data.map((val, ind) => ({
                id: `${title}-${ind}`,
                val,
                ind,
            })),
        [data, title]
    );

    const values = items.map(item => {
        const color = pointer === item.ind ? 'info' : 'inherit';

        return (
            <Text
                key={item.id}
                color={color}
                text={item.val}
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

function CompactDisplay({ Icon, title, data, pointer }: CompactDisplayProps) {
    const items = React.useMemo(
        () =>
            data.map((val, ind) => ({
                id: `${title}-${ind}`,
                val,
                ind,
            })),
        [data, title]
    );

    const values = items.map(item => {
        const color = pointer === item.ind ? 'info' : 'inherit';
        return (
            <Chip
                key={item.id}
                label={String(item.val)}
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
        <TypedGlassCard
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
        </TypedGlassCard>
    );
}

export function DisplayModeToggle({
    compactMode,
    setCompactMode,
}: DisplayModeToggleProps) {
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
            <IconButton onClick={() => setCompactMode(!compactMode)}>
                {compactMode ? <ViewListRounded /> : <ViewModuleRounded />}
            </IconButton>
        </Box>
    );
}

function Scrollable({ children }: { children: React.ReactNode }) {
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
                {children}
            </Box>
        </GlassCard>
    );
}
