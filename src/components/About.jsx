import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Search, FileX, ClipboardCheck } from 'lucide-react';

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="flow-container fade-in" style={{ padding: '2rem 0', maxWidth: '800px', margin: '0 auto' }}>
      <button className="btn btn-outline" style={{ marginBottom: '2rem', padding: '0 1.25rem', height: '40px' }} onClick={() => navigate(-1)}>← Back</button>
      
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <ShieldCheck size={48} color="var(--primary)" strokeWidth={2.5} />
        </div>
        <h1 style={{ fontSize: '3rem', color: 'var(--accent)', marginBottom: '1rem' }}>About Sarkaar Saathi</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>Empowering citizens to navigate government processes seamlessly.</p>
      </div>

      <div className="unified-form-card" style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>What We Do</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: '1.8' }}>
          Sarkaar Saathi is a premium, human-designed assistant built specifically for Indian citizens. 
          We bridge the gap between complex government bureaucracy and the everyday individual by providing 
          clear, actionable, and intelligent guidance.
        </p>
      </div>

      <div className="unified-form-card" style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ color: 'var(--secondary)', marginBottom: '1rem' }}>The Problem We Solve</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: '1.8' }}>
          Applying for schemes, validating documents, and understanding rejection notices are notoriously difficult. 
          Legal jargon, unclear requirements, and fragmented information lead to frustration and missed opportunities. 
          Sarkaar Saathi eliminates this confusion by acting as your personal, digital government guide.
        </p>
      </div>

      <h2 style={{ color: 'var(--accent)', marginBottom: '1.5rem', marginTop: '3rem' }}>Core Features</h2>
      <div className="form-grid">
        <div className="glass-card" style={{ padding: '2rem' }}>
          <FileX size={32} color="#ef4444" style={{ marginBottom: '1rem' }} />
          <h3 style={{ marginBottom: '0.5rem' }}>Appeal Generator</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Translates complex rejection letters into simple language and automatically drafts professional appeals.</p>
        </div>
        
        <div className="glass-card" style={{ padding: '2rem' }}>
          <Search size={32} color="var(--primary)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ marginBottom: '0.5rem' }}>Benefit Hunter</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Matches your personal profile against a database of government schemes to find benefits you are eligible for.</p>
        </div>

        <div className="glass-card" style={{ padding: '2rem' }}>
          <ClipboardCheck size={32} color="var(--secondary)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ marginBottom: '0.5rem' }}>Doc Validator</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Pre-checks your application documents to ensure nothing is missing or outdated before you hit submit.</p>
        </div>
      </div>
    </div>
  );
};

export default About;
