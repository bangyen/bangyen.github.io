import Tooltip from '@mui/material/Tooltip';
import Grid    from '@mui/material/Grid2';

import {
    Typography,
    IconButton,
    TextField
} from '@mui/material';

import {
    CodeRounded,
    DataArrayRounded,
    PlusOneRounded,
    TextFieldsRounded
} from '@mui/icons-material';

export default function Editor({
        state,
        props,
        getButtons,
        handleChange
    }) {
    const {name}  = props;

    return (
        <Grid container
                height="100vh"
                display="flex"
                flexDirection="column"
                spacing={2}
                paddingTop="5vh"
                paddingBottom="5vh"
                paddingLeft="5vw"
                paddingRight="5vw">
            <Grid container
                    justifyContent="space-between"
                    alignItems="center">
                <Grid size="grow"
                        sx={{
                            display: {
                                xs: 'none',
                                md: 'block'
                            }
                        }}>
                    <Typography
                        variant="h2">
                        {name}
                    </Typography>
                </Grid>
                {getButtons()}
            </Grid>
            <Grid flex={1}
                    paddingTop="2vh"
                    paddingBottom="2vh">
                <TextEditor
                    handleChange={handleChange} />
            </Grid>
            <Program
                state={state} />
            <Output
                state={state}
                props={props} />
            <Tape
                state={state}
                props={props} />
            <Register
                state={state}
                props={props} />
        </Grid>
    );
}

export function Program({state}) {
    const {code, ind} = state;

    if (code === undefined)
        return (null);

    return (
        <Array
            Icon={CodeRounded}
            title="Program"
            arr={[...code]}
            ptr={ind}>
            <Monospace
                text={"\xA0"} />
        </Array>
    );
    }

export function Tape({state, props}) {
    const {tape, ptr}  = state;
    const {tape: flag} = props;

    if (!flag)
        return (null);

    return (
        <Array
            Icon={DataArrayRounded}
            title="Tape"
            arr={tape}
            ptr={ptr} />
    );
}

export function Output({state, props}) {
    const {out} = state;
    const {out: flag} = props;

    if (!flag)
        return (null);

    return (
        <Array
            Icon={TextFieldsRounded}
            title="Output"
            arr={[...out]}>
            <Monospace
                text={'\xA0'} />
        </Array>
    );
}

export function Register({state, props}) {
    const {reg: flag} = props;
    const {acc} = state;

    if (!flag)
        return (null);

    return (
        <Array
            Icon={PlusOneRounded}
            title="Register"
            arr={[acc]} />
    );
}

export function Array(props) {
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
            <Monospace
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

export function CustomButton(props) {
    const {Icon, title, ...rest} = props;

    return (
        <Tooltip title={title}>
            <IconButton
                    {...rest}
                    size='large'>
                <Icon fontSize='inherit' />
            </IconButton>
        </Tooltip>
    );
}

export function Monospace(props) {
    return (
        <Typography
                {...props}
                variant='h4'>
            {props.text}
        </Typography>
    );
}

export function Scrollable(props) {
    return (
        <Grid container
                spacing={4}
                overflow="auto"
                flexWrap="nowrap"
                alignItems="center">
            {props.children}
        </Grid>
    );
}

export function TextEditor({value, handleChange}) {
    return (
        <TextField
            variant="outlined"
            label="Program code"
            defaultValue="Hello, World!"
            slotProps={{
                inputLabel: {shrink: true}
            }}
            fullWidth
            multiline
            value={value}
            onChange={handleChange}
            sx={{
                height: '100%',
                '& .MuiInputBase-root': {
                    height: '100%',
                    alignItems: 'flex-start',
                },
                '& .MuiInputBase-input': {
                    fontFamily: 'monospace'
                }
        }}/>
    );
}
