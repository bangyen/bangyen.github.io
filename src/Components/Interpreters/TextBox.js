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
            end: true,
            anchor: null,
            stack: getDim()
        };

        this.speed = 200;
        this.change = true;

        this.func = () => this.state;
        this.handleChange = this.handleChange.bind(this);
        this.getButtons = this.getButtons.bind(this);
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