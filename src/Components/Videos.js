import {button, home} from './helper';
import React from "react";
import {
    BsArrowLeft,
    BsArrowRight
} from 'react-icons/bs';

function getVideo(embedId, name, width) {
    return <div>
        <iframe
            width={width}
            height={width / 16 * 9}
            src={`https://www.youtube.com/embed/${embedId}`}
            frameBorder="0"
            allowFullScreen
            title={name}
        />
    </div>;
}

export default class Videos extends React.Component {
    constructor(props) {
        super(props);

        this.id = [
            ['Project Glow 2022', 'uoaCbzWmDVk'],
            ['Chicago', 'Ay6w4Fsk8Ec'],
            ['Washington, DC', 'xM4Ttema4cg'],
            ['Firefly 2021', 'nnwVZDGj-SU']
        ];

        this.changeNum
            = this.changeNum.bind(this);
        this.changeWidth
            = this.changeWidth.bind(this);

        this.state = {
            width: this.getWidth(),
            num: 0
        };
    }

    componentDidMount() {
        document.title = 'Videos | Bangyen';
        window.addEventListener(
            'resize', this.changeWidth);
    }

    componentWillUnmount() {
        window.removeEventListener(
            'resize', this.changeWidth);
    }

    getWidth() {
        const height = window.innerHeight;
        let width = window.innerWidth;

        if (1.1 * height > width)
            width = width * 0.9;
        else
            width = width / 2;

        return width;
    }

    changeWidth() {
        const width = this.getWidth();
        this.setState({width});
    }

    changeNum(val) {
        const len = this.id.length;
        const {num} = this.state;
        val = num + val + len;

        return () => {
            this.setState({
                num: val % len
            });
        };
    }

    render() {
        const {num, width} = this.state;
        const [name, id] = this.id[num];

        return (
            <header className='app'>
                <h1 style={{fontSize: 'min(10vh, 8vw)'}}>
                    <center>
                        <code>
                            {name}
                        </code>
                    </center>
                </h1>
                {getVideo(id, name, width)}
                <div style={{paddingTop: '1vh'}}>
                    {button(BsArrowLeft, 'Previous',
                        this.changeNum(-1), true)}
                    {home(true)}
                    {button(BsArrowRight, 'Next',
                        this.changeNum(1), true)}
                </div>
            </header>
        );
    }
}