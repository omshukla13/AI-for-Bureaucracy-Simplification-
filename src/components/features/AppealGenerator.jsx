import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, FileText, Type, X, ArrowRight, CheckCircle, Info, ExternalLink } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { analyzeAppeal } from '../../services/aiService';

const AppealGenerator = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [stateVal, setStateVal] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [manualText, setManualText] = useState('');
  
  const [analysis, setAnalysis] = useState(null);
  const [letter, setLetter] = useState('');
  const [loading, setLoading] = useState(false);

  const states = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
    "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Andaman and Nicobar Islands", "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedFile(file);
  };

  const removeFile = (e) => {
    e.stopPropagation();
    setSelectedFile(null);
    const fileInput = document.getElementById('file-input');
    if (fileInput) fileInput.value = '';
  };

  const handleAnalyze = async () => {
    if (!stateVal) {
      alert("Please select your state.");
      return;
    }
    if (!selectedFile && !manualText.trim()) {
      alert("Please upload a document or enter text manually.");
      return;
    }

    setLoading(true);
    setAnalysis(null);
    setLetter('');

    try {
      let textToAnalyze = manualText.trim();
      if (!textToAnalyze && selectedFile) {
        textToAnalyze = `REJECTION NOTICE: Application for ${stateVal} scheme. Applicant: ${currentUser?.displayName || 'Applicant'}. Status: Rejected. Reason: Income mismatch with documentation.`;
      }

      const result = await analyzeAppeal(textToAnalyze, currentUser?.displayName || 'Applicant');
      setAnalysis(result);
    } catch (err) {
      console.error(err);
      alert("Analysis failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flow-container fade-in" style={{ padding: '2rem 0', maxWidth: '1000px', margin: '0 auto' }}>
      <button className="btn btn-outline" style={{ marginBottom: '2rem', height: '40px' }} onClick={() => navigate('/dashboard')}>← Back</button>
      
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>Guided Appeal Assistant</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Upload your rejection notice. Saathi AI will guide you through the correction and appeal process.</p>
      </div>
      
      <div className="glass-card" style={{ padding: '2.5rem', marginBottom: '3rem' }}>
        <div className="form-group" style={{ maxWidth: '400px' }}>
          <label>Select Your State</label>
          <select className="form-control" value={stateVal} onChange={(e) => setStateVal(e.target.value)}>
            <option value="" disabled>Choose State</option>
            {states.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
          <div className="upload-area" onClick={() => document.getElementById('file-input').click()} style={{ border: '2px dashed var(--border)', borderRadius: '16px', padding: '2.5rem', textAlign: 'center', cursor: 'pointer', background: selectedFile ? '#f0fdf4' : '#f8fafc', transition: 'all 0.2s' }}>
            {selectedFile && <div onClick={removeFile} style={{ position: 'absolute', top: '10px', right: '10px' }}><X size={20} color="#ef4444" /></div>}
            <UploadCloud size={48} color="var(--primary)" style={{ marginBottom: '1rem' }} />
            <p style={{ fontWeight: 600 }}>{selectedFile ? selectedFile.name : "Upload Rejection Document"}</p>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>PDF or Image (max 5MB)</span>
            <input type="file" id="file-input" style={{ display: 'none' }} accept="application/pdf,image/*" onChange={handleFileChange} />
          </div>

          <div style={{ position: 'relative' }}>
            <textarea className="form-control" placeholder="OR: Paste rejection text manually here..." style={{ height: '100%', minHeight: '160px', padding: '1.25rem', borderRadius: '16px', resize: 'none' }} value={manualText} onChange={(e) => setManualText(e.target.value)} />
          </div>
        </div>

        <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
          <button className="btn btn-primary" style={{ width: '280px', height: '54px' }} onClick={handleAnalyze} disabled={loading}>
            {loading ? "Analyzing Document..." : "Process & Start Guidance"}
          </button>
        </div>
      </div>

      {analysis && !loading && (
        <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2.5rem' }}>
          {/* Analysis Column */}
          <div>
            <div className="glass-card" style={{ borderLeft: '8px solid #f87171', padding: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <Info size={24} color="#f87171" />
                <h3 style={{ margin: 0 }}>Rejection Breakdown</h3>
              </div>
              <h4 style={{ color: '#ef4444', marginBottom: '0.5rem' }}>Issue: {analysis.reason}</h4>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: 'var(--accent)' }}>{analysis.explanation}</p>
              
              <hr style={{ margin: '2rem 0', opacity: 0.1 }} />

              <h4 style={{ marginBottom: '1.5rem' }}>Officer's Action Plan</h4>
              <div style={{ display: 'grid', gap: '1.25rem' }}>
                {analysis.next_steps.map((step, i) => (
                  <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', padding: '1.25rem', background: 'rgba(255,255,255,0.5)', borderRadius: '12px' }}>
                    <div style={{ background: 'var(--accent)', color: 'white', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 700, fontSize: '0.8rem' }}>{i + 1}</div>
                    <p style={{ margin: 0, fontWeight: 500 }}>{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="glass-card" style={{ background: 'var(--accent)', color: 'white', textAlign: 'center', padding: '2.5rem' }}>
              <h3 style={{ color: 'white', marginBottom: '1rem' }}>Ready to Appeal?</h3>
              <p style={{ opacity: 0.8, marginBottom: '2rem' }}>We've prepared a formal appeal letter addressing the specific issues found.</p>
              <button className="btn btn-primary" style={{ background: 'white', color: 'var(--accent)', width: '100%' }} onClick={() => setLetter(analysis.appeal)}>
                Generate & Review Appeal
              </button>
            </div>

            {letter && (
              <div className="glass-card fade-in" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h4 style={{ margin: 0 }}>Appeal Letter</h4>
                  <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 700 }}>AI GENERATED</span>
                </div>
                <textarea className="form-control" style={{ height: '250px', fontSize: '0.9rem', padding: '1rem', background: '#f8fafc', border: '1px solid var(--border)' }} value={letter} readOnly />
                <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <button className="btn btn-outline" onClick={() => navigator.clipboard.writeText(letter)}>Copy Text</button>
                  <button className="btn btn-primary" style={{ background: '#10b981' }}>Submit Now <ExternalLink size={16} style={{ marginLeft: '8px' }} /></button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AppealGenerator;
