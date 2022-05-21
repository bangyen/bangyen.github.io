import {
    button, home,
    resize, move
} from './helper';
import React from 'react';

export default class Grid extends React.Component {
    constructor(props: Props) {
        super(props);

        this.changeColor = this.changeColor.bind(this);
        this.changeText = this.changeText.bind(this);
        this.changeSize = this.changeSize.bind(this);
        this.message = 'Input program here...';
        const size = 5;

        this.state = {
            ...this.props.start,
            grid: ' '.repeat(size * size),
            size,
            select: null,
            pos:    null,
            breaks: [],
            text: false,
            edit: false
        };
    }

    componentDidMount() {
        document.title = this.props.name
            + ' Interpreter | Bangyen';
        document.addEventListener(
            'keydown',
            this.changeText,
            false);
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
        document.removeEventListener(
            'keydown',
            this.changeText,
            false);
    }

    runCode(mode) {
        return function() {
            if (this.state.edit) {
                this.clean();
                return;
            } else if (this.state.text) {
                this.setState({text: false});
                return;
            }

            if (this.state.pos === null) {
                const {grid, size} = this.state;
                const {run, start} = this.props;
                this.func = run(grid, size);

                this.setState({
                    ...start,
                    select: null,
                });

                if (mode !== 'run')
                    return;
            }

            clearInterval(this.timerID);
            let temp;

            if (mode === 'run') {
                const move = () => {
                    this.setState(this.func());
                    const {pos, end, breaks}
                        = this.state;

                    if (breaks.includes(pos) || end)
                        clearInterval(this.timerID);
                };

                this.timerID = setInterval(move, 200);
            } else if (mode === 'next') {
                temp = this.func();
            } else {
                temp = this.func(true);
            }

            this.setState(temp);
        }.bind(this);
    }

    changeText(e) {
        let {select, breaks, text} = this.state;

        if (select !== null && !text) {
            let str = this.state.grid;
            const size = str.length;
            let value;

            if (e.key.toLowerCase() === 'b') {
                if (breaks.includes(select))
                    breaks = breaks.filter(p =>
                        p !== select);
                else
                    breaks.push(select);

                this.setState({breaks});
                return;
            } else if (e.key.length === 1) {
                value = e.key;
            } else if (e.key === 'Backspace'
                    || e.key === 'Delete') {
                value = ' ';
            } else if (e.key.includes('Arrow')) {
                let vel;

                if (e.key.includes('Left'))
                    vel = [0, -1];
                else if (e.key.includes('Right'))
                    vel = [0, 1];
                else if (e.key.includes('Up'))
                    vel = [-1, 0];
                else if (e.key.includes('Down'))
                    vel = [1, 0];

                select = move({
                    pos: select,
                    old: size,
                    vel
                });

                this.setState({select});
                return;
            } else {
                return;
            }

            str = str.substring(0, select)
                + value
                + str.substring(select + 1);
            this.setState({grid: str});
        }
    }

    changeColor(pos) {
        return function() {
            let select = this.state.select;
            select = select === pos
                ? null : pos;
            this.setState({select});
        }.bind(this);
    }

    chooseColor(cell) {
        const {select, pos, breaks}
            = this.state;

        if (cell === select)
            return 'grey';
        else if (cell === pos)
            return 'red';
        else if (breaks.includes(cell))
            return 'yellow';

        return 'white';
    }

    clean() {
        const {grid, size} = this.state;
        let val = grid
            .split('\n')
            .map(v => v.trimEnd())
            .filter(v => v !== '');

        if (!val.length || val[0] === this.message)
            val = Array(size).fill(' '.repeat(size));

        const max = Math.max(val.length,
            ...val.map(v => v.length));

        while (val.length < max)
            val.push('');

        val = val.map(v => {
            const len = v.length;

            if (len < max)
                v += ' '.repeat(max - len);
            else
                v = v.substring(0, max);

            return v;
        });

        this.setState({
            ...this.props.start,
            grid: val.join(''),
            size: max,
            pos: null,
            select: null,
            text: false,
            edit: false
        });
    }

    getTable() {
        const {grid, size, edit} = this.state;

        if (this.state.text) {
            let value = '';

            if (edit) {
                value = grid;
            } else {
                if (grid === ' '.repeat(size * size)) {
                    value = this.message;
                } else {
                    const empty = ' '.repeat(size);
                    const split = [...Array(size).keys()]
                        .map(v => grid.substring(
                            size * v, size * (v + 1)))
                        .filter(v => v !== empty);
                    const len = split.length;

                    for (let i = 0; i < len; i++) {
                        value += split[i].trimEnd();

                        if (i + 1 !== len)
                            value += '\n';
                    }
                }
            }

            const [row, col]
                = resize(value);
            const changeGrid = (e) =>
                this.setState({
                    grid: e.target.value,
                    edit: true
                });

            return <form>
                <label>
                    <textarea
                        value={value}
                        onChange={changeGrid}
                        onPaste={changeGrid}
                        rows={row} cols={col} />
                </label>
            </form>;
        }

        let table = [...Array(size)]
            .map(x => Array(size));
        let pos;

        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                pos = size * i + j;
                table[i][j] = <td key={`${pos}`}
                        className='cell select'
                        onClick={this.changeColor(pos)}
                        bgcolor={this.chooseColor(pos)}>
                    <div>
                        &nbsp;{grid[pos]}&nbsp;
                    </div>
                </td>;
            }
        }

        return <table className='grid'>
            <tbody>
                {table.map((arr, row) =>
                    <tr key={row.toString()}>
                        {arr}
                    </tr>
                )}
            </tbody>
        </table>;
    }

    getInfo() {
        let {name, link} = this.props;
        link = 'https://esolangs.org/wiki/'
            + (link ? link : name);

        return <ul style={{
                    fontSize: '75%',
                    textAlign: 'left'}}>
                <li>Click to select/unselect</li>
                <li>Type to change selected cell</li>
                <li>Press (b) to use breakpoints</li>
                <li>Hover over buttons for usage</li>
                <li>
                    {name} commands located&nbsp;
                    <a href={link}>here</a>
                </li>
            </ul>;
    }

    changeSize(num) {
        let {
            grid, size,
            select, text
        } = this.state;

        return function() {
            if (!num || text)
                return;

            clearInterval(this.timerID);
            let arr = '';

            if (select !== null)
                select = move({
                    pos: select,
                    vel: [0, 0],
                    old: size,
                    size: num,
                    wrap: false
                });

            for (let i = 0; i < num; i++)
                for (let j = 0; j < num; j++)
                    if (i < size && j < size)
                        arr += grid[size * i + j];
                    else
                        arr += ' ';

            this.setState({
                ...this.props.start,
                grid: arr,
                size: num,
                pos: null,
                select
            });
        }.bind(this);
    }

    getButtons() {
        const {size, text, edit} = this.state;

        return (<div>
                {button('▶', this.runCode('run'), 'Run')}
                {button('❮', this.runCode('prev'), 'Previous')}
                {button('❯', this.runCode('next'), 'Next')}
                {button('✖', () => {
                    if (this.state.text)
                        return;

                    clearInterval(this.timerID);
                    this.setState({
                        ...this.props.start,
                        pos: null
                    });
                }, 'Stop')}
                <br />
                {button('➕\ufe0e', this.changeSize(size + 1), 'Expand')}
                {button('➖\ufe0e', this.changeSize(size - 1), 'Shrink')}
                {button('📥\ufe0e',
                    () => {
                        clearInterval(this.timerID);

                        if (edit)
                            this.clean();
                        else
                            this.setState({
                                select: null,
                                text: !text
                    })}, 'Copy/Paste')}
                {home()}
            </div>);
    }

    getTape() {
        if (!this.props.tape)
            return (null);

        const tape = this.state.tape;
        const text = tape.map((val, ind) => {
            const color = this.state.cell === ind
                ? 'red' : 'white';
            return <code key={ind.toString()}
                         style={{color}}>
                    &nbsp;{val}
                </code>;
        });

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
        return (
            <header className='App-header'>
                <div className='split left'>
                    <div className='centered'>
                        {this.getTable()}
                    </div>
                </div>
                <div className='split right'>
                    <div className='centered'>
                        <code>Instructions:</code>
                        {this.getInfo()}
                        {this.getButtons()}
                        <br />
                        {this.getTape()}
                        {this.getOutput()}
                        {this.getRegister()}
                    </div>
                </div>
            </header>
        );
    }
}