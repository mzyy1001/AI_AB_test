import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from '../css/Success.module.css';

function Success() {
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
                <h1>Successfully</h1>
                <Link to="/" className={styles.button}>
                    Back to Home
                </Link>
            </div>
        </div>
    )
}

export default Success;