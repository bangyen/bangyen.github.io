import {
    getDim, button,
    home, resize
} from './helper';
import React from 'react';

export default class Grid extends React.Component {
    constructor(props: Props) {
        super(props);

        this.state = {
            ...this.props.start,
            value: '',
            code: '',
            reset: true,
            end: true,
            stack: getDim()
        };

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

    runCode(mode) {
        return function() {
            const {value, reset, end} = this.state;
            const {start, run} = this.props;

            if (end) {
                this.func = run(value);
                this.setState(start);

                if (mode !== 'run' && !reset)
                    return;
            }

            clearInterval(this.timerID);
            let state;

            if (mode === 'run') {
                const move = () => {
                    this.setState(this.func());

                    if (this.state.end)
                        clearInterval(this.timerID);
                };

                this.timerID = setInterval(move, 200);
            } else if (mode === 'prev') {
                state = this.func(true);
            } else {
                state = this.func();
            }

            this.setState({
                reset: false,
                ...state
            });
        }.bind(this);
    }

    handleChange(event) {
        const val = event.target.value;

        if (val !== this.state.value) {
            const code
                = this.props.clean(val);

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
        let {name, link} = this.props;
        link = 'https://esolangs.org/wiki/'
            + (link ? link : name);

        const [row, col]
            = resize(this.state.value);

        return (
            <div style={{fontSize:
                    `calc(${css} / 12)`}}>
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
                            value={this.state.value}
                            onChange={this.handleChange}
                            onPaste={this.handleChange}
                            rows={row} cols={col}
                            style={{
                                minWidth: css,
                                minHeight: `calc(${css} / 3)`
                            }}
                        />
                    </label>
                </form>
                {button('▶\ufe0e', 'Run', this.runCode('run'))}
                {button('❮', 'Previous', this.runCode('prev'))}
                {button('❯', 'Next', this.runCode('next'))}
                {button('✖', 'Stop', () => {
                    clearInterval(this.timerID);
                    this.setState({
                        ...this.props.start,
                        reset: true,
                        end: true
                    });
                })}
                {home()}
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
            return <header className='App-header'>
                <div className='centered'>
                    {this.getLeft(val)}
                    <br />
                    {right}
                </div>
            </header>;

        return (
            <header className='App-header'>
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