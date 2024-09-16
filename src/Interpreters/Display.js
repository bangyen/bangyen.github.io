import { EditorContext, Text } from './Editor';
import { Tooltip, Box } from '@mui/material';
import { useContext } from 'react';

import {
    CodeRounded,
    DataArrayRounded,
    TextFieldsRounded,
    PlusOneRounded
} from '@mui/icons-material';

import Grid from '@mui/material/Grid2';

export function Program() {
    const { code, index }
        = useContext(EditorContext);

    if (code === undefined)
        return (null);

    return (
        <Display
            Icon={CodeRounded}
            title="Program"
            data={[...code]}
            pointer={index}>
            <Text
                text={"\xA0"} />
        </Display>
    );
    }

export function Tape() {
    const { tape, pointer, tapeFlag }
        = useContext(EditorContext);

    if (!tapeFlag)
        return (null);

    return (
        <Display
            Icon={DataArrayRounded}
            title="Tape"
            data={tape}
            pointer={pointer} />
    );
}

export function Output() {
    const { output, outFlag }
        = useContext(EditorContext);

    if (!outFlag)
        return (null);

    return (
        <Display
            Icon={TextFieldsRounded}
            title="Output"
            data={[output]}>
            <Text
                text={'\xA0'} />
        </Display>
    );
}

export function Register() {
    const { register, regFlag }
        = useContext(EditorContext);

    if (!regFlag)
        return (null);

    return (
        <Display
            Icon={PlusOneRounded}
            title="Register"
            data={[register]} />
    );
}

function Display(props) {
    const {
        Icon,
        title,
        data,
        pointer,
        children
    } = props;

    const values = data.map((val, ind) => {
        const color = pointer === ind
            ? 'info' : 'inherit';

        return (
            <Text
                key={title + ind}
                color={color}
                text={val} />
        );
    });

    return (
        <Scrollable>
            <Tooltip title={title}>
                <Icon />
            </Tooltip>
            {values}
            {children}
        </Scrollable>
    );
}

function Scrollable(props) {
    return (
        <Box sx={{
            overflowX: 'auto',
            width: '100%'
        }}>
            <Grid container
                    spacing={4}
                    sx={{
                        marginBottom: 2,
                        alignItems: 'center',
                        minWidth: 'max-content'
                    }}>
                {props.children}
            </Grid>
        </Box>
    );
}
