import React, { useState } from 'react';
import styles from '../css/Dashboard.module.css';

const PredictionPeriod = () => {
    const [selectedPeriod, setSelectedPeriod] = useState('1 Hour');

    const handlePeriodChange = (period) => {
        setSelectedPeriod(period);
    };

    return (
        <div className={styles.predictionPeriod}>
            {['1 Hour', '1 Day', '1 Week', '1 Month'].map((period) => (
                <button
                    key={period}
                    className={`${styles.predictionButton} ${selectedPeriod === period ? styles.selected : ''}`}
                    onClick={() => handlePeriodChange(period)}
                >
                    {period}
                </button>
            ))}
        </div>
    );
};

export default PredictionPeriod;
