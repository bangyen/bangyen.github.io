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

export default class Grid extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            ...this.props.start,
            value: '',
            code: '',
            end: true,
            stack: getDim()
        };

        this.speed = 200;
        this.change = true;

        this.func = () => this.state;
        this.handleChange
            = this.handleChange.bind(this);
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
                ? 'red' : 'white';
            return <code key={ind.toString()}
                         style={{color}}>
                    {val}
                </code>;});
        let text = 'Program:';

        if (prog.length)
            text += ' ';

        return <div className='output'>
                <code>
                    {text}{prog}
                </code>
            </div>;
    }

    getTape() {
        if (!this.props.tape)
            return (null);

        const tape = this.state.tape;
        const text = tape.map((val, ind) => {
            const color = this.state.ptr === ind
                ? 'red' : 'white';
            return <code key={ind.toString()}
                         style={{color}}>
                    &nbsp;{val}
                </code>;});

        return <div className='output'>
                <code>
                    Tape:{text}
                </code>
            </div>;
    }

    getOutput() {
        if (this.props.out)
            return <div className='output'>
                    <code>
                        Output:
                        {this.state.out === ''
                            ? '' : ' '}
                        {this.state.out}
                    </code>
                </div>;

        return (null);
    }

    getRegister() {
        if (this.props.reg)
            return <div className='output'>
                    <code>
                        Register: {this.state.acc}
                    </code>
                </div>;

        return (null);
    }

    getLeft(css) {
        const {value} = this.state;
        let {name, link} = this.props;
        link = 'https://esolangs.org/wiki/'
            + (link ? link : name);

        const row = value.split('\n')
                         .length;

        return (
            <div style={{
                    fontSize:
                        `calc(${css} / 12)`
                }}>
                <code>
                    {name}
                </code>
                <ul style={{
                        fontSize: '75%',
                        margin: 'auto',
                        padding: '3vh',
                        textAlign: 'left'
                    }}>
                    <code>
                        <li>Hover over buttons for usage</li>
                        <li>
                            Commands located&nbsp;
                            <a href={link}>here</a>
                        </li>
                    </code>
                </ul>
                <form>
                    <label>
                        <textarea
                            value={value}
                            onChange={this.handleChange}
                            onPaste={this.handleChange}
                            rows={row}
                            style={{
                                width: css,
                                minHeight: `calc(${css} / 3)`,
                                maxHeight: '50vh'
                            }}
                        />
                    </label>
                </form>
                <div style={{paddingTop: '1vh'}}>
                    {button(BsCaretRight, 'Run', this.runCode('run'))}
                    {button(BsArrowLeft, 'Previous', this.runCode('prev'))}
                    {button(BsArrowRight, 'Next', this.runCode('next'))}
                    {button(BsStop, 'Stop', () => {
                        clearInterval(this.timerID);
                        this.getFunc();
                    })}
                    <br />
                    {button(BsSkipEnd, 'Fast Forward', () => {
                        if (this.change)
                            this.getFunc();

                        clearInterval(this.timerID);
                        let temp;

                        do {
                            temp = this.func();
                        } while (!temp.end);

                        this.setState(temp);
                    })}
                    {button(BsSkipBackward, 'Decelerate',
                        () => this.setTimer(1.5))}
                    {button(BsSkipForward, 'Accelerate',
                        () => this.setTimer(1 / 1.5))}
                    {home()}
                </div>
            </div>
        );
    }

    render() {
        const {stack} = this.state;
        const val = stack
            ? 'var(--stack)'
            : 'var(--table-size)';

        const right = <div style={{
                fontSize: `calc(${val} / 12)`}}>
            {this.getProgram()}
            {this.getTape()}
            {this.getOutput()}
            {this.getRegister()}
        </div>;

        if (stack)
            return <header className='app'>
                <div className='centered'>
                    {this.getLeft(val)}
                    <br />
                    {right}
                </div>
            </header>;

        return (
            <header className='app'>
                <div className='split left'>
                    <div className='centered'>
                        {this.getLeft(val)}
                    </div>
                </div>
                <div className='split right'>
                    <div className='centered'>
                        {right}
                    </div>
                </div>
            </header>
        );
    }
}