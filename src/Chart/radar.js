import React from 'react';

const easeOutBounce = (t) => {
    const n1 = 7.5625;
    const d1 = 2.75;
    if (t < 1 / d1) {
        return n1 * t * t;
    } else if (t < 2 / d1) {
        return n1 * (t -= 1.5 / d1) * t + 0.75;
    } else if (t < 2.5 / d1) {
        return n1 * (t -= 2.25 / d1) * t + 0.9375;
    } else {
        return n1 * (t -= 2.625 / d1) * t + 0.984375;
    }
};

const defaultProps = {
    data: [30, 50, 100], // Example data points
    labels: ["Label 1", "Label 2", "Label 3"], // Labels for each axis
    color: "#69D2E7", // Color for the radar chart polygon
    animationSteps: 120, // The rate of animation progress per frame
    animationEasing: easeOutBounce, // Animation easing function
    showGrid: true, // Whether to show grid lines
    gridLineColor: "#ccc", // Color of the grid lines
    gridLineWidth: 1, // Width of the grid lines
};

function RadarChart(props) {
    const ref = React.useRef(null);

    React.useEffect(() => {
        const canvas = ref.current;
        const context = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        const centerX = width / 2;
        const centerY = height / 2;
        const maxRadius = Math.min(width, height) / 2 - 20; // Maximum radius of the chart
        const total = Math.max(...props.data); // Use the max value as the scaling factor
        const angleStep = (2 * Math.PI) / props.data.length; // Angle between each axis

        let animationProgress = 0;
        const animationDuration = 2; // Duration in seconds
        let lastTimestamp = 0;

        const animateRadar = (timestamp) => {
            if (!lastTimestamp) lastTimestamp = timestamp;
            const deltaTime = (timestamp - lastTimestamp) / 1000; // Convert time difference to seconds
            lastTimestamp = timestamp;

            // Increment the animation progress by the animationSteps value scaled by deltaTime
            animationProgress += (props.animationSteps / 60) * deltaTime; // Assuming 60 FPS as base
            context.clearRect(0, 0, width, height); // Clear the canvas

            const progressRatio = Math.min(animationProgress / animationDuration, 1);
            const easedProgress = props.animationEasing(progressRatio);

            // Draw grid lines if enabled
            if (props.showGrid) {
                context.strokeStyle = props.gridLineColor;
                context.lineWidth = props.gridLineWidth;
                for (let i = 1; i <= 5; i++) {
                    context.beginPath();
                    for (let j = 0; j <= props.data.length; j++) {
                        const x = centerX + (maxRadius * i / 5) * Math.cos(angleStep * j);
                        const y = centerY + (maxRadius * i / 5) * Math.sin(angleStep * j);
                        context.lineTo(x, y);
                    }
                    context.closePath();
                    context.stroke();
                }
            }

            // Draw the radar chart polygon
            context.beginPath();
            context.strokeStyle = props.color;
            context.fillStyle = props.color;
            context.lineWidth = 2;

            for (let i = 0; i < props.data.length; i++) {
                const radius = (props.data[i] / total) * maxRadius * easedProgress;
                const x = centerX + radius * Math.cos(angleStep * i - Math.PI / 2);
                const y = centerY + radius * Math.sin(angleStep * i - Math.PI / 2);

                if (i === 0) {
                    context.moveTo(x, y);
                } else {
                    context.lineTo(x, y);
                }

                // Draw the labels
                context.textAlign = "center";
                context.fillText(props.labels[i], x, y - 10);
            }

            context.closePath();
            context.stroke();
            context.globalAlpha = 0.5; // Add some transparency for the fill
            context.fill();
            context.globalAlpha = 1; // Reset transparency

            if (progressRatio < 1) {
                requestAnimationFrame(animateRadar);
            }
        };

        requestAnimationFrame(animateRadar);
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

RadarChart.defaultProps = defaultProps;
export default RadarChart;
