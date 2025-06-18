import React, { useRef, useState, useEffect } from "react";
import "./LandingPage.css";
import bgMusic from "./assets/closet.mp3";

export default function LandingPage({ onEnter }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const startAudio = () => {
      if (audioRef.current && !playing) {
        audioRef.current.volume = 0.4;
        audioRef.current.play()
          .then(() => setPlaying(true))
          .catch((err) => console.log("Autoplay blocked:", err));
      }
      window.removeEventListener('click', startAudio);
    };
  
    window.addEventListener('click', startAudio);
  
    return () => window.removeEventListener('click', startAudio);
  }, []);

  return (
    <div className="landing-wrapper">
      <div className="landing-hero">
        <div className="overlay" />
        <div className="hero-content">
          <h1>EnvisionYourTaste</h1>
          <p>AI-powered outfit generator for those who want to elevate their style.</p>
          <button onClick={onEnter}>Enter Your Closet</button>
          <audio ref={audioRef} src={bgMusic} loop />
        </div>
      </div>

      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div>
            <span>1</span>
            <p>Paste clothing links (e.g. Zara, Fashion Nova)</p>
          </div>
          <div>
            <span>2</span>
            <p>Pick your style vibe</p>
          </div>
          <div>
            <span>3</span>
            <p>AI generates your outfit instantly</p>
          </div>
        </div>
      </section>

      <footer>
        <p>PeteraMajor @ 2025</p>
      </footer>
    </div>
  );
}
