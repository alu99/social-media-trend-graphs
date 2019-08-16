export const drawAxis = (ctx, width, height, vertical) => {

    if (!vertical) {
        drawLine(ctx, 0, height, width, height);
    } else {
        drawLine(ctx, 0, 0, 0, height);
    }
}

export const drawLine = (ctx, x0, y0, x1, y1) => {
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
}

export const drawPoint = (ctx, x, y) => {
    
}
