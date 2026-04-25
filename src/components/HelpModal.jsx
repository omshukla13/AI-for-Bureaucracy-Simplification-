import React from 'react';
import { X, HelpCircle, FileText, Search, ClipboardCheck } from 'lucide-react';

const HelpModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const faqs = [
    {
      icon: <FileText size={20} color="#ef4444" />,
      title: "How to use Appeal Generator?",
      text: "Simply upload your rejection document or paste the text manually. Our AI will analyze the reason and provide a professional appeal letter you can download."
    },
    {
      icon: <Search size={20} color="var(--primary)" />,
      title: "How to find eligible schemes?",
      text: "Enter your age, income, state, and occupation in the Benefit Hunter. We match your profile against thousands of government schemes to find the best fit."
    },
    {
      icon: <ClipboardCheck size={20} color="var(--secondary)" />,
      title: "How does validation work?",
      text: "Select a service, upload the required documents, and our system will check if your set is complete and ready for official submission."
    }
  ];

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100vw', 
      height: '100vh', 
      background: 'rgba(15, 23, 42, 0.6)', 
      backdropFilter: 'blur(8px)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      zIndex: 3000,
      padding: '2rem'
    }}>
      <div className="glass-card fade-in" style={{ width: '100%', maxWidth: '600px', padding: '2.5rem', position: 'relative', background: 'white' }}>
        <button 
          onClick={onClose} 
          style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
        >
          <X size={24} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <HelpCircle size={48} color="var(--primary)" style={{ marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '1.75rem', color: 'var(--accent)' }}>Sarkaar Saathi Help Center</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {faqs.map((faq, i) => (
            <div key={i} style={{ padding: '1.25rem', borderRadius: '12px', background: '#f8fafc', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                {faq.icon}
                <h4 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--accent)' }}>{faq.title}</h4>
              </div>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                {faq.text}
              </p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
          <button className="btn btn-primary" onClick={onClose} style={{ width: '150px' }}>Got it!</button>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
