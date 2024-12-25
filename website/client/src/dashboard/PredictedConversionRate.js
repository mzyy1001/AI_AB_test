import React from 'react';
import styles from '../css/Widget.module.css';  // Adjust path accordingly
import chartImg from '../public/predictedConversionRate.png';

const PredictedConversionRate = () => {
    return (
        <div className={styles.widget}>
            <h2 className={styles.widgetTitle}>Predicted Conversion Rate</h2>
            <img src={chartImg} className={styles.chart} style={
                {
                    marginTop: '20px',
                }
            }/>
        </div>
    );
};

export default PredictedConversionRate;
