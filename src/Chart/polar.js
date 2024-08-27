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
    colors: ["#F38630", "#E0E4CC", "#69D2E7"], // Colors for each segment
    animationSteps: 120, // The rate of animation progress per frame
    animationEasing: easeOutBounce, // Animation easing function
    typeAnimation: 'whole', // Animation type: "whole" or "slice"
};

function PolarAreaChart(props) {
    const ref = React.useRef(null);

    React.useEffect(() => {
        const canvas = ref.current;
        const context = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        const maxRadius = Math.min(width, height) / 2 - 20; // Maximum radius of the chart
        const centerX = width / 2;
        const centerY = height / 2;

        let animationProgress = 0;
        const animationDuration = 2; // Duration in seconds
        let lastTimestamp = 0;

        const maxValue = Math.max(...props.data); // Find the maximum value in the dataset
        const sliceAngle = (2 * Math.PI) / props.data.length; // Equal angle for each segment

        const animatePolarArea = (timestamp) => {
            if (!lastTimestamp) lastTimestamp = timestamp;
            const deltaTime = (timestamp - lastTimestamp) / 1000; // Convert time difference to seconds
            lastTimestamp = timestamp;

            // Increment the animation progress by the animationSteps value scaled by deltaTime
            animationProgress += (props.animationSteps / 60) * deltaTime; // Assuming 60 FPS as base
            context.clearRect(0, 0, width, height); // Clear the canvas

            const progressRatio = Math.min(animationProgress / animationDuration, 1);
            const easedProgress = props.animationEasing(progressRatio);

            let startAngle = -0.5 * Math.PI; // Start from the top of the circle

            for (let i = 0; i < props.data.length; i++) {
                const segmentRadius = (props.data[i] / maxValue) * maxRadius * easedProgress;
                const endAngle = startAngle + sliceAngle;

                context.beginPath();
                context.arc(centerX, centerY, segmentRadius, startAngle, endAngle); // Outer arc (variable radius based on data)
                context.lineTo(centerX, centerY); // Draw line back to the center
                context.closePath(); // Close the path

                context.fillStyle = props.colors[i];
                context.fill();

                context.strokeStyle = "#fff";
                context.lineWidth = 2;
                context.stroke();

                startAngle += sliceAngle; // Update the start angle for the next segment
            }

            if (progressRatio < 1) {
                requestAnimationFrame(animatePolarArea);
            }
        };

        requestAnimationFrame(animatePolarArea);
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

PolarAreaChart.defaultProps = defaultProps;
export default PolarAreaChart;
