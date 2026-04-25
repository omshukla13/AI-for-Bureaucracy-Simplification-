import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Circle, XCircle, Upload, RotateCcw, Eye, Download, AlertTriangle, FileCheck, ArrowRight, Loader2 } from 'lucide-react';
import { serviceDocs } from '../../services/mockAI';
import { verifyDocument } from '../../services/aiService';

const DocumentValidator = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);
  
  const [service, setService] = useState('');
  // uploads structure: { [docKey]: { uploaded: boolean, fileName: string, url: string, isValid: boolean, reason: string, isVerifying: boolean } }
  const [uploads, setUploads] = useState({});
  const [activeDoc, setActiveDoc] = useState(null);

  useEffect(() => {
    if (location.state?.preSelectedService) {
      setService(location.state.preSelectedService);
    }
  }, [location.state]);
  
  const handleServiceChange = (e) => {
    setService(e.target.value);
    setUploads({});
    setActiveDoc(null);
  };

  const triggerUpload = (docKey) => {
    setActiveDoc(docKey);
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const currentDocKey = activeDoc;
    
    if (file && currentDocKey) {
      const fileUrl = URL.createObjectURL(file);
      
      // Mark as uploading/verifying immediately
      setUploads(prev => ({
        ...prev,
        [currentDocKey]: { 
          uploaded: false, 
          isVerifying: true,
          fileName: file.name,
          url: fileUrl,
          isValid: false,
          reason: "Analyzing document..."
        }
      }));

      // Get expected type name from serviceDocs
      const currentServiceData = serviceDocs[service];
      const docConfig = currentServiceData.required.find(d => d.key === currentDocKey);
      const expectedType = docConfig ? docConfig.label : "Document";

      try {
        // Convert file to Base64
        const base64Data = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
            // Split off the "data:image/png;base64," part
            resolve(reader.result.split(',')[1]);
          };
          reader.onerror = error => reject(error);
        });

        // Call the Gemini Vision API
        const aiResult = await verifyDocument(base64Data, file.type, expectedType);
        
        setUploads(prev => ({
          ...prev,
          [currentDocKey]: { 
            uploaded: true, 
            isVerifying: false,
            fileName: file.name,
            url: fileUrl,
            isValid: aiResult.isValid,
            reason: aiResult.reason
          }
        }));
      } catch (err) {
        console.error("File processing error", err);
        setUploads(prev => ({
          ...prev,
          [currentDocKey]: { 
            uploaded: true, 
            isVerifying: false,
            fileName: file.name,
            url: fileUrl,
            isValid: false,
            reason: "Failed to verify document content."
          }
        }));
      }
    }
    
    e.target.value = '';
    setActiveDoc(null);
  };

  const removeUpload = (docKey) => {
    setUploads(prev => {
      const newUploads = { ...prev };
      delete newUploads[docKey];
      return newUploads;
    });
  };

  const currentServiceData = service ? serviceDocs[service] : null;
  const currentDocs = currentServiceData ? currentServiceData.required : [];
  
  // Smart Review Logic
  let isReady = true;
  const issues = [];
  
  if (!service) {
    isReady = false;
  } else {
    currentDocs.forEach(d => {
      const upload = uploads[d.key];
      if (!upload || (!upload.uploaded && !upload.isVerifying)) {
        issues.push({ type: 'missing', label: d.label, message: 'Document is missing.' });
        isReady = false;
      } else if (upload.isVerifying) {
        isReady = false; // Cannot proceed while verifying
      } else if (upload.uploaded && !upload.isValid) {
        issues.push({ type: 'invalid', label: d.label, message: upload.reason || 'Incorrect document type.' });
        isReady = false;
      }
    });
  }

  return (
    <div className="flow-container fade-in" style={{ padding: '2rem 0', maxWidth: '1100px', margin: '0 auto' }}>
      <button className="btn btn-outline" style={{ marginBottom: '2rem', height: '40px' }} onClick={() => navigate('/dashboard')}>← Back</button>
      
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Smart Document Review</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Our AI engine scans and validates the content of your documents in real-time.</p>
      </div>

      <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" />

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2.5rem', alignItems: 'start' }}>
        {/* Document Checklist Column */}
        <div>
          <div className="glass-card" style={{ padding: '2.5rem' }}>
            <div className="form-group" style={{ marginBottom: '2.5rem' }}>
              <label>Service to Validate</label>
              <select className="form-control" value={service} onChange={handleServiceChange}>
                <option value="">Choose a service...</option>
                {Object.keys(serviceDocs).map(k => <option key={k} value={k}>{serviceDocs[k].name}</option>)}
              </select>
            </div>

            {service && (
              <div style={{ display: 'grid', gap: '1.25rem' }}>
                {currentDocs.map((doc, i) => {
                  const upload = uploads[doc.key];
                  const isVerifying = upload?.isVerifying;
                  const isUploaded = upload?.uploaded;
                  const isValid = upload?.isValid;
                  
                  let borderCol = 'var(--border)';
                  let bgCol = 'white';
                  if (isVerifying) { borderCol = '#fcd34d'; bgCol = '#fffbeb'; }
                  else if (isUploaded) {
                    if (isValid) { borderCol = '#bcf0da'; bgCol = '#f0fdf4'; }
                    else { borderCol = '#fecaca'; bgCol = '#fff5f5'; }
                  }
                  
                  return (
                    <div key={i} style={{ 
                      padding: '1.5rem', 
                      borderRadius: '16px', 
                      border: `1px solid ${borderCol}`,
                      background: bgCol,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      transition: 'all 0.3s'
                    }}>
                      <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                        <div style={{ color: isVerifying ? '#f59e0b' : (isUploaded ? (isValid ? '#10b981' : '#ef4444') : 'var(--border)') }}>
                          {isVerifying ? <Loader2 size={28} className="animate-spin" /> : 
                           (isUploaded ? (isValid ? <CheckCircle size={28} /> : <XCircle size={28} />) : <Circle size={28} />)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--accent)' }}>{doc.label}</div>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                            {isVerifying ? "Scanning document with AI..." : (isUploaded ? `File: ${upload.fileName}` : doc.hint)}
                          </p>
                          {isUploaded && !isValid && !isVerifying && (
                            <span style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 700, display: 'block', marginTop: '4px' }}>
                              ❌ {upload.reason}
                            </span>
                          )}
                          {isUploaded && isValid && !isVerifying && (
                            <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700, display: 'block', marginTop: '4px' }}>
                              ✅ Valid {doc.label} Confirmed
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {isUploaded && !isVerifying && (
                          <button className="btn btn-outline" style={{ width: '40px', padding: 0 }} onClick={() => removeUpload(doc.key)}><XCircle size={18} /></button>
                        )}
                        <button className="btn btn-primary" style={{ height: '40px', padding: '0 1rem', fontSize: '0.85rem' }} onClick={() => triggerUpload(doc.key)} disabled={isVerifying}>
                          {isUploaded ? "Update" : "Upload"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Smart Review Column */}
        <div style={{ position: 'sticky', top: '2rem' }}>
          <div className="glass-card" style={{ padding: '2.5rem', border: '1px solid var(--border)' }}>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <FileCheck size={24} color="var(--primary)" /> Smart Review
            </h3>
            
            <div style={{ 
              padding: '1.5rem', 
              borderRadius: '16px', 
              textAlign: 'center', 
              background: isReady && service ? '#f0fdf4' : '#fef2f2',
              marginBottom: '2rem'
            }}>
              <h2 style={{ margin: 0, color: isReady && service ? '#10b981' : '#ef4444' }}>
                {isReady && service ? 'READY' : 'NOT READY'}
              </h2>
              <p style={{ margin: '0.5rem 0 0', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                {isReady && service ? 'All documents are valid and match required types.' : 'Issues detected that will cause rejection.'}
              </p>
            </div>

            {issues.length > 0 && service && (
              <div style={{ marginBottom: '2rem' }}>
                <h5 style={{ marginBottom: '1rem', color: '#991b1b' }}>Identified Issues:</h5>
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  {issues.map((issue, i) => (
                    <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', padding: '0.75rem', background: '#fff', border: '1px solid #fecaca', borderRadius: '10px', fontSize: '0.85rem' }}>
                      <AlertTriangle size={16} color="#ef4444" style={{ flexShrink: 0 }} />
                      <span><strong>{issue.label}</strong>: {issue.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'grid', gap: '1rem' }}>
              <button 
                className="btn btn-primary" 
                style={{ width: '100%', height: '54px' }} 
                disabled={!isReady || !service}
                onClick={() => navigate('/form', { state: { service, documents: uploads } })}
              >
                Proceed to Application <ArrowRight size={18} style={{ marginLeft: '8px' }} />
              </button>
              <button className="btn btn-outline" style={{ width: '100%', height: '54px' }} onClick={() => setUploads({})}>
                Reset Checklist
              </button>
            </div>

            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <strong>AI Guard:</strong> Our AI engine analyzes document text patterns. For example, a PAN Card is only valid if it matches the format ABCDE1234F.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentValidator;
