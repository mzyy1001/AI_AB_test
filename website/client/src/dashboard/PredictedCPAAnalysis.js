import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import styles from '../css/Widget.module.css';

const PredictedCPAAnalysis = () => {
    const data = {
        labels: [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ],
        datasets: [
            {
                label: 'Our Product',
                data: [150, 120, 100, 180, 90, 200, 250, 220, 180, 350, 300, 500], // Seasonal highs and lows
                borderColor: 'rgba(54, 162, 235, 1)', // Blue
                backgroundColor: 'rgba(54, 162, 235, 0.2)', // Light blue for the area
                fill: true,
            },
            {
                label: 'Competitor',
                data: [180, 210, 250, 200, 270, 300, 330, 350, 300, 220, 180, 150], // Seasonal highs and lows for Competitor
                borderColor: 'rgba(255, 99, 132, 1)', // Red
                backgroundColor: 'rgba(255, 99, 132, 0.2)', // Light red for the area
                fill: true,
            },
        ],
    };

    return (
        <div className={styles.widget}>
            <h2 className={styles.widgetTitle}>Predicted CPA Analysis</h2>
            <p className={styles.widgetValue}>
                $13.50 <span className={styles.trend}>↓ 24%</span> vs target ($17.80)
            </p>
            <div className={styles.chart}>
                <Line data={data} />
            </div>
        </div>
    );
};

export default PredictedCPAAnalysis;
