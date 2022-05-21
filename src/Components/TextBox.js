import {button, home, resize} from './helper';
import React from 'react';

export default class Grid extends React.Component {
    constructor(props: Props) {
        super(props);

        this.state = {
            ...this.props.start,
            value: '',
            code: '',
            reset: true,
            end: true
        };

        this.func = () => this.state;
        this.handleChange
            = this.handleChange.bind(this);
    }

    componentDidMount() {
        document.title = this.props.name
            + ' Interpreter | Bangyen';
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
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

    render() {
        let {name, link} = this.props;
        link = 'https://esolangs.org/wiki/'
            + (link ? link : name);

        const [row, col]
            = resize(this.state.value);

        return (
            <header className='App-header'>
                <div className='split left'>
                    <div className='centered'>
                        <code>
                            {name}
                        </code>
                        <ul style={{
                                fontSize: '75%',
                                textAlign: 'left'}}>
                            <li>Hover over buttons for usage</li>
                            <li>
                                Commands located&nbsp;
                                <a href={link}>here</a>
                            </li>
                        </ul>
                        <form>
                            <label>
                                <textarea
                                    value={this.state.value}
                                    onChange={this.handleChange}
                                    onPaste={this.handleChange}
                                    rows={row} cols={col} />
                            </label>
                        </form>
                        {button('▶', this.runCode('run'), 'Run')}
                        {button('❮', this.runCode('prev'), 'Previous')}
                        {button('❯', this.runCode('next'), 'Next')}
                        {button('✖', () => {
                            clearInterval(this.timerID);
                            this.setState({
                                ...this.props.start,
                                reset: true,
                                end: true
                            });
                        }, 'Stop')}
                        {home()}
                    </div>
                </div>
                <div className='split right'>
                    <div className='centered'>
                        {this.getProgram()}
                        {this.getTape()}
                        {this.getOutput()}
                        {this.getRegister()}
                    </div>
                </div>

            </header>
        );
    }
}