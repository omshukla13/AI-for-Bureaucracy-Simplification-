import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileX, Search, ClipboardCheck, ArrowRight, Zap } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="main-grid fade-in" style={{ marginTop: '2rem' }}>
      <div className="glass-card option-card" onClick={() => navigate('/appeal')} style={{ borderBottom: '6px solid #f87171' }}>
        <div style={{ background: '#fef2f2', width: '64px', height: '64px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
          <FileX size={32} color="#ef4444" strokeWidth={2.5} />
        </div>
        <h3>Appeal Generator</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '1rem', flex: 1 }}>
          Understand why your application was rejected and generate a professional appeal letter in minutes.
        </p>
        <div className="cta-link" style={{ color: '#ef4444' }}>
          Get Started <ArrowRight size={18} strokeWidth={2.5} />
        </div>
      </div>

      <div className="glass-card option-card" onClick={() => navigate('/hunter')} style={{ borderBottom: '6px solid var(--primary)' }}>
        <div style={{ background: '#fff7ed', width: '64px', height: '64px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
          <Search size={32} color="var(--primary)" strokeWidth={2.5} />
        </div>
        <h3>Benefit Hunter</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '1rem', flex: 1 }}>
          Discover eligible schemes based on your profile. We simplify the rules so you don't have to read legal documents.
        </p>
        <div className="cta-link" style={{ color: 'var(--primary)' }}>
          Discover Now <ArrowRight size={18} strokeWidth={2.5} />
        </div>
      </div>

      <div className="glass-card option-card" onClick={() => navigate('/validator')} style={{ borderBottom: '6px solid var(--secondary)' }}>
        <div style={{ background: '#f0fdf4', width: '64px', height: '64px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
          <ClipboardCheck size={32} color="var(--secondary)" strokeWidth={2.5} />
        </div>
        <h3>Doc Validator</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '1rem', flex: 1 }}>
          Validate your documents before submission. Our smart checklist identifies missing or outdated files instantly.
        </p>
        <div className="cta-link" style={{ color: 'var(--secondary)' }}>
          Check Status <ArrowRight size={18} strokeWidth={2.5} />
        </div>
      </div>

      <div className="glass-card option-card" onClick={() => navigate('/assistant')} style={{ borderBottom: '6px solid #f59e0b' }}>
        <div style={{ background: '#fffbeb', width: '64px', height: '64px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
          <Zap size={32} color="#f59e0b" strokeWidth={2.5} />
        </div>
        <h3>Form Assistant</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '1rem', flex: 1 }}>
          Automatically fill complex government forms using your saved profile and documents in one click.
        </p>
        <div className="cta-link" style={{ color: '#f59e0b' }}>
          Start Filling <ArrowRight size={18} strokeWidth={2.5} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
