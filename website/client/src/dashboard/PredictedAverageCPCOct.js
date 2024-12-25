import React from 'react';
import styles from '../css/Widget.module.css';
import chartImg from '../public/predictedAverageCPCOct.png'

const PredictedAverageCPC = () => {
    return (
        <div className={styles.widget}>
            <h2 className={styles.widgetTitle}>Predicted Average CPC</h2>
            <img src={chartImg} className={styles.chart}/>
        </div>
    );
};

export default PredictedAverageCPC;
