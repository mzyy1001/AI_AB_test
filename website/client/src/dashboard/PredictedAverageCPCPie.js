import React from 'react';
import styles from '../css/Widget.module.css';
import chartImg from '../public/predictedAverageCPCPie.png'

const PredictedAverageCPC = () => {
    return (
        <div className={styles.widget}>
            <h2 className={styles.widgetTitle}>Predicted Average CPC</h2>


            <p style={
                {
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }
            }>

                <p>
                    <p className={styles.widgetValue}>$1.47</p>
                    <p className={styles.widgetComment}>
                        <span className={styles.trend}>↓ 3%</span>
                        vs previous ($1.52)
                    </p>

                    <h3>CPM</h3>
                    <p className={styles.widgetValue}>$12.35</p>
                    <p className={styles.widgetComment} style={{ marginBottom: '0' }} >
                        <span className={styles.trend} style={{ color: "#47df00" }} >
                            ↑ 8%</span>
                        vs previous ($11.43)
                    </p>
                </p>

                <img src={chartImg} className={styles.chart} style={
                    {
                        width: '50%',
                    }
                } />
            </p>

        </div>
    );
};

export default PredictedAverageCPC;
