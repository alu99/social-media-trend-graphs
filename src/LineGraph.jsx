import React from 'react';
import {
    drawAxis,
    drawPoint,
    drawTickmarksOnAxis,
    connectPoints,
} from '../utils/drawGraphutils.js';
import { scaleLinear } from 'd3-scale';
import moment from 'moment';


import './LineGraph.scss';

const LEFT_PADDING = 50;
const RIGHT_PADDING = 135;
const TOP_PADDING = 10;
const BOTTOM_PADDING = 100;

class LineGraph extends React.Component {
    constructor(props) {
        super(props);

        const {
            data,
            width,
            height,
            groupBy,
        } = props;

        this.state = this.createScalesAndPointCoords(data, width, height, groupBy);

        this.canvasRef = React.createRef();
    }

    componentDidMount = () => {
        const {
            pointColor,
            axisColor,
        } = this.props;

        const {
            pointCoords,
            yScale,
            adjustedWidth,
            adjustedHeight,
            topLeft,
            maxOccurences,
            datesBetweenObjs,
        } = this.state;

        this.drawGraph(pointCoords, yScale, adjustedWidth, adjustedHeight, topLeft, maxOccurences, datesBetweenObjs, axisColor, pointColor);
    }

    componentDidUpdate = prevProps => {
        const {
            data,
            groupBy,
            width,
            height,
            axisColor,
            pointColor,
        } = this.props;

        if (prevProps.data !== data || prevProps.groupBy !== groupBy || prevProps.width !== width || prevProps.height !== height) {
            this.setState({ ...this.createScalesAndPointCoords(data, width, height, groupBy) }, () => {
                const {
                    pointCoords,
                    yScale,
                    adjustedWidth,
                    adjustedHeight,
                    topLeft,
                    maxOccurences,
                    datesBetweenObjs,
                } = this.state;
                this.drawGraph(pointCoords, yScale, adjustedWidth, adjustedHeight, topLeft, maxOccurences, datesBetweenObjs, axisColor, pointColor);
            });
        }
    }

    createScalesAndPointCoords = (data, width, height, groupBy) => {
        const groupedData = this.groupDataBy(data, groupBy);
        const groupedDataKeys = Object.keys(groupedData).map(date => moment(date)).sort((a,b) => a < b);
        const firstDate = groupedDataKeys[0];
        const lastDate = groupedDataKeys[groupedDataKeys.length - 1];

        const maxOccurences = this.getMaxOccurences(groupedData);

        const topLeft = { x: LEFT_PADDING, y: TOP_PADDING }
        const adjustedWidth = width - RIGHT_PADDING;
        const adjustedHeight = height - BOTTOM_PADDING;

        const xScale = scaleLinear().domain([lastDate.valueOf(), firstDate.valueOf()]).range([topLeft.x, topLeft.x + adjustedWidth]);
        const yScale = scaleLinear().domain([0, maxOccurences]).range([adjustedHeight + topLeft.y, topLeft.y]); //could also flip topLeft.y and adjustedHeight

        const datesBetween = this.enumerateDatesBetweenMoments(lastDate, firstDate, groupBy);
        const datesBetweenObjs = datesBetween.map(date => ({
            dataKey: date.toISOString(),
            pos: xScale(date.valueOf()),
            label: groupBy === 'days' ? date.format('M/D/YY') : date.format('M/D/YY') + '-' + date.add(1, groupBy).subtract(1, 'days').format('M/D/YY'),
        }));
        const pointCoords = this.calculatePointCoords(groupedData, datesBetweenObjs, yScale);

        return {
            xScale,
            yScale,
            pointCoords,
            adjustedWidth,
            adjustedHeight,
            topLeft,
            maxOccurences,
            datesBetweenObjs,
        };
    }

    drawGraph = (pointCoords, yScale, adjustedWidth, adjustedHeight, topLeft, maxOccurences, datesBetweenObjs, axisColor, pointColor) => {
        const ctx = this.canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, this.props.width, this.props.height);
        ctx.beginPath();

        //maps out y axis tickmark data
        const yAxisIntervalObjs = [];
        for (let i = 0; i <= maxOccurences; i++) {
            yAxisIntervalObjs.push({
                pos: yScale(i),
                label: i.toString(),
            })
        }

        drawAxis(ctx, adjustedWidth, adjustedHeight, false, axisColor, topLeft);
        drawAxis(ctx, adjustedWidth, adjustedHeight, true, axisColor, topLeft);

        let yNthLabel = 1;
        let xNthLabel = 1;
        if(maxOccurences > 50) {
            yNthLabel = 10;
        }
        if(datesBetweenObjs.length > 50) {
            xNthLabel = 7;
        }
        drawTickmarksOnAxis(ctx, datesBetweenObjs, 'x', topLeft.y + adjustedHeight, axisColor, xNthLabel);
        drawTickmarksOnAxis(ctx, yAxisIntervalObjs, 'y', topLeft.x, axisColor, yNthLabel);

        pointCoords.forEach(coord => {
            drawPoint(ctx, coord.x, coord.y, pointColor, 3);
        });
        connectPoints(ctx, pointCoords, pointColor);
    }

    enumerateDatesBetweenMoments = (start, end, interval) => {
        let currDate = start;
        const datesBetween = [currDate.clone()];
        if(currDate.diff(end) === 0) {
            return datesBetween;
        }
        while (currDate.add(1, interval).diff(end) < 0) {
            datesBetween.push(currDate.clone());
        };
        datesBetween.push(currDate);
        return datesBetween;
    }

    getMaxOccurences = groupedData => {
        let max = -Infinity;
        const groupedDataKeys = Object.keys(groupedData);
        groupedDataKeys.forEach(key => {
            max = Math.max(groupedData[key].length, max);
        });
        return max;
    }

    calculatePointCoords = (groupedData, datesBetweenObjs, yScale) => {
        const pointCoords = [];
        datesBetweenObjs.forEach(dateInterval => {
            if (typeof groupedData[dateInterval.dataKey] === 'undefined') {
                pointCoords.push({
                    x: dateInterval.pos,
                    y: yScale(0),
                })
            } else {
                const x = dateInterval.pos;
                const y = yScale(groupedData[dateInterval.dataKey].length);

                pointCoords.push({
                    x,
                    y,
                });
            }
        });
        return pointCoords;
    }

    groupDataBy = (data, groupBy) => {
        const groupedData = {};

        let startOfKey = groupBy;
        if (groupBy === 'days') {
            startOfKey = 'day';
        } else if (groupBy === 'weeks') {
            startOfKey = 'isoWeek';
        } else if (groupBy === 'months') {
            startOfKey = 'month';
        } else {
            startOfKey = 'year';
        }

        // groups each piece of data by the start of selected groupBy period
        data.forEach(datum => {
            if (typeof groupedData[datum.timestamp.clone().startOf(startOfKey).toISOString()] === 'undefined') {
                groupedData[datum.timestamp.clone().startOf(startOfKey).toISOString()] = [{ ...datum }];
            } else {
                groupedData[datum.timestamp.clone().startOf(startOfKey).toISOString()].push({ ...datum });
            }
        });
        return groupedData;
    }

    render() {
        const {
            width,
            height,
        } = this.props;
        return (
            <div className='LineGraph'>
                <canvas ref={this.canvasRef} width={width} height={height} />
            </div>
        )
    }
}

export default LineGraph;
