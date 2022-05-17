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
            end: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handlePaste = this.handlePaste.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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

    handleSubmit(event) {
        if (this.state.value !== '')
            this.setState(this.func());
    }

    render() {
        let arr = this.state.value.split('\n');
        let row = arr.length;
        let col = Math.max(...arr.map(val => val.length));

        if (row < 3)
            row = 12;
        if (col < 30)
            col = 60;

        return (
            <header className='App-header'>
                <code>
                    Suffolk
                    (<a href="https://esolangs.org/wiki/Suffolk">
                        Commands
                    </a>)
                </code>
                &nbsp;
                <form onSubmit={this.handleSubmit}>
                    <label>
                        <textarea
                            value={this.state.value}
                            onChange={this.handleChange}
                            onPaste={this.handlePaste}
                            rows={row} cols={col} />
                    </label>
                    <center>
                        <input type="submit" value="Next" />
                    </center>
                </form>
                &nbsp;
                <code>
                    Output: {this.state.out}
                </code>
                <code>
                    Accumulator: {this.state.acc}
                </code>
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
            </header>
        );
    }
}