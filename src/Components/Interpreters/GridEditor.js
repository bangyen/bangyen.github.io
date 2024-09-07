import { useState, useEffect, useRef } from 'react';

import Editor, { GridArea } from './Editor';
import { useTimer } from '../hooks';

export default function Grid(props) {
    const {
        clean, tape,
        name,  link,
        start, run,
        out,   acc,
    } = props;

    const [values, setValues] = useState(start);
    const [size, setSize] = useState(5);
    const [code, setCode] = useState(' '.repeat(size * size));
    const [select, setSelect] = useState(null);
    const [pos, setPos] = useState(null);
    const [breaks, setBreaks] = useState([]);
    const [text, setText] = useState(false);
    const [edit, setEdit] = useState(false);
    const {setRepeat} = useTimer(200);

    useEffect(() => {
        document.title = name 
            + ' Interpreter | Bangyen';
    }, []);

    return (
        <Editor
            state={this.state}
            props={this.props}
            getButtons={this.getButtons}
            handleChange={() => {}}>
            <GridArea
                value={this.state.grid}
                size={this.state.size}
                handleChange={this.changeColor} />
        </Editor>
    );
}