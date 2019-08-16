import React from 'react';
import { drawAxis } from '../utils/drawGraphutils.js'

import './LineGraph.scss';

const CANVAS_WIDTH = '900';
const CANVAS_HEIGHT = '500';

class LineGraph extends React.Component {
    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();
    }

    componentDidMount = () => {
        const ctx = this.canvasRef.current.getContext('2d');
        drawAxis(ctx, CANVAS_WIDTH, CANVAS_HEIGHT, false);
        drawAxis(ctx, CANVAS_WIDTH, CANVAS_HEIGHT, true);
    }

    componentDidUpdate = ({prevData}) => {
        if(prevData !== this.props.data) {
            const ctx = this.canvasRef.current.getContext('2d');
            drawAxis(ctx, 900, 500, false);
        }
    }
    
    render() {
        return (
            <div className='LineGraph'>
                <canvas ref={this.canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT}/>
            </div>
        )
    }
}

export default LineGraph;
