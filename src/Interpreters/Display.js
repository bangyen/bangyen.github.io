import { EditorContext, Text } from './Editor';

import { Box, Typography, Chip, IconButton } from '@mui/material';
import { useContext } from 'react';

import {
    CodeRounded,
    DataArrayRounded,
    TextFieldsRounded,
    PlusOneRounded,
    ViewModuleRounded,
    ViewListRounded,
} from '@mui/icons-material';

import Grid from '@mui/material/Grid2';

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
        />
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

    return <Display Icon={PlusOneRounded} title="Register" data={[register]} />;
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
                    fontSize: '1.2rem',
                    fontWeight: 600,
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
                <Icon sx={{ color: 'primary.light' }} />
                <Typography
                    variant="subtitle2"
                    sx={{
                        color: 'primary.light',
                        fontWeight: 600,
                        fontSize: '0.875rem',
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
                            ? 'primary.light'
                            : 'rgba(128, 128, 128, 0.1)',
                    color: color === 'info' ? 'white' : 'text.primary',
                    fontFamily: 'monospace',
                    fontSize: '0.75rem',
                    height: '24px',
                }}
            />
        );
    });

    return (
        <Box
            sx={{
                padding: 1.5,
                backgroundColor: 'rgba(128, 128, 128, 0.05)',
                border: '1px solid rgba(128, 128, 128, 0.2)',
                borderRadius: 2,
                height: '100%',
                minHeight: '60px',
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
                <Icon sx={{ color: 'primary.light', fontSize: '1rem' }} />
                <Typography
                    variant="caption"
                    sx={{
                        color: 'primary.light',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                    }}
                >
                    {title}
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {values}
            </Box>
        </Box>
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
        <Box
            sx={{
                overflowX: 'auto',
                width: '100%',
                padding: 2,
                backgroundColor: 'rgba(128, 128, 128, 0.05)',
                border: '1px solid rgba(128, 128, 128, 0.2)',
                borderRadius: 2,
                height: '80px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
            }}
        >
            <Grid
                container
                spacing={2}
                sx={{
                    alignItems: 'center',
                    minWidth: 'max-content',
                }}
            >
                {props.children}
            </Grid>
        </Box>
    );
}
