import {Link} from 'react-router-dom';
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

    handleChange(event) {
        let val = event.target.value;

        if (val !== this.state.value) {
            let {run, code}
                = this.props.run(val);

            this.func = run;
            this.setState({
                ...this.props.start,
                value: val,
                code: code
            });
        }
    }

    getProgram() {
        let code = this.state.code;
        let prog = [...code].map((val, ind) => {
            let color = this.state.ind === ind
                ? 'red' : 'white';
            return <code key={ind.toString()}
                         style={{color: color}}>
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

        let tape = this.state.tape;
        let text = tape.map((val, ind) => {
            let color = this.state.ptr === ind
                ? 'red' : 'white';
            return <code key={ind.toString()}
                         style={{color: color}}>
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
        let arr = this.state.value.split('\n');
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
                        <button className='custom'
                                type='button'
                                onClick={() => {
                                    let temp = {end: false};

                                    do {
                                        temp = this.func();
                                    } while (!temp.end);

                                    this.setState(temp);
                                }}>
                            ▶
                        </button>
                        <button className='custom'
                                type='button'
                                onClick={() => this.setState(
                                    this.func(true))}>
                            &nbsp;❮&nbsp;
                        </button>
                        <button className='custom'
                                type='button'
                                onClick={() => this.setState(
                                    this.func())}>
                            &nbsp;❯&nbsp;
                        </button>
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