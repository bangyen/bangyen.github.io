import {getDim, button, home} from '../helper';
import React from 'react';
import {
    BsCaretRight,
    BsArrowLeft,
    BsArrowRight,
    BsSkipEnd,
    BsStop,
    BsSkipBackward,
    BsSkipForward
} from 'react-icons/bs';
import { Link } from 'react-router-dom';

import { TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';

import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import StopRoundedIcon from '@mui/icons-material/StopRounded';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import NavigateBeforeRoundedIcon from '@mui/icons-material/NavigateBeforeRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import LastPageRoundedIcon from '@mui/icons-material/LastPageRounded';
import DataArrayRoundedIcon from '@mui/icons-material/DataArrayRounded';
import CodeRoundedIcon from '@mui/icons-material/CodeRounded';
import PlusOneRoundedIcon from '@mui/icons-material/PlusOneRounded';
import TextFieldsRoundedIcon from '@mui/icons-material/TextFieldsRounded';

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
                <Typography
                        variant='h4'
                        key={'prog' + ind}
                        color={color}
                        sx={{fontFamily: 'monospace'}}>
                    {val}
                </Typography>
            );
        });

        return (
            <Grid container
                  direction="row"
                  alignItems="center"
                  spacing={4}
                  sx={{
                      width: '100%',
                      overflow: 'auto',
                      flexWrap: 'nowrap'
                  }}>
                <CodeRoundedIcon />
                {prog}
                <Typography variant='h4'>
                    &nbsp;
                </Typography>
            </Grid>
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
                <Typography
                        key={'tape' + ind}
                        color={color}
                        fontFamily='monospace'
                        variant="h4">
                    {val}
                </Typography>
            );
        });

        return (
                <Grid container
                  direction="row"
                  alignItems="center"
                  justifyContent="flex-start"
                  spacing={4}
                  sx={{
                        width: '100%',
                        overflowX: 'auto',
                        flexWrap: 'nowrap'
                    }}>
                    <DataArrayRoundedIcon />
                    {text}
                </Grid>
        );
    }

    getOutput() {
        if (!this.props.out)
            return (null);

        return (
                <Grid container
                      direction="row"
                      alignItems="center"
                      spacing={4}
                      sx={{
                          width: '100%',
                          overflow: 'auto',
                          flexWrap: 'nowrap'
                      }}>
                    <TextFieldsRoundedIcon />
                    <Typography sx={{fontFamily: 'monospace'}} variant="h4">
                        {this.state.out}
                    </Typography>
                    <Typography variant='h4'>
                        &nbsp;
                    </Typography>
                </Grid>
        );
    }

    getRegister() {
        if (!this.props.reg)
            return (null);

        return (
                <Grid container
                      direction="row"
                      alignItems="center"
                      spacing={4}
                      sx={{
                          width: '100%',
                          overflow: 'auto',
                          flexWrap: 'nowrap'
                      }}>
                    <PlusOneRoundedIcon />
                    <Typography sx={{fontFamily: 'monospace'}} variant="h4">
                        {this.state.acc}
                    </Typography>
                </Grid>
        );
    }

    getButtons() {
        let {name, link} = this.props;
        link = 'https://esolangs.org/wiki/'
            + (link ? link : name);

        const CustomButton = (props) => {
            return (
                <IconButton
                        {...props}
                        size='large'>
                    <props.icon fontSize='inherit' />
                </IconButton>
            );
        }

        const handleStop = () => {
            clearInterval(this.timerID);
            this.getFunc();
        }

        const handleLast = () => {
            if (this.change)
                this.getFunc();

            clearInterval(this.timerID);
            let temp;

            do {
                temp = this.func();
            } while (!temp.end);

            this.setState(temp);
        }

        return (
            <Box>
                <CustomButton
                    onClick={this.runCode('run')}
                    icon={PlayArrowRoundedIcon} />
                <CustomButton
                    onClick={handleStop}
                    icon={StopRoundedIcon} />
                <CustomButton
                    onClick={this.runCode('prev')}
                    icon={NavigateBeforeRoundedIcon} />
                <CustomButton
                    onClick={this.runCode('next')}
                    icon={NavigateNextRoundedIcon} />
                <CustomButton
                    onClick={handleLast}
                    icon={LastPageRoundedIcon} />
                <CustomButton
                    href={link}
                    icon={InfoRoundedIcon} />
                <CustomButton
                    to="/"
                    component={Link}
                    icon={HomeRoundedIcon} />
            </Box>
        );
    }

    getTextField() {
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
                value={this.state.value}
                onChange={this.handleChange}
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

    render() {
        return (
            <Grid container
                    height="100%"
                    spacing={4}
                    paddingTop="5vh"
                    paddingBottom="5vh"
                    paddingLeft="5vw"
                    paddingRight="5vw">
                <Grid container
                        item
                        size={12}
                        justifyContent="space-between">
                    <Grid item size="grow">
                        <Typography sx={{fontFamily: 'monospace'}} variant="h2">
                            {this.props.name}
                        </Typography>
                    </Grid>
                    <Grid item size="auto">
                        {this.getButtons()}
                    </Grid>
                </Grid>
                <Grid container
                        item
                        size={12}
                        height={{
                            xs: '60vh',
                            md: '70vh',
                            xl: '80vh'
                        }}>
                    <Grid item size="grow">
                        {this.getTextField()}
                    </Grid>
                    <Grid item width="max(30vw, 20rem)">
                        {this.getProgram()}
                        {this.getOutput()}
                        {this.getTape()}
                        {this.getRegister()}
                    </Grid>
                </Grid>
            </Grid>
        );
    }
}