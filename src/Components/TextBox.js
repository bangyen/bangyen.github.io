import {Link} from 'react-router-dom';
import React from 'react';

export default class Grid extends React.Component {
    constructor(props: Props) {
        super(props);

        this.state = {
            value: '',
            tape: [0],
            code: '',
            acc: 0,
            ind: 0,
            ptr: 0,
            out: '',
            end: true
        };

        this.func = () => this.state;
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        document.title = 'Interpreter';
    }

    handleChange(event) {
        let val = event.target.value;
        let code = '';

        if (val !== this.state.value) {
            for (let c of val)
                if ('><!,.'.includes(c))
                    code += c;

            this.setState({
                value: val,
                code: code
            });

            this.func = this.props.run(code);
            this.setState({
                tape: [0],
                acc: 0,
                ind: 0,
                ptr: 0,
                out: '',
                end: false
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

        return <code>{text}{prog}</code>;
    }

    getTape() {
        let tape = this.state.tape;
        let text = tape.map((val, ind) => {
            let color = this.state.ptr === ind
                ? 'red' : 'white';
            return <code key={ind.toString()}
                         style={{color: color}}>
                    &nbsp;{val}
                </code>;});

        return <code>Tape:{text}</code>;
    }

    render() {
        let name = this.props.name;
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
                            (<a href={'https://esolangs.org/wiki/' + name}>
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
                        <div className='output'>
                            {this.getProgram()}
                        </div>
                        <div className='output'>
                            {this.getTape()}
                        </div>
                        <div className='output'>
                            <code>
                                Output:
                                {this.state.out == ''
                                    ? '' : ' '}
                                {this.state.out}
                            </code>
                        </div>
                        <div className='output'>
                            <code>
                                Register: {this.state.acc}
                            </code>
                        </div>
                    </div>
                </div>

            </header>
        );
    }
}