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
    const { code, ind }
        = useContext(EditorContext);

    if (code === undefined)
        return (null);

    return (
        <Display
            Icon={CodeRounded}
            title="Program"
            arr={[...code]}
            ptr={ind}>
            <Text
                text={"\xA0"} />
        </Display>
    );
    }

export function Tape() {
    const { tape, ptr, tapeFlag }
        = useContext(EditorContext);

    if (!tapeFlag)
        return (null);

    return (
        <Display
            Icon={DataArrayRounded}
            title="Tape"
            arr={tape}
            ptr={ptr} />
    );
}

export function Output() {
    const { out, outFlag }
        = useContext(EditorContext);

    if (!outFlag)
        return (null);

    return (
        <Display
            Icon={TextFieldsRounded}
            title="Output"
            arr={[out]}>
            <Text
                text={'\xA0'} />
        </Display>
    );
}

export function Register() {
    const { acc, accFlag }
        = useContext(EditorContext);

    if (!accFlag)
        return (null);

    return (
        <Display
            Icon={PlusOneRounded}
            title="Register"
            arr={[acc]} />
    );
}

function Display(props) {
    const {
        Icon,
        title,
        arr,
        ptr,
        children
    } = props;

    const values = arr.map((val, ind) => {
        const color = ptr === ind
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
