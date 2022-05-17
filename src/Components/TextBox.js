import {Link} from 'react-router-dom';
import React from 'react';

export default class Grid extends React.Component {
    constructor(props: Props) {
        super(props);

        this.state = {
            value: '',
            tape: [0],
            acc: 0,
            ind: 0,
            ptr: 0,
            out: '',
            end: true
        };

        this.func = () => this.state;
        this.handleChange = this.handleChange.bind(this);
        this.handlePaste = this.handlePaste.bind(this);
    }

    componentDidMount() {
        document.title = 'Interpreter';
    }

    handleChange(event) {
        let val = event.target.value;

        if (val !== this.state.value) {
            this.setState({value: val});
            this.func = this.props.run(val);
        }
    }

    handlePaste(event) {
        this.handleChange(event);
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
                            (<a href={"https://esolangs.org/wiki/" + name}>
                                Commands
                            </a>)
                        </code>
                        <br />
                        <br />
                        <form onSubmit={this.handleSubmit}>
                            <label>
                                <textarea
                                    value={this.state.value}
                                    onChange={this.handleChange}
                                    onPaste={this.handlePaste}
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
                        <code>
                            Output: {this.state.out}
                        </code>
                        <br />
                        <code>
                            Accumulator: {this.state.acc}
                        </code>
                        <br />
                        <br />
                        <div className='output'>
                            <code>&nbsp;</code>
                                {this.state.tape.map((val, ind) => {
                                    let color = this.state.ptr === ind
                                        ? 'red' : 'white';
                                    return <code
                                            key={ind.toString()}
                                            style={{color: color}}>
                                        {val}&nbsp;
                            </code>;})}
                        </div>
                    </div>
                </div>

            </header>
        );
    }
}