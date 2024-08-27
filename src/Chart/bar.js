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
    barColor: "rgba(75,192,192,0.6)", // Color of the bars
    data: [100, 59, 80, 81, 56, 55, 40], // Example data points
    animationSteps: 120, // The rate of animation progress per frame
    animationEasing: easeInOutQuad // Animation easing function
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
        const chartHeight = height - padding * 2 - props.scaleFontSize - 3; // 3 is extra padding for descenders (like in 'g', 'j', 'p', 'q', 'y')
        let animationProgress = 0;
        const animationDuration = 2; // Duration in seconds
        let lastTimestamp = 0;
        const animateBars = (timestamp) => {
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
                const averageWidth = chartWidth / props.xLabels.length;
                const x = padding + widestYText + i * averageWidth;
                context.moveTo(x, padding);
                context.lineTo(x, padding + chartHeight);
                context.fillText(props.xLabels[i], x + averageWidth / 2, padding + chartHeight + props.scaleFontSize + 3); // 3 is extra padding for descenders
            }
            context.stroke();
            // Draw border box
            context.beginPath();
            context.moveTo(padding + widestYText + chartWidth, padding); // top right
            context.lineTo(padding + widestYText + chartWidth, padding + chartHeight); // bottom right
            context.lineTo(padding + widestYText, padding + chartHeight); // bottom left
            context.stroke();
            // Draw the bars with animation
            const progressRatio = Math.min(animationProgress / animationDuration, 1);
            const easedProgress = props.animationEasing(progressRatio);
            for (let i = 0; i < props.data.length; i++) {
                const averageWidth = chartWidth / props.xLabels.length;
                const x = padding + widestYText + i * averageWidth + averageWidth / 4;
                const barWidth = averageWidth / 2;
                const maxValue = Math.max(...props.yLabels.map(Number));
                const targetHeight = (props.data[i] / maxValue) * chartHeight;
                const currentHeight = targetHeight * easedProgress;
                const y = padding + chartHeight - currentHeight;
                context.fillStyle = props.barColor;
                context.fillRect(x, y, barWidth, currentHeight);
            }
            if (progressRatio < 1) {
                requestAnimationFrame(animateBars);
            }
        };
        requestAnimationFrame(animateBars);
    }, [props.data]);
    return (
        <div className="p-5">
            <canvas
                className="bg-white"
                ref={ref}
                width="300"
                height="300"
            />
        </div>
    );
}

Chart.defaultProps = defaultProps;
export default Chart;
