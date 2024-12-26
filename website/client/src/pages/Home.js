import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from '../css/Home.module.css';
import logo from '../public/logo.png';
import bg1 from '../public/home-BG1.png';
import bg2 from '../public/home-BG2.png';

function Home() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        company: '',
        jobTitle: '',
        phone: '',
        country: '',
        interests: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [verificationLink, setVerificationLink] = useState('/login');
    const [abtestLink, setAbtestLink] = useState('/login');
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [fade, setFade] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.defaults.headers.common['Authorization'] = token;
        if (token) {
            setVerificationLink('/user/dashboard');
            setAbtestLink('/user/abtest');
        } else {
            setVerificationLink('/login');
            setAbtestLink('/login');
        }

        if (isError) {
            setFade(false); // Reset the fade effect when a new error occurs
            const timer = setTimeout(() => {
                setFade(true); // Trigger fade-out after 5 seconds automatically
                setTimeout(() => setIsError(false), 1000); // Hide the banner after fade-out
            }, 5000);
            return () => clearTimeout(timer); // Cleanup timer on unmount
        }
    }, [isError]);

    const closeBanner = () => {
        setFade(true); // Trigger the fade-out effect
        setTimeout(() => setIsError(false), 1000); // Hide the banner after the fade-out duration
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessage('');

        try {
            const response = await fetch('/api/contact/contacts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (response.ok) {
                // Handle success (e.g., show a success message or redirect)
                console.log('Form submitted successfully:', result);
                alert('Form submission success!');
                setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    company: '',
                    jobTitle: '',
                    phone: '',
                    country: '',
                    interests: ''
                });

                window.location.href = '/';
            } else {
                // Handle errors
                setErrorMessage(result.error || 'Something went wrong, please try again.');
                setIsError(true); // Show error modal
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setErrorMessage('Error submitting the form. Please try again.');
            setIsError(true); // Show error modal
        } finally {
            setIsSubmitting(false);
        }
    };

    const isAnyInputFilled = Object.values(formData).some(value => value.trim() !== '');

    return (
        <body>
            <nav className={styles.navbar}>
                <div className={styles.logo}>
                    <img src={logo} alt="Logo" width="130" height="130" />
                </div>
                <div className={styles.navLinks}>
                    <a href="/login" className={styles.btnLogin}>Log in</a>
                    <a href="/register" className={styles.btnGetStarted}>Get started</a>
                </div>
            </nav>

            <section className={styles.headingSection}>
                <div className={styles.headingContainer}>
                    <h1 className={styles.mainHeading}>Fifteen.</h1>
                    <p className={styles.subHeading1}>
                        <p>Advertising placement strategy real-time testing for</p>
                        <p className={styles.maxroi}>MAX ROI</p>
                    </p>
                    <p className={styles.subHeading2}>
                        Million+ Al agent market mirroring | Unstructured living data
                    </p>
                    <div className={styles.headingBtns}>
                        <a href={verificationLink} className={styles.headingBtn}>
                            STRATEGY VERIFICATION
                        </a>
                        <a href={abtestLink} className={styles.headingBtn}>
                            A/B/n TESTING
                        </a>
                    </div>
                </div>
            </section>

            <div className={styles.backgroundImages}>
                <img src={bg1} alt="Background 1" className={styles.bg1} />
                <img src={bg2} alt="Background 2" className={styles.bg2} />
            </div>

            <section className={styles.contactformSection}>
                <div className={styles.contactformContainer}>
                    <h1 className={styles.title}>Get in Touch</h1>
                    <h3 className={styles.subtitle}>
                        Achieve unparalleled market insights using more than 1.5 million AI data agents.
                    </h3>
                    <ul className={styles.formList}>
                        <li>User behavior modeling based on millions of self-growing AI data agents, enabling cost-effective and precise A/B testing and data-driven decision support.</li>
                        <li>Costs only 1/600th of any alternative with the same data size.</li>
                        <li>Save 99.983% while making top-tier data-driven decisions.</li>
                    </ul>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.formRow}>
                            <div className={styles.formgroup}>
                                <label htmlFor="first-name">First Name</label>
                                <input
                                    type="text"
                                    id="first-name"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className={styles.formgroup}>
                                <label htmlFor="last-name">Last Name</label>
                                <input
                                    type="text"
                                    id="last-name"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className={styles.formRow}>
                            <div className={styles.formgroup}>
                                <label htmlFor="email">Work Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className={styles.formRow}>
                            <div className={styles.formgroup}>
                                <label htmlFor="company">Company</label>
                                <input
                                    type="text"
                                    id="company"
                                    name="company"
                                    value={formData.company}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className={styles.formgroup}>
                                <label htmlFor="job-title">Job Title</label>
                                <input
                                    type="text"
                                    id="job-title"
                                    name="jobTitle"
                                    value={formData.jobTitle}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className={styles.formRow}>
                            <div className={styles.formgroup}>
                                <label htmlFor="phone">Phone</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className={styles.formgroup}>
                                <label htmlFor="country">Country</label>
                                <select
                                    id="country"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                >
                                    <option value="">Select a country</option>
                                    <option value="ca">Canada</option>
                                    <option value="cn">China</option>
                                    <option value="uk">United Kingdom</option>
                                    <option value="us">United States</option>
                                </select>
                            </div>
                        </div>
                        <div className={styles.formgroup}>
                            <label htmlFor="interests">What products are you interested in?</label>
                            <textarea
                                id="interests"
                                name="interests"
                                rows="4"
                                value={formData.interests}
                                onChange={handleChange}
                            ></textarea>
                        </div>
                        {isAnyInputFilled && (
                            <button type="submit" className={styles.btn} disabled={isSubmitting}>
                                {isSubmitting ? 'Submitting...' : 'Submit'}
                            </button>
                        )}
                    </form>

                    {isError && (
                        <div className={`${styles.errorBanner} ${fade ? styles.fadeOut : ''}`}>
                            <div className={styles.errorContent}>
                                <p className={styles.errorMessage}>{errorMessage}</p>
                                <button onClick={closeBanner} className={styles.closeButton}>
                                    &times;
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            <section className={styles.productIntro}>
                <h2>Real-time, Precise, and Transparent</h2>
                <h4 className={styles.smallGraySubtitle}>explainable AI only</h4>
                <h3 className={styles.largerDarkerSubtitle}>Introduction the first 'alive' data company</h3>
                <div className={styles.productIntroGrid}>
                    <div className={styles.productIntroItem}>
                        <h4 className={styles.productIntroTitle}>Production</h4>
                        <h5 className={styles.productIntroSubtitle}>Ideation and Development</h5>
                        <p className={styles.productIntroDesc}>
                            Transforming innovative ideas into market-ready products through meticulous planning and execution.
                        </p>
                    </div>
                    <div className={styles.productIntroItem}>
                        <h4 className={styles.productIntroTitle}>Market</h4>
                        <h5 className={styles.productIntroSubtitle}>Targeting Niches</h5>
                        <p className={styles.productIntroDesc}>
                            Identifying and focusing on specifc market segments to maximize reach and impact.
                        </p>
                    </div>
                    <div className={styles.productIntroItem}>
                        <h4 className={styles.productIntroTitle}>Precise</h4>
                        <h5 className={styles.productIntroSubtitle}>Product Pricing</h5>
                        <p className={styles.productIntroDesc}>
                            Implement data-driven pricing strategies to ensure competitiveness and profitability.
                        </p>
                    </div>
                    <div className={styles.productIntroItem}>
                        <h4 className={styles.productIntroTitle}>Strategy</h4>
                        <h5 className={styles.productIntroSubtitle}>Development</h5>
                        <p className={styles.productIntroDesc}>
                            Crafting tailored marketing plans that align with your business goals and target audience.
                        </p>
                    </div>
                </div>
            </section>

            <footer>
                <p>&copy; 2024 Fifteen. All rights reserved.</p>
            </footer>
        </body>
    );
}

export default Home;
