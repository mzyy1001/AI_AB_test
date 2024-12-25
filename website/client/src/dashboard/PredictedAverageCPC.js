import React from 'react';
import styles from '../css/Widget.module.css';  // Adjust path accordingly

const PredictedAverageCPC = () => {
    return (
        <div className={styles.widget}>
            <h2 className={styles.widgetTitle}>Predicted Average CPC</h2>
            <p className={styles.widgetValue}>$1.47 <span className={styles.trend}>↓ 3%</span> vs previous ($1.52)</p>
            <div className={styles.chart}>[Chart Placeholder]</div>
        </div>
    );
};

export default PredictedAverageCPC;
