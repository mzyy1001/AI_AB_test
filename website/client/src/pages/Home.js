import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../css/Home.module.css';
import logo from '../logos/whitelogo.png';

function Home() {
    return (
        <div className={styles.homeContainer}>
            <video className={styles.backgroundVideo} autoPlay loop muted>
                <source src="/video/home.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            <div className={styles.topLeftLogo}>
                <img src={logo} alt="Logo" className={styles.logo} />
            </div>

            <div className={styles.topRightButtons}>
                <Link to="/login" className={styles.btnLogin}>Log In</Link>
                <Link to="/register" className={styles.btnRegister}>Register</Link>
            </div>

            <div className={styles.contentOverlay}>
                <h1 className={styles.heading}>BEGIN YOUR LIFE </h1>
                <p className={styles.paragraph}>
                    The only true wisdom is in knowing you know nothing.<br />
                    Never interrupt your enemy when he is making a mistake.<br />
                    Today's mighty oak is just yesterday's nut, that held its ground.
                </p>
                <Link to="/templates" className={styles.btnMain}>About Us</Link>
            </div>
        </div>
    );
}

export default Home;