import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, FileText, ArrowLeft, Download, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';

const FormResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { service, documents } = location.state || { service: 'General Service', documents: {} };
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const uploadedDocs = Object.entries(documents).map(([name, data]) => ({
    name,
    fileName: data.fileName
  }));

  const handleDownload = async () => {
    setIsGenerating(true);
    setShowSuccess(false);

    try {
      // Simulate a small delay for better UX (generation feeling)
      await new Promise(resolve => setTimeout(resolve, 1500));

      const doc = new jsPDF();
      
      // --- PDF CONTENT GENERATION ---
      // Add a border
      doc.setDrawColor(26, 42, 68);
      doc.rect(5, 5, 200, 287);
      
      // Header
      doc.setFontSize(24);
      doc.setTextColor(255, 153, 51); // Saffron
      doc.text("Sarkaar Saathi", 105, 25, { align: 'center' });
      
      doc.setFontSize(16);
      doc.setTextColor(26, 42, 68); // Navy
      doc.text("Official Application Summary", 105, 35, { align: 'center' });
      
      // Line separator
      doc.setDrawColor(200, 200, 200);
      doc.line(20, 42, 190, 42);
      
      // Service Info Section
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text("APPLICATION DETAILS", 20, 55);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.text(`Service Type: ${service.charAt(0).toUpperCase() + service.slice(1)}`, 20, 65);
      doc.text(`Reference ID: SS-${Math.floor(Math.random() * 90000) + 10000}`, 20, 75);
      doc.text(`Generation Date: ${new Date().toLocaleString()}`, 20, 85);
      
      // Document Checklist Section
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("VALIDATED DOCUMENTS", 20, 105);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      let y = 115;
      
      uploadedDocs.forEach((d, index) => {
        // Draw a small checkmark box
        doc.setDrawColor(16, 185, 129);
        doc.rect(20, y - 4, 4, 4);
        doc.setTextColor(16, 185, 129);
        doc.text("L", 21, y - 1); // Simple checkmark look
        
        doc.setTextColor(0, 0, 0);
        const docNameClean = d.name.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        doc.text(`${docNameClean}: ${d.fileName}`, 30, y);
        y += 10;
      });
      
      // Footer / Verification Seal
      doc.setDrawColor(200, 200, 200);
      doc.line(20, 260, 190, 260);
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text("Digitally Verified by Saathi AI Engine", 105, 270, { align: 'center' });
      doc.text("This document serves as a verification of document readiness for government submission.", 105, 275, { align: 'center' });
      
      // --- ROBUST DOWNLOAD LOGIC ---
      const blob = doc.output('blob');
      const url = URL.createObjectURL(blob);
      
      // 1. Open in new tab
      window.open(url, '_blank');
      
      // 2. Trigger download
      const a = document.createElement("a");
      a.href = url;
      a.download = `SarkaarSaathi_${service.replace(/\s+/g, '_')}_Form.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // Cleanup URL
      setTimeout(() => URL.revokeObjectURL(url), 100);
      
      setShowSuccess(true);
    } catch (error) {
      console.error("PDF Generation failed:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flow-container fade-in" style={{ padding: '4rem 0', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ 
          width: '100px', 
          height: '100px', 
          background: '#dcfce7', 
          borderRadius: '50%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          margin: '0 auto 1.5rem'
        }}>
          <CheckCircle size={56} color="#10b981" />
        </div>
        <h1 style={{ fontSize: '2.5rem', color: 'var(--accent)', marginBottom: '1rem' }}>Application Ready!</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>
          Your documents for <strong>{service.charAt(0).toUpperCase() + service.slice(1)}</strong> have been successfully validated.
        </p>
      </div>

      <div className="glass-card" style={{ textAlign: 'left', marginBottom: '3rem', padding: '2.5rem' }}>
        <h3 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <FileText size={24} color="var(--primary)" />
          Validated Documents Snapshot
        </h3>
        <div style={{ display: 'grid', gap: '1.25rem' }}>
          {uploadedDocs.length > 0 ? uploadedDocs.map((doc, i) => (
            <div key={i} style={{ 
              padding: '1.25rem', 
              background: 'white', 
              borderRadius: '14px', 
              border: '1px solid var(--border)', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <span style={{ fontWeight: 700, color: 'var(--accent)', textTransform: 'capitalize' }}>
                {doc.name.replace(/_/g, ' ')}
              </span>
              <span style={{ fontSize: '0.9rem', color: '#64748b', background: '#f1f5f9', padding: '4px 12px', borderRadius: '8px' }}>
                {doc.fileName}
              </span>
            </div>
          )) : (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>No documents found.</p>
          )}
        </div>
      </div>

      {showSuccess && (
        <div className="fade-in" style={{ 
          marginBottom: '2rem', 
          padding: '1rem', 
          background: '#f0fdf4', 
          color: '#166534', 
          borderRadius: '12px', 
          border: '1px solid #bcf0da',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem'
        }}>
          <CheckCircle size={18} /> PDF Generated and Downloaded Successfully!
        </div>
      )}

      <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
        <button 
          className="btn btn-outline" 
          style={{ height: '54px', padding: '0 1.5rem', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '0.75rem' }} 
          onClick={() => navigate('/dashboard')}
          disabled={isGenerating}
        >
          <ArrowLeft size={20} /> Back to Dashboard
        </button>
        <button 
          className="btn btn-primary" 
          onClick={handleDownload} 
          disabled={isGenerating}
          style={{ 
            minWidth: '240px', 
            height: '54px', 
            borderRadius: '14px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '0.75rem',
            position: 'relative',
            background: isGenerating ? '#94a3b8' : 'var(--primary)'
          }}
        >
          {isGenerating ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Generating PDF...
            </>
          ) : (
            <>
              <Download size={20} /> Download Final PDF
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default FormResult;
