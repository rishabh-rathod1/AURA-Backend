import React, { useState, useEffect } from 'react';
import '../App.css';

const WaterAnimation = ({ onAnimationComplete }) => {
  const [animationState, setAnimationState] = useState('filling');

  useEffect(() => {
    const fillingTimer = setTimeout(() => {
      setAnimationState('filling');
    }, 50); // Water fills for 5 seconds

    const fishTimer = setTimeout(() => {
      setAnimationState('fish-entering');
    }, 3000); // Fish enter 0.5 seconds after water is filled

    const submarineTimer = setTimeout(() => {
      setAnimationState('submarine-entering');
    }, 3000); // Submarine enters 2 seconds after fish

    const fadeOutTimer = setTimeout(() => {
      setAnimationState('fading-out');
      if (onAnimationComplete) {
        onAnimationComplete();
      }
    }, 8000); // Fade out starts 8 seconds after submarine enters

    return () => {
      clearTimeout(fillingTimer);
      clearTimeout(fishTimer);
      clearTimeout(submarineTimer);
      clearTimeout(fadeOutTimer);
    };
  }, [onAnimationComplete]);

  const fishEmojis = ['🐠', '🐟', '🐡', '🦈', '🐬'];
  

  return (
    <div className={`water-animation ${animationState === 'fading-out' ? 'fade-out' : ''}`}>
      <div className="welcome-text">
        <strong>Welcome to AURA Nexus Interface</strong>
      </div>
      <div className="center">
        <div className="circle">
          <div className={`wave ${animationState !== 'filling' ? 'filled' : ''}`}></div>
          {animationState !== 'filling' && (
            <>
              {fishEmojis.map((emoji, index) => (
                <div key={index} className="fish" id={`fish${index + 1}`}>{emoji}</div>
              ))}
            </>
          )}
          {animationState === 'submarine-entering' && (
            <div className="submarine__container">
              <div className="light"></div>
              <div className="submarine__periscope"></div>
              <div className="submarine__periscope-glass"></div>
              <div className="submarine__sail">
                <div className="submarine__sail-shadow dark1"></div>
                <div className="submarine__sail-shadow light1"></div>
                <div className="submarine__sail-shadow dark2"></div>
              </div>
              <div className="submarine__body">
                <div className="submarine__window one"></div>
                <div className="submarine__window two"></div>
                <div className="submarine__shadow-dark"></div>
                <div className="submarine__shadow-light"></div>
                <div className="submarine__shadow-arcLight"></div>
              </div>
              <div className="submarine__propeller">
                <div className="propeller__perspective">
                  <div className="submarine__propeller-parts darkOne"></div>
                  <div className="submarine__propeller-parts lightOne"></div>
                </div>        
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WaterAnimation;