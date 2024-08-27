import React from 'react';
// Function to get the widest text width from an array of labels
const getWidestText = (context, labels) => {
    let widest = 0;
    for (let i = 0; i < labels.length; i++) {
        const width = context.measureText(labels[i]).width;
        widest = width > widest ? width : widest;
    }
    return widest;
}
// Ease-in-out function
const easeInOutQuad = (t) => {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
};
const defaultProps = {
    xLabels: ["Jan", "Feb", "March", "April", "May", "June", "July"],
    yLabels: ["15", "20", "25", "30", "35", "40", "45", "50", "55", "60", "65", "70", "75", "80", "85", "90", "95", "100"],
    scaleGridLineColor: "rgba(0,0,0,0.5)", // Color of the grid lines
    scaleGridLineWidth: 1, // Width of the grid lines
    scaleFontColor: "#666", // Font color for the scale labels
    scaleFontFamily: "'Arial'", // Font family for the scale labels
    scaleFontSize: 12, // Font size for the scale labels
    scaleFontStyle: "normal", // Font style for the scale labels
    lineColor: "rgba(75,192,192,0.6)", // Color of the line
    pointColor: "#fff", // Color of the points
    pointStrokeColor: "rgba(75,192,192,1)", // Stroke color of the points
    fillColor: "rgba(75,192,192,0.2)", // Fill color for the area under the line
    pointRadius: 4, // Radius of the points
    data: [100, 59, 80, 81, 56, 55, 40], // Example data points
    animationSteps: 120, // The rate of animation progress per frame
    animationEasing: easeInOutQuad, // Animation easing function
    bezierCurve: true, // Whether to use Bezier curves for the lines
    datasetFill: true, // Whether to fill the area under the line
    pointDot: true // Whether to draw points
};

function Chart(props) {
    const ref = React.useRef(null);
    React.useEffect(() => {
        const canvas = ref.current;
        const context = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        const padding = 20; // Padding around the chart
        if (window.devicePixelRatio) {
            canvas.style.width = width + "px";
            canvas.style.height = height + "px";
            canvas.width = width * window.devicePixelRatio;
            canvas.height = height * window.devicePixelRatio;
            context.scale(window.devicePixelRatio, window.devicePixelRatio);
        }
        // Calculate the widest text width for the y-axis labels
        const widestYText = getWidestText(context, props.yLabels);
        // Define chart dimensions
        const chartWidth = width - padding * 2 - widestYText;
        const chartHeight = height - padding * 2 - props.scaleFontSize - 3; // 3 is extra padding for descenders
        let animationProgress = 0;
        const animationDuration = 2; // Duration in seconds
        let lastTimestamp = 0;
        const animateLine = (timestamp) => {
            if (!lastTimestamp) lastTimestamp = timestamp;
            const deltaTime = (timestamp - lastTimestamp) / 1000; // Convert time difference to seconds
            lastTimestamp = timestamp;
            // Increment the animation progress by the animationSteps value scaled by deltaTime
            animationProgress += (props.animationSteps / 60) * deltaTime; // Assuming 60 FPS as base
            context.clearRect(0, 0, width, height); // Clear the canvas
            // Set styles for drawing
            context.lineWidth = props.scaleGridLineWidth;
            context.strokeStyle = props.scaleGridLineColor;
            context.fillStyle = props.scaleFontColor;
            context.font = `${props.scaleFontStyle} ${props.scaleFontSize}px ${props.scaleFontFamily}`;
            context.textBaseline = "middle";
            // Draw y-axis grid lines and labels
            context.beginPath();
            for (let i = 0; i < props.yLabels.length; i++) {
                const averageHeight = chartHeight / props.yLabels.length;
                const y = padding + i * averageHeight;
                context.moveTo(padding + widestYText, y);
                context.lineTo(padding + widestYText + chartWidth, y);
                context.textAlign = "right";
                context.fillText(props.yLabels[i], padding + widestYText - 5, y);
            }
            context.stroke();
            // Draw x-axis grid lines and labels
            context.beginPath();
            context.textAlign = "center";
            for (let i = 0; i < props.xLabels.length; i++) {
                const averageWidth = chartWidth / (props.xLabels.length - 1);
                const x = padding + widestYText + i * averageWidth;
                context.moveTo(x, padding);
                context.lineTo(x, padding + chartHeight);
                context.fillText(props.xLabels[i], x, padding + chartHeight + props.scaleFontSize + 3); // 3 is extra padding for descenders
            }
            context.stroke();
            // Draw border box
            context.beginPath();
            context.moveTo(padding + widestYText + chartWidth, padding); // top right
            context.lineTo(padding + widestYText + chartWidth, padding + chartHeight); // bottom right
            context.lineTo(padding + widestYText, padding + chartHeight); // bottom left
            context.stroke();
            const progressRatio = Math.min(animationProgress / animationDuration, 1);
            const easedProgress = props.animationEasing(progressRatio);
            // Start drawing the line
            context.beginPath();
            context.strokeStyle = props.lineColor;
            context.lineWidth = 2;
            const maxValue = Math.max(...props.yLabels.map(Number));
            const averageWidth = chartWidth / (props.xLabels.length - 1);
            context.moveTo(padding + widestYText, padding + chartHeight - (props.data[0] / maxValue) * chartHeight * easedProgress);
            // Draw the line
            for (let i = 1; i < props.data.length; i++) {
                const x = padding + widestYText + i * averageWidth;
                const y = padding + chartHeight - (props.data[i] / maxValue) * chartHeight * easedProgress;
                if (props.bezierCurve) {
                    const previousX = padding + widestYText + (i - 1) * averageWidth;
                    const previousY = padding + chartHeight - (props.data[i - 1] / maxValue) * chartHeight * easedProgress;
                    const controlX = (previousX + x) / 2;
                    context.bezierCurveTo(controlX, previousY, controlX, y, x, y);
                } else {
                    context.lineTo(x, y);
                }
            }
            // Fill the area under the line
            if (props.datasetFill) {
                context.lineTo(padding + widestYText + chartWidth, padding + chartHeight); // Line to bottom-right corner
                context.lineTo(padding + widestYText, padding + chartHeight); // Line to bottom-left corner
                context.closePath();
                context.fillStyle = props.fillColor;
                context.fill();
            } else {
                context.stroke();
                context.closePath();
            }
            // Draw points
            if (props.pointDot) {
                for (let i = 0; i < props.data.length; i++) {
                    const x = padding + widestYText + i * averageWidth;
                    const y = padding + chartHeight - (props.data[i] / maxValue) * chartHeight * easedProgress;
                    context.beginPath();
                    context.arc(x, y, props.pointRadius, 0, Math.PI * 2, true);
                    context.fillStyle = props.pointColor;
                    context.fill();
                    context.strokeStyle = props.pointStrokeColor;
                    context.lineWidth = 1;
                    context.stroke();
                }
            }
            if (progressRatio < 1) {
                requestAnimationFrame(animateLine);
            }
        };
        requestAnimationFrame(animateLine);
    }, [props.data]);
    return (<div className="p-5">
            <canvas
                className="bg-white"
                ref={ref}
                width="300"
                height="300"
            />
        </div>);
}

Chart.defaultProps = defaultProps;
export default Chart;