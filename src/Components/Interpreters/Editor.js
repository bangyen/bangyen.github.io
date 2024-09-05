import Tooltip from '@mui/material/Tooltip';
import Grid    from '@mui/material/Grid2';

import {
    Typography,
    IconButton,
    TextField,
    Box
} from '@mui/material';

import {
    CodeRounded,
    DataArrayRounded,
    PlusOneRounded,
    TextFieldsRounded,
    // SquareRounded
} from '@mui/icons-material';

export default function Editor({
        state,
        props,
        getButtons,
        children
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
                    display="flex"
                    paddingTop="2vh"
                    paddingBottom="2vh"
                    alignItems="center">
                {children}
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
        <Values
            Icon={CodeRounded}
            title="Program"
            arr={[...code]}
            ptr={ind}>
            <Monospace
                text={"\xA0"} />
        </Values>
    );
    }

export function Tape({state, props}) {
    const {tape, ptr}  = state;
    const {tape: flag} = props;

    if (!flag)
        return (null);

    return (
        <Values
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
        <Values
            Icon={TextFieldsRounded}
            title="Output"
            arr={[...out]}>
            <Monospace
                text={'\xA0'} />
        </Values>
    );
}

export function Register({state, props}) {
    const {reg: flag} = props;
    const {acc} = state;

    if (!flag)
        return (null);

    return (
        <Values
            Icon={PlusOneRounded}
            title="Register"
            arr={[acc]} />
    );
}

export function Values(props) {
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

export function GridEditor({
        handleChange,
        chooseColor,
        value,
        size
    }) {
    const Cell = ({pos, value}) => {
        const color  = chooseColor(pos);
        const select = `${color}.light`;
        const hover  = `${color}.main`;
        const text   = `${color}.contrastText`;

        return (
            <Box
                onClick={handleChange(pos)}
                display="flex"
                alignItems="center"
                justifyContent="center"
                height="10vmin"
                width="10vmin"
                borderRadius="1vmin"
                color={text}
                backgroundColor={select}
                sx={{
                    cursor: 'pointer',
                    '&:hover': {
                        backgroundColor: hover
                    }
                }}>
                <Typography
                    variant="h4">
                    {value}
                </Typography>
            </Box>
        );
    };

    const Row = (props) => (
        <Grid container
                size={12}
                spacing={1}
                justifyContent="center">
            {props.children}
        </Grid>
    );
    
    return (
        <Grid container
                size={12}
                spacing={1}
                alignItems="center">
            {[...Array(size)]
                .map((_, i) => (
                    <Row key={`row_${i}`}>
                        {[...Array(size)]
                            .map((_, j) => (
                                <Cell
                                    key={`${i}_${j}`}
                                    pos={size * i + j}
                                    value={value[size * i + j]} />
                            ))}
                    </Row>
                ))}
        </Grid>
    );
}

export function TextEditor({handleChange}) {
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
