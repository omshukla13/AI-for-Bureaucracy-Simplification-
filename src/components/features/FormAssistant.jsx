import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, CheckCircle, AlertCircle, ArrowLeft, Save, RotateCcw, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const FormAssistant = () => {
  const navigate = useNavigate();
  const { currentUser, userData } = useAuth();
  
  // Simulated "Saved Profile" data
  const savedProfile = {
    fullName: userData?.name || currentUser?.displayName || "Akshat Patel",
    email: currentUser?.email || "aksaar@example.com",
    dob: "2000-05-15",
    income: "450000",
    state: "Maharashtra",
    aadhaarNumber: "XXXX-XXXX-1234",
    occupation: "Student"
  };

  // Form State
  const initialFormState = {
    applicantName: '',
    dateOfBirth: '',
    yearlyEarnings: '',
    residentialState: '',
    profession: '',
    idProofNumber: '',
    guardianName: ''
  };

  const [formData, setFormData] = useState(initialFormState);
  const [filledFields, setFilledFields] = useState([]);
  const [isFilling, setIsFilling] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFilledFields(prev => prev.filter(f => f !== name));
  };

  const handleReset = () => {
    setFormData(initialFormState);
    setFilledFields([]);
    setShowSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.applicantName || !formData.guardianName) {
      alert("Please fill all required fields before submitting.");
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setShowSuccess(true);
    
    // Auto-hide success message and navigate back
    setTimeout(() => {
      navigate('/dashboard');
    }, 3000);
  };

  const autoFill = async () => {
    setIsFilling(true);
    setFilledFields([]);
    setShowSuccess(false);
    
    await new Promise(resolve => setTimeout(resolve, 800));

    const mapping = {
      applicantName: savedProfile.fullName,
      dateOfBirth: savedProfile.dob,
      yearlyEarnings: savedProfile.income,
      residentialState: savedProfile.state,
      profession: savedProfile.occupation,
      idProofNumber: savedProfile.aadhaarNumber
    };

    const newlyFilled = [];
    const updatedForm = { ...formData };

    Object.keys(mapping).forEach(field => {
      if (mapping[field]) {
        updatedForm[field] = mapping[field];
        newlyFilled.push(field);
      }
    });

    setFormData(updatedForm);
    setFilledFields(newlyFilled);
    setIsFilling(false);
  };

  return (
    <div className="flow-container fade-in" style={{ padding: '2rem 0', maxWidth: '900px', margin: '0 auto' }}>
      <button className="btn btn-outline" style={{ marginBottom: '2rem', padding: '0 1.25rem', height: '40px' }} onClick={() => navigate('/dashboard')}>
        <ArrowLeft size={18} style={{ marginRight: '8px' }} /> Back to Dashboard
      </button>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
        <div style={{ textAlign: 'left' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Form Assistant</h1>
          <p style={{ color: 'var(--text-muted)' }}>AI-powered automatic form filling simulation.</p>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={autoFill}
          disabled={isFilling || isSubmitting}
          style={{ 
            height: '54px', 
            borderRadius: '12px', 
            gap: '0.75rem', 
            background: 'var(--secondary)',
            boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)',
            minWidth: '220px'
          }}
        >
          {isFilling ? (
            <><Loader2 size={20} className="animate-spin" /> Detecting Fields...</>
          ) : (
            <><Zap size={20} fill="currentColor" /> Auto Fill Form</>
          )}
        </button>
      </div>

      {showSuccess && (
        <div className="fade-in" style={{ marginBottom: '2rem', padding: '1.5rem', background: '#f0fdf4', color: '#166534', borderRadius: '16px', border: '1px solid #bcf0da', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.1)' }}>
          <div style={{ background: '#10b981', color: 'white', padding: '6px', borderRadius: '50%' }}>
            <CheckCircle size={20} />
          </div>
          <div>
            <h4 style={{ margin: 0 }}>Application Submitted Successfully!</h4>
            <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.8 }}>Redirecting you to dashboard...</p>
          </div>
        </div>
      )}

      <div className="glass-card" style={{ padding: '3rem', position: 'relative', overflow: 'hidden', opacity: isSubmitting ? 0.7 : 1, transition: 'opacity 0.3s' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '6px', background: 'var(--accent)' }}></div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem' }}>
          <div style={{ background: 'var(--accent)', color: 'white', padding: '10px', borderRadius: '10px' }}>
            <FileText size={24} />
          </div>
          <div>
            <h4 style={{ margin: 0 }}>Sample Scholarship Application</h4>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Govt Portal Simulation v2.4</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {/* Field: Applicant Name */}
            <div className="form-group">
              <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                Full Name of Applicant
                {filledFields.includes('applicantName') && <span style={{ color: '#10b981', fontSize: '0.75rem', fontWeight: 700 }}>MATCHED</span>}
              </label>
              <input 
                name="applicantName"
                className="form-control" 
                placeholder="Enter your full name" 
                value={formData.applicantName}
                onChange={handleInputChange}
                required
                style={{ border: filledFields.includes('applicantName') ? '2px solid #10b981' : '1px solid var(--border)', background: filledFields.includes('applicantName') ? '#f0fdf4' : 'white' }}
              />
            </div>

            {/* Field: DOB */}
            <div className="form-group">
              <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                Date of Birth
                {filledFields.includes('dateOfBirth') && <span style={{ color: '#10b981', fontSize: '0.75rem', fontWeight: 700 }}>AUTO-FILLED</span>}
              </label>
              <input 
                name="dateOfBirth"
                type="date"
                className="form-control" 
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                required
                style={{ border: filledFields.includes('dateOfBirth') ? '2px solid #10b981' : '1px solid var(--border)', background: filledFields.includes('dateOfBirth') ? '#f0fdf4' : 'white' }}
              />
            </div>

            {/* Field: Income */}
            <div className="form-group">
              <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                Annual Family Income (INR)
                {filledFields.includes('yearlyEarnings') && <span style={{ color: '#10b981', fontSize: '0.75rem', fontWeight: 700 }}>VERIFIED</span>}
              </label>
              <input 
                name="yearlyEarnings"
                type="number"
                className="form-control" 
                placeholder="0.00" 
                value={formData.yearlyEarnings}
                onChange={handleInputChange}
                style={{ border: filledFields.includes('yearlyEarnings') ? '2px solid #10b981' : '1px solid var(--border)', background: filledFields.includes('yearlyEarnings') ? '#f0fdf4' : 'white' }}
              />
            </div>

            {/* Field: State */}
            <div className="form-group">
              <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                State of Domicile
                {filledFields.includes('residentialState') && <span style={{ color: '#10b981', fontSize: '0.75rem', fontWeight: 700 }}>IDENTIFIED</span>}
              </label>
              <input 
                name="residentialState"
                className="form-control" 
                placeholder="e.g. Maharashtra" 
                value={formData.residentialState}
                onChange={handleInputChange}
                style={{ border: filledFields.includes('residentialState') ? '2px solid #10b981' : '1px solid var(--border)', background: filledFields.includes('residentialState') ? '#f0fdf4' : 'white' }}
              />
            </div>

            {/* Field: ID Proof */}
            <div className="form-group">
              <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                Aadhaar / ID Number
                {filledFields.includes('idProofNumber') && <span style={{ color: '#10b981', fontSize: '0.75rem', fontWeight: 700 }}>SECURE LINK</span>}
              </label>
              <input 
                name="idProofNumber"
                className="form-control" 
                placeholder="XXXX-XXXX-XXXX" 
                value={formData.idProofNumber}
                onChange={handleInputChange}
                style={{ border: filledFields.includes('idProofNumber') ? '2px solid #10b981' : '1px solid var(--border)', background: filledFields.includes('idProofNumber') ? '#f0fdf4' : 'white' }}
              />
            </div>

            {/* Field: Missing Data */}
            <div className="form-group">
              <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                Father / Guardian Name
                <span style={{ color: '#f87171', fontSize: '0.75rem', fontWeight: 700 }}>MANUAL ENTRY</span>
              </label>
              <input 
                name="guardianName"
                className="form-control" 
                placeholder="Required field..." 
                value={formData.guardianName}
                onChange={handleInputChange}
                required
                style={{ border: '1px solid #fecaca', background: '#fff5f5' }}
              />
            </div>
          </div>

          <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'flex-end', gap: '1.5rem', alignItems: 'center' }}>
            <button 
              type="button"
              className="btn btn-outline" 
              onClick={handleReset}
              style={{ border: 'none', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <RotateCcw size={18} /> Reset Form
            </button>
            <button 
              type="submit"
              className="btn btn-primary" 
              disabled={isSubmitting || isFilling}
              style={{ minWidth: '220px', height: '54px', borderRadius: '12px' }}
            >
              {isSubmitting ? (
                <><Loader2 size={20} className="animate-spin" /> Submitting...</>
              ) : (
                <><Save size={20} style={{ marginRight: '8px' }} /> Save & Submit</>
              )}
            </button>
          </div>
        </form>
      </div>

      <div style={{ marginTop: '2rem', background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
        <Zap size={24} color="var(--secondary)" />
        <div>
          <h5 style={{ margin: '0 0 0.5rem 0', color: 'var(--accent)' }}>How it works</h5>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
            Our Assistant scans the form's HTML structure to find labels. It then securely retrieves your verified profile data from SarkaarSaathi to fill the matching fields.
          </p>
        </div>
      </div>
    </div>
  );
};

const FileText = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <line x1="10" y1="9" x2="8" y2="9" />
  </svg>
);

export default FormAssistant;
