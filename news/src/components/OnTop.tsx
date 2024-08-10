import React, { useState, useEffect } from 'react';
import styles from './ScrollToTopButton.module.css';
import {FaArrowUp} from "react-icons/fa";

const ScrollToTopButton: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        if (window.pageYOffset > window.innerHeight / 2) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    return (
        <div className={styles.scrollToTop}>
            {isVisible && (
                <button onClick={scrollToTop} className={styles.scrollToTopButton} title={"Đầu trang"}>
                    <FaArrowUp/>
                </button>
            )}
        </div>
    );
};

export default ScrollToTopButton;
