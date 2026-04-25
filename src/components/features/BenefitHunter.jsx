import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ExternalLink, ClipboardCheck, ArrowRight, CheckCircle2, UserCircle, LayoutGrid } from 'lucide-react';
import { ruleEngine } from '../../services/mockAI';

const BenefitHunter = () => {
  const navigate = useNavigate();
  const [age, setAge] = useState('');
  const [income, setIncome] = useState('');
  const [stateVal, setStateVal] = useState('');
  const [occ, setOcc] = useState('');
  const [category, setCategory] = useState('');
  const [results, setResults] = useState(null);

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

  const categories = [
    { value: 'general', label: 'General' },
    { value: 'sc', label: 'SC' },
    { value: 'st', label: 'ST' },
    { value: 'obc', label: 'OBC' },
    { value: 'minority', label: 'Minority' },
    { value: 'girl-child-parent', label: 'Parent of Girl Child' }
  ];

  const findSchemes = () => {
    if (!stateVal || !income || !age || !occ) {
      alert("Please fill in all fields.");
      return;
    }

    const eligibleSchemes = ruleEngine.findEligible({
      age,
      income,
      state: stateVal,
      occupation: occ,
      category: category
    });

    setResults(eligibleSchemes);
  };

  return (
    <div className="flow-container fade-in" style={{ padding: '2rem 0', maxWidth: '1000px', margin: '0 auto' }}>
      <button className="btn btn-outline" style={{ marginBottom: '2rem', height: '40px' }} onClick={() => navigate('/dashboard')}>← Back</button>
      
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Smart Benefit Hunter</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Discover and apply for government schemes with step-by-step officer guidance.</p>
      </div>

      <div className="glass-card" style={{ padding: '2.5rem', border: '1px solid var(--border)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          <div className="form-group">
            <label>Age</label>
            <input type="number" className="form-control" value={age} onChange={e => setAge(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Annual Income (₹)</label>
            <input type="number" className="form-control" value={income} onChange={e => setIncome(e.target.value)} />
          </div>
          <div className="form-group">
            <label>State</label>
            <select className="form-control" value={stateVal} onChange={e => setStateVal(e.target.value)}>
              <option value="">Select State</option>
              {states.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Occupation</label>
            <input type="text" className="form-control" value={occ} onChange={e => setOcc(e.target.value)} />
          </div>
        </div>
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <button className="btn btn-primary" style={{ width: '280px', height: '54px' }} onClick={findSchemes}>Find My Benefits</button>
        </div>
      </div>

      {results && (
        <div style={{ marginTop: '4rem' }}>
          <h3 style={{ marginBottom: '2rem' }}>We found {results.length} eligible schemes for you:</h3>
          
          <div style={{ display: 'grid', gap: '2.5rem' }}>
            {results.map((s, idx) => (
              <div key={idx} className="glass-card" style={{ padding: '2.5rem', borderLeft: '8px solid var(--primary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary)', background: 'rgba(26, 42, 68, 0.05)', padding: '4px 12px', borderRadius: '20px' }}>{s.ministry}</span>
                    <h3 style={{ margin: '0.75rem 0' }}>{s.name}</h3>
                    <p style={{ color: 'var(--text-muted)' }}>{s.tagline}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--secondary)' }}>{s.benefit_text.split(' ')[0]}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Per Installment</div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
                  {/* Guide Column */}
                  <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '16px' }}>
                    <h4 style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <UserCircle size={20} color="var(--primary)" /> Officer's Application Guide
                    </h4>
                    <div style={{ display: 'grid', gap: '1rem' }}>
                      <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <div style={{ color: 'var(--primary)', fontWeight: 800 }}>01</div>
                        <p style={{ margin: 0, fontSize: '0.9rem' }}>Visit the <strong>official portal</strong> below and register your mobile number.</p>
                      </div>
                      <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <div style={{ color: 'var(--primary)', fontWeight: 800 }}>02</div>
                        <p style={{ margin: 0, fontSize: '0.9rem' }}>Fill the <strong>{s.name}</strong> digital form with your profile data.</p>
                      </div>
                      <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <div style={{ color: 'var(--primary)', fontWeight: 800 }}>03</div>
                        <p style={{ margin: 0, fontSize: '0.9rem' }}>Upload the validated documents from your Saathi dashboard.</p>
                      </div>
                    </div>
                  </div>

                  {/* Documents & Action */}
                  <div>
                    <h4 style={{ marginBottom: '1rem' }}>Required Documents</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem' }}>
                      {s.docs_required.map((doc, i) => (
                        <span key={i} style={{ padding: '6px 12px', background: 'white', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '0.85rem' }}>{doc}</span>
                      ))}
                    </div>
                    
                    <div style={{ display: 'grid', gap: '1rem' }}>
                      <a href={s.apply_url} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ height: '48px', width: '100%', gap: '0.5rem' }}>
                        Start Application <ExternalLink size={18} />
                      </a>
                      <button 
                        className="btn btn-outline" 
                        style={{ height: '48px', width: '100%', gap: '0.5rem' }}
                        onClick={() => navigate('/validator', { state: { preSelectedService: 'scholarship' } })}
                      >
                        <ClipboardCheck size={18} /> Validate Documents First
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BenefitHunter;