import React from 'react';
import styles from '../css/Widget.module.css';  // Adjust path accordingly
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import chartImg from '../public/predictedROITrend.png';

const PredictedROITrend = () => {
    const data = {
        labels: ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024'],
        datasets: [
            {
                label: 'Our Product',
                data: [1000, 1200, 1300, 1500],
                borderColor: 'rgba(75, 192, 192, 1)',
                fill: true,
            },
            {
                label: 'Competitor',
                data: [500, 700, 800, 1100],
                borderColor: 'rgba(255, 99, 132, 1)',
                fill: true,
            },
        ],
    };

    return (
        <div className={styles.widget}>
            <h2 className={styles.widgetTitle}>Predicted ROI Trend</h2>
            <p className={styles.widgetValue}>203k</p>
            <p className={styles.widgetComment}>
                <span className={styles.trend}>↓ 30%</span>
                vs previous period (288.4k)
            </p>
            {/* <Line data={data} /> */}
            <img src={chartImg} className={styles.chart} />
        </div>
    );
};;


export default PredictedROITrend;
