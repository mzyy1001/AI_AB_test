import React, { useState } from 'react';
import styles from '../css/Dashboard.module.css';
import { Link } from 'react-router-dom';
import PredictedROITrend from '../dashboard/PredictedROITrend';
import PredictedCPAAnalysis from '../dashboard/PredictedCPAAnalysis';
import PredictedConversionRate from '../dashboard/PredictedConversionRate';
import PredictedAverageCPCPie from '../dashboard/PredictedAverageCPCPie';
import PredictedAverageCPCOct from '../dashboard/PredictedAverageCPCOct';
import FileUpload from '../dashboard/FileUpload';
import logo from '../public/logo.png';

function Dashboard() {
    const [selectedPeriod, setSelectedPeriod] = useState('1 hour');

    const handlePeriodChange = (period) => {
        setSelectedPeriod(period);
    };

    return (
        <div className={styles.pageContainer}>
            <header className={styles.header}>
                <div className={styles.icon}>
                    <Link to="/" className={styles.arrow}></Link>
                </div>
                <div className={styles.logo} >
                    <img src={logo} alt="Logo" style={{
                        height: "40px",
                        width: "75px",
                        display: "block",
                    }} />
                </div>

                <div className={styles.navLinks}>
                    <a href="/user/abtest" className={styles.navbtn}>AB Testing</a>
                    <a href="/user" className={styles.navbtn}>Uploads</a>
                </div>
            </header>
            <div className={styles.cutoffLine}></div>

            <div className={styles.navBar}>
                <span className={styles.label}>Prediction Period</span>
                <div className={styles.predictionPeriod}>
                    {['1 hour', '1 day', '1 week', '1 month'].map((period) => (
                        <button
                            key={period}
                            className={`${styles.predictionButton} ${selectedPeriod === period ? styles.selected : ''}`}
                            onClick={() => handlePeriodChange(period)}
                        >
                            {period}
                        </button>
                    ))}
                </div>
            </div>

            <div className={styles.body}>
                <div className={styles.col}>
                    <div className={styles.row}>
                        <PredictedROITrend />
                    </div>
                    <div className={styles.row}>
                        <PredictedConversionRate />
                    </div>
                </div>

                <div className={styles.col}>
                    <div className={styles.row}>
                        <PredictedCPAAnalysis />
                    </div>
                    <div className={styles.row}>
                        <PredictedAverageCPCPie />
                    </div>
                </div>

                <div className={styles.col}>
                    <div className={styles.row}>
                        <FileUpload />
                    </div>
                    <div className={styles.row}>
                        <PredictedAverageCPCOct />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
