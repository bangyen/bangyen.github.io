import Tooltip  from '@mui/material/Tooltip';
import Grid     from '@mui/material/Grid2';
import { Link } from 'react-router-dom';
import { CustomButton, GenericGrid } from '../helpers';

import {
    Typography,
    TextField,
    Box
} from '@mui/material';

import {
    NavigateBeforeRounded,
    NavigateNextRounded,
    PlayArrowRounded,
    LastPageRounded,
    HomeRounded,
    StopRounded,
    InfoRounded,
    CodeRounded,
    DataArrayRounded,
    PlusOneRounded,
    TextFieldsRounded,
    // SquareRounded
} from '@mui/icons-material';

export default function Editor({
        name,
        code,
        flags,
        values,
        functions,
        children
    }) {
    const {
        tape,
        ind, ptr,
        out, acc
    } = values;

    const {
        tape: tapeFlag,
        out: outFlag,
        acc: accFlag,
        link
    } = flags;

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
                <Toolbar
                    name={name}
                    link={link}
                    functions={functions} />
            </Grid>
            <Grid flex={1}
                    sx={{
                        overflowY: 'auto',
                    }}
                    display="flex"
                    paddingTop="2vh"
                    paddingBottom="2vh"
                    alignItems="center">
                {children}
            </Grid>
            <Program
                code={code}
                ind={ind} />
            <Output
                out={out}
                flag={outFlag} />
            <Tape
                tape={tape}
                ptr={ptr}
                flag={tapeFlag} />
            <Register
                acc={acc}
                flag={accFlag} />
        </Grid>
    );
}

function Toolbar({name, functions}) {
    const {
        getRunner,
        handleStop,
        handleFastForward
    } = functions;

    const link = 'https://esolangs.org/wiki/'
        + name.replace(' ', '_');

    return [
        <CustomButton
            key='Run'
            title='Run'
            onClick={getRunner('run')}
            Icon={PlayArrowRounded} />,
        <CustomButton
            key='Stop'
            title='Stop'
            onClick={handleStop}
            Icon={StopRounded} />,
        <CustomButton
            key='Previous'
            title='Previous'
            onClick={getRunner('prev')}
            Icon={NavigateBeforeRounded} />,
        <CustomButton
            key='Next'
            title='Next'
            onClick={getRunner('next')}
            Icon={NavigateNextRounded} />,
        <CustomButton
            key='Fast Forward'
            title='Fast Forward'
            onClick={handleFastForward}
            Icon={LastPageRounded} />,
        <CustomButton
            key='Info'
            href={link}
            title='Info'
            Icon={InfoRounded} />,
        <CustomButton
            to="/"
            key='Home'
            title='Home'
            component={Link}
            Icon={HomeRounded} />
    ];
}

function Program({code, ind}) {
    if (code === undefined)
        return (null);

    return (
        <Values
            Icon={CodeRounded}
            title="Program"
            arr={[...code]}
            ptr={ind}>
            <Text
                text={"\xA0"} />
        </Values>
    );
    }

function Tape({
        tape, ptr, flag}) {
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

function Output({out, flag}) {
    if (!flag)
        return (null);

    return (
        <Values
            Icon={TextFieldsRounded}
            title="Output"
            arr={[out]}>
            <Text
                text={'\xA0'} />
        </Values>
    );
}

function Register({acc, flag}) {
    if (!flag)
        return (null);

    return (
        <Values
            Icon={PlusOneRounded}
            title="Register"
            arr={[acc]} />
    );
}

function Values(props) {
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

export function Text(props) {
    return (
        <Typography
                {...props}
                variant='h4'>
            {props.text}
        </Typography>
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

export function GridArea({
        handleChange,
        chooseColor,
        value,
        size
    }) {
    const Wrapper = ({Cell, row, col}) => {
        const pos    = size * row + col;
        const color  = chooseColor(pos);
        const value  = value[pos];

        const text   = `${color}.contrastText`;
        const select = `${color}.light`;
        const hover  = `${color}.main`;

        return (
            <Cell
                color={text}
                backgroundColor={select}
                onClick={handleChange(pos)}
                sx={{
                    cursor: 'pointer',
                    '&:hover': {
                        backgroundColor: hover
                    }
                }}>
                <Text text={value} />
            </Cell>
        );
    };

    return (
        <GenericGrid
            Cell={Wrapper}
            rows={size}
            cols={size} />
    );
}

export function TextArea({handleChange}) {
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
