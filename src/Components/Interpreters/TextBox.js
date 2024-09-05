import Grid       from '@mui/material/Grid2';
import { Link }   from 'react-router-dom';
import { getDim } from '../helper';
import React      from 'react';

import {
    CustomButton,
    Monospace,
    Scrollable,
    TextEditor
} from './Editor';


import {
    Typography,
    Tooltip
} from '@mui/material';

import NavigateBeforeRoundedIcon from '@mui/icons-material/NavigateBeforeRounded';
import NavigateNextRoundedIcon   from '@mui/icons-material/NavigateNextRounded';
import TextFieldsRoundedIcon     from '@mui/icons-material/TextFieldsRounded';
import PlayArrowRoundedIcon      from '@mui/icons-material/PlayArrowRounded';
import DataArrayRoundedIcon      from '@mui/icons-material/DataArrayRounded';
import LastPageRoundedIcon       from '@mui/icons-material/LastPageRounded';
import PlusOneRoundedIcon        from '@mui/icons-material/PlusOneRounded';
import HomeRoundedIcon           from '@mui/icons-material/HomeRounded';
import StopRoundedIcon           from '@mui/icons-material/StopRounded';
import InfoRoundedIcon           from '@mui/icons-material/InfoRounded';
import CodeRoundedIcon           from '@mui/icons-material/CodeRounded';

export default class TextBox extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            ...this.props.start,
            code: '',
            end: true,
            anchor: null,
            stack: getDim()
        };

        this.speed = 200;
        this.change = true;

        this.func = () => this.state;
        this.handleChange = this.handleChange.bind(this);
        this.stack = () => {
            const stack = getDim();
            this.setState({stack});
        };
    }

    componentDidMount() {
        document.title = this.props.name
            + ' Interpreter | Bangyen';
        window.addEventListener(
            'resize', this.stack);
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
        window.removeEventListener(
            'resize', this.stack);
    }

    setTimer(mult = 1) {
        const move = () => {
            this.setState(this.func());

            if (this.state.end)
                clearInterval(this.timerID);
        };

        this.speed *= mult;
        clearInterval(this.timerID);
        this.timerID = setInterval(move, this.speed);
    }

    getFunc() {
        const {value} = this.state;
        const {start, run} = this.props;

        this.func = run(value);
        this.setState(start);
        this.change = false;
    }

    runCode(mode) {
        return function() {
            if (this.change) {
                this.getFunc();
            }

            clearInterval(this.timerID);
            let state;

            if (mode === 'run') {
                this.speed = 200;
                this.setTimer();
            } else if (mode === 'prev') {
                state = this.func(true);
            } else {
                state = this.func();
            }

            this.setState(state);
        }.bind(this);
    }

    handleChange(event) {
        const val = event.target.value;

        if (val !== this.state.value) {
            const code
                = this.props.clean(val);
            this.change = true;

            this.setState({
                ...this.props.start,
                end: true,
                value: val,
                code
            });
        }
    }

    getProgram() {
        const code = this.state.code;
        const prog = [...code].map((val, ind) => {
            const color = this.state.ind === ind
                ? 'info' : 'inherit';
            return (
                <Monospace
                    text={val}
                    key={'prog' + ind}
                    color={color} />
            );
        });

        return (
            <Scrollable>
                <Tooltip title="Program">
                    <CodeRoundedIcon />
                </Tooltip>
                {prog}
                <Monospace text={"\xA0"} />
            </Scrollable>
        );
    }

    getTape() {
        if (!this.props.tape)
            return (null);

        const tape = this.state.tape;
        const text = tape.map((val, ind) => {
            const color = this.state.ptr === ind
                ? 'info' : 'inherit';
            return (
                <Monospace
                    text={val}
                    key={'prog' + ind}
                    color={color} />
            );
        });

        return (
            <Scrollable>
                <Tooltip title="Tape">
                    <DataArrayRoundedIcon />
                </Tooltip>
                {text}
            </Scrollable>
        );
    }

    getOutput() {
        if (!this.props.out)
            return (null);

        return (
            <Scrollable>
                <Tooltip title="Output">
                    <TextFieldsRoundedIcon />
                </Tooltip>
                <Monospace
                    text={this.state.out + '\xA0'} />
            </Scrollable>
        );
    }

    getRegister() {
        if (!this.props.reg)
            return (null);

        return (
            <Scrollable>
                <Tooltip title="Register">
                    <PlusOneRoundedIcon />
                </Tooltip>
                <Monospace
                    text={this.state.acc} />
            </Scrollable>
        );
    }

    getButtons() {
        let {name, link} = this.props;
        link = 'https://esolangs.org/wiki/'
            + (link ? link : name);

        const handleStop = () => {
            clearInterval(this.timerID);
            this.getFunc();
        }

        const handleFastForward = () => {
            if (this.change)
                this.getFunc();

            clearInterval(this.timerID);
            let temp;

            do {
                temp = this.func();
            } while (!temp.end);

            this.setState(temp);
        }

        return [
                <CustomButton
                    key='Run'
                    title='Run'
                    onClick={this.runCode('run')}
                    Icon={PlayArrowRoundedIcon} />,
                <CustomButton
                    key='Stop'
                    title='Stop'
                    onClick={handleStop}
                    Icon={StopRoundedIcon} />,
                <CustomButton
                    key='Previous'
                    title='Previous'
                    onClick={this.runCode('prev')}
                    Icon={NavigateBeforeRoundedIcon} />,
                <CustomButton
                    key='Next'
                    title='Next'
                    onClick={this.runCode('next')}
                    Icon={NavigateNextRoundedIcon} />,
                <CustomButton
                    key='Fast Forward'
                    title='Fast Forward'
                    onClick={handleFastForward}
                    Icon={LastPageRoundedIcon} />,
                <CustomButton
                    key='Info'
                    href={link}
                    title='Info'
                    Icon={InfoRoundedIcon} />,
                <CustomButton
                    to="/"
                    key='Home'
                    title='Home'
                    component={Link}
                    Icon={HomeRoundedIcon} />
        ];
    }

    render() {
        const {value} = this.state;

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
                    <Grid size="grow" sx={{display: {xs: 'none', md: 'block'}}}>
                        <Typography
                            variant="h2">
                            {this.props.name}
                        </Typography>
                    </Grid>
                    {this.getButtons()}
                </Grid>
                <Grid flex={1}
                        paddingTop="2vh"
                        paddingBottom="2vh">
                    <TextEditor
                        value={value}
                        handleChange={this.handleChange} />
                </Grid>
                {this.getProgram()}
                {this.getOutput()}
                {this.getTape()}
                {this.getRegister()}
            </Grid>
        );
    }
}