export const drawAxis = (ctx, width, height, vertical, axisColor, topLeft) => {
    ctx.strokeStyle = axisColor;
    if (!vertical) {
        drawLine(ctx, topLeft.x, topLeft.y + height, topLeft.x + width, topLeft.y + height);
    } else {
        drawLine(ctx, topLeft.x, topLeft.y, topLeft.x, topLeft.y + height);
    }
}

export const drawLine = (ctx, x0, y0, x1, y1) => {
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
}

export const drawPoint = (ctx, x, y, color, size) => {
    ctx.beginPath();
    ctx.arc(x, y, size, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.closePath();
}

export const drawTickmarksOnAxis = (ctx, axisIntervals, axis, axisPos, axisColor, nthLabel) => {
    ctx.font = "15px Arial";
    ctx.fillStyle = axisColor;
    ctx.strokeStyle = axisColor;

    if (axis === 'x') {
        axisIntervals.forEach((interval, index) => {
            const xPos = interval.pos;

            if (index % nthLabel === 0) {
                //draws text label and rotates it 45 degrees so it can fit
                ctx.save();
                ctx.translate(xPos, axisPos + 15);
                ctx.rotate(Math.PI / 4);
                ctx.translate(-xPos, -(axisPos + 15));
                ctx.textAlign = 'left';
                ctx.fillText(interval.label, xPos, axisPos + 15, 80);
                ctx.restore();
            }

            //draws tickmark
            drawLine(ctx, xPos, axisPos - 5, xPos, axisPos + 5);
        });
    } else {
        axisIntervals.forEach((interval,index) => {
            const yPos = interval.pos;

            if (index % nthLabel === 0) {
                //draws text label
                ctx.textAlign = 'center';
                ctx.fillText(interval.label, axisPos - 20, yPos + 5, 80);
            }

            //draws tickmark
            drawLine(ctx, axisPos - 5, yPos, axisPos + 5, yPos);
        });
    }
}

export const connectPoints = (ctx, pointCoords, color) => {
    for (let i = 0; i < pointCoords.length - 1; i++) {
        drawLine(ctx, pointCoords[i].x, pointCoords[i].y, pointCoords[i + 1].x, pointCoords[i + 1].y);
    }
}
