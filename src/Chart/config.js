const chartConfig = {
    // Basic Configuration
    type: 'line', // Type of chart: 'line', 'bar', 'pie', 'scatter', etc.
    data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'], // Labels for the x-axis
        datasets: [
            {
                label: 'Sample Data', // Label for the dataset
                data: [10, 20, 30, 40, 50, 60], // Data points for the dataset
                borderColor: 'rgba(75, 192, 192, 1)', // Line color
                backgroundColor: 'rgba(75, 192, 192, 0.2)', // Background color for area charts
                borderWidth: 2, // Width of the line
                fill: true, // Boolean to fill the area under the line
                pointRadius: 5, // Radius of the data points
                pointBackgroundColor: 'rgba(75, 192, 192, 1)', // Background color of the data points
                pointBorderColor: '#fff' // Border color of the data points
            }
        ]
    },

    // General Options
    options: {
        title: {
            display: true, // Boolean to display the chart title
            text: 'Monthly Data', // Text of the chart title
            fontSize: 20 // Font size of the chart title
        },
        legend: {
            display: true, // Boolean to display the legend
            position: 'bottom', // Position of the legend: 'top', 'bottom', 'left', 'right'
            labels: {
                fontSize: 14 // Font size of the legend labels
            }
        },
        tooltips: {
            enabled: true, // Boolean to enable tooltips
            mode: 'index', // Mode of tooltips: 'index', 'nearest'
            callbacks: {
                label: function (tooltipItem) {
                    return `Value: ${tooltipItem.yLabel}`; // Custom tooltip text
                }
            }
        },
        responsive: true, // Boolean to make the chart responsive
        maintainAspectRatio: false, // Boolean to maintain aspect ratio
    },

    // Axis Configuration
    axes: {
        x: {
            display: true, // Boolean to display the x-axis
            title: {
                display: true, // Boolean to display the x-axis title
                text: 'Months', // Title text for the x-axis
                fontSize: 16 // Font size of the x-axis title
            },
            labels: {
                fontSize: 12 // Font size of x-axis labels
            },
            gridLines: {
                display: true // Boolean to display grid lines on the x-axis
            }
        },
        y: {
            display: true, // Boolean to display the y-axis
            title: {
                display: true, // Boolean to display the y-axis title
                text: 'Values', // Title text for the y-axis
                fontSize: 16 // Font size of the y-axis title
            },
            labels: {
                fontSize: 12 // Font size of y-axis labels
            },
            gridLines: {
                display: true // Boolean to display grid lines on the y-axis
            }
        }
    },

    // Dataset Configuration
    dataset: {
        label: '', // Label for the dataset
        data: [], // Array of data points
        borderColor: '', // Color of the line/border
        backgroundColor: '', // Background color for bars/area charts
        borderWidth: 1, // Width of the line/border
        fill: false, // Boolean to fill the area under the line
        pointRadius: 3, // Radius of data points
        pointBackgroundColor: '', // Background color of data points
        pointBorderColor: '', // Border color of data points
    },

    // Advanced Options
    advanced: {
        animation: {
            duration: 1000, // Duration of the animation in milliseconds
            easing: 'easeOutBounce' // Easing function for the animation
        },
        plugins: [], // Array of custom plugins
        events: { // Event listeners
            onClick: function (event, data) {
                // Custom click event handler
            },
            onHover: function (event, data) {
                // Custom hover event handler
            }
        }
    }
};

