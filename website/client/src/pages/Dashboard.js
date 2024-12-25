import React from 'react';
import styles from '../css/Dashboard.module.css';
import { Link } from 'react-router-dom';
import PredictionPeriod from '../dashboard/PredictionPeriod';
import PredictedROITrend from '../dashboard/PredictedROITrend';
import PredictedCPAAnalysis from '../dashboard/PredictedCPAAnalysis';
import PredictedConversionRate from '../dashboard/PredictedConversionRate';
import PredictedAverageCPC from '../dashboard/PredictedAverageCPC';
import FileUpload from '../dashboard/FileUpload';

function Dashboard() {
    return (
        <div className={styles.pageContainer}>
            <header className={styles.header}>
                <div className={styles.icon}>
                    <Link to="/" className={styles.arrow}></Link>
                </div>
                <span className={styles.grayDot}></span>
            </header>
            <div className={styles.cutoffLine}></div>

            <div className={styles.body}>
                <PredictionPeriod />
                <div className={styles.row}>
                    <div className={styles.col}>
                        <PredictedROITrend />
                    </div>
                    <div className={styles.col}>
                        <PredictedCPAAnalysis />
                    </div>
                </div>

                <div className={styles.row}>
                    <div className={styles.col}>
                        <PredictedConversionRate />
                    </div>
                    <div className={styles.col}>
                        <PredictedAverageCPC />
                    </div>
                </div>

                <FileUpload />
            </div>
        </div>
    );
}

export default Dashboard;
