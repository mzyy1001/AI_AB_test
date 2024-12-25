import React, { useState, useEffect } from 'react';
import styles from '../css/Dashboard.module.css';
import { Link, } from 'react-router-dom';

function dashboard() {
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

            </div>
        </div>
    );
}

export default dashboard;