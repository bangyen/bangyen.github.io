import { Link }   from 'react-router-dom';
import { getDim } from '../helper';
import React      from 'react';

import Editor, {TextEditor, CustomButton} from './Editor';

import {
    NavigateBeforeRounded,
    NavigateNextRounded,
    PlayArrowRounded,
    LastPageRounded,
    HomeRounded,
    StopRounded,
    InfoRounded,
} from '@mui/icons-material';

export default class TextBox extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            ...this.props.start,
            code: '',
            end: true
        };

        this.speed = 200;
        this.change = true;

        this.getState = () => this.state;
        this.handleChange = this.handleChange.bind(this);
        this.getButtons   = this.getButtons.bind(this);
    }

    componentDidMount() {
        document.title = this.props.name
            + ' Interpreter | Bangyen';
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    setTimer(mult = 1) {
        const move = () => {
            this.setState(this.getState());

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

        this.getState = run(value);
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
                temp = this.getState();
            } while (!temp.end);

            this.setState(temp);
        }

        return [
                <CustomButton
                    key='Run'
                    title='Run'
                    onClick={this.runCode('run')}
                    Icon={PlayArrowRounded} />,
                <CustomButton
                    key='Stop'
                    title='Stop'
                    onClick={handleStop}
                    Icon={StopRounded} />,
                <CustomButton
                    key='Previous'
                    title='Previous'
                    onClick={this.runCode('prev')}
                    Icon={NavigateBeforeRounded} />,
                <CustomButton
                    key='Next'
                    title='Next'
                    onClick={this.runCode('next')}
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

    render() {
        return (
            <Editor
                state={this.state}
                props={this.props}
                getButtons={this.getButtons}>
                <TextEditor
                    handleChange={this.handleChange} />
            </Editor>
        );
    }
}