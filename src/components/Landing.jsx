import React from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="hero fade-in" style={{ flexDirection: 'column', textAlign: 'center', marginTop: '4rem' }}>
      <div className="hero-content">
        <h1>Sarkaar Sathi simplifies <span>Government</span></h1>
        <p style={{ margin: '0 auto 2rem auto' }}>
          A premium, human-designed assistant to help you navigate government schemes, appeals, and document validation without the confusion.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button className="btn btn-primary" style={{ padding: '0 2.5rem', height: '52px', fontSize: '1rem' }} onClick={() => navigate('/signup')}>Get Started</button>
          <button className="btn btn-outline" style={{ padding: '0 2.5rem', height: '52px', fontSize: '1rem' }} onClick={() => navigate('/login')}>Login</button>
        </div>
      </div>
      <div className="hero-illustration" style={{ marginTop: '3rem' }}>
        <img src={`/hero.png?t=${Date.now()}`} alt="Digital Government Assistance" style={{ maxWidth: '600px', width: '100%' }} />
      </div>
    </div>
  );
};

export default Landing;
