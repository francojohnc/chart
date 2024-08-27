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
    animateScale: false, // Animate the scale of the pie chart
};

function PieChart(props) {
    const ref = React.useRef(null);
    React.useEffect(() => {
        const canvas = ref.current;
        const context = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        const radius = Math.min(width, height) / 2 - 20; // Radius of the pie chart
        const centerX = width / 2;
        const centerY = height / 2;
        let animationProgress = 0;
        const animationDuration = 2; // Duration in seconds
        let lastTimestamp = 0;
        const total = props.data.reduce((acc, value) => acc + value, 0);


        const animatePie = (timestamp) => {
            if (!lastTimestamp) lastTimestamp = timestamp;
            const deltaTime = (timestamp - lastTimestamp) / 1000; // Convert time difference to seconds
            lastTimestamp = timestamp;
            // Increment the animation progress by the animationSteps value scaled by deltaTime
            animationProgress += (props.animationSteps / 60) * deltaTime; // Assuming 60 FPS as base
            context.clearRect(0, 0, width, height); // Clear the canvas
            const progressRatio = Math.min(animationProgress / animationDuration, 1);
            const easedProgress = props.animationEasing(progressRatio);
            let startAngle = -0.5 * Math.PI; // Start from the top of the circle

            let scaleAnimation = 1;

            if (props.animateScale) {
                scaleAnimation = easedProgress;
            }


            for (let i = 0; i < props.data.length; i++) {
                const sliceAngle = (props.typeAnimation === 'whole' ? easedProgress : 1) * (props.data[i] / total) * 2 * Math.PI;
                const endAngle = startAngle + sliceAngle * (props.typeAnimation === 'whole' ? 1 : easedProgress);
                context.beginPath();
                context.moveTo(centerX, centerY);// position the drawing cursor to the center
                context.arc(centerX, centerY, scaleAnimation * radius, startAngle, endAngle);// Draw the pie slice
                context.closePath(); // Close the path
                context.fillStyle = props.colors[i];
                context.fill();
                context.strokeStyle = "#fff";
                context.lineWidth = 2;
                context.stroke();
                startAngle += sliceAngle; // Update the start angle for the next slice
            }
            if (progressRatio < 1) {
                requestAnimationFrame(animatePie);
            }
        };
        requestAnimationFrame(animatePie);
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

PieChart.defaultProps = defaultProps;
export default PieChart;
