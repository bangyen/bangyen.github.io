import {Link} from 'react-router-dom';
import {button} from './helper';
import React from 'react';

export default class Grid extends React.Component {
    constructor(props: Props) {
        super(props);

        this.state = {
            ...this.props.start,
            value: '',
            code: '',
            end: true
        };

        this.func = () => this.state;
        this.handleChange
            = this.handleChange.bind(this);
    }

    componentDidMount() {
        document.title = 'Interpreter';
    }

    runCode(mode) {
        return function() {
            let state;

            if (mode === 'run')
                do {
                    state = this.func();
                } while (!state.end);
            else if (mode === 'prev')
                state = this.func(true);
            else
                state = this.func();

            this.setState(state);
        }.bind(this);
    }

    handleChange(event) {
        const val = event.target.value;

        if (val !== this.state.value) {
            const {run, code}
                = this.props.run(val);

            this.func = run;
            this.setState({
                ...this.props.start,
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
        const {name, link} = this.props;
        const arr = this.state.value.split('\n');
        let col = Math.max(...arr.map(val => val.length));
        let row = arr.length;

        if (row < 3)
            row = 12;
        if (col < 30)
            col = 60;

        return (
            <header className='App-header'>
                <div className='split left'>
                    <div className='centered'>
                        <code>
                            {name + ' '}
                            (<a href={'https://esolangs.org/wiki/'
                                    + (link ? link : name)}>
                                Commands
                            </a>)
                        </code>
                        <br /><br />
                        <form onSubmit={this.handleSubmit}>
                            <label>
                                <textarea
                                    value={this.state.value}
                                    onChange={this.handleChange}
                                    onPaste={this.handleChange}
                                    rows={row} cols={col} />
                            </label>
                        </form>
                        {button('▶', this.runCode('run'))}
                        {button('\xa0❮\xa0', this.runCode('prev'))}
                        {button('\xa0❯\xa0', this.runCode('next'))}
                        <Link to='/'>
                            <button className='custom'
                                    type='button'>
                                🏠&#xfe0e;
                            </button>
                        </Link>
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