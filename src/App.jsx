import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { logoutUser } from './services/authService';
import { ShieldCheck, Bot, HelpCircle, MessageCircle } from 'lucide-react';

import Landing from './components/Landing';
import Dashboard from './components/Dashboard';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import AppealGenerator from './components/features/AppealGenerator';
import BenefitHunter from './components/features/BenefitHunter';
import DocumentValidator from './components/features/DocumentValidator';
import FormAssistant from './components/features/FormAssistant';
import FormResult from './components/FormResult';
import About from './components/About';
import Chatbot from './components/Chatbot';
import HelpModal from './components/HelpModal';
import { ProtectedRoute } from './components/ProtectedRoute';

const Header = () => {
  const { currentUser, userData } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '2.5rem 0', marginBottom: '2rem', width: '100%' }}>
      <div className="logo" onClick={() => navigate(currentUser ? '/dashboard' : '/')} style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent)', cursor: 'pointer' }}>
        <ShieldCheck size={32} color="var(--primary)" strokeWidth={2.5} />
        Sarkaar<span style={{ background: 'linear-gradient(to right, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Saathi</span>
      </div>
      <div className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <button className="nav-link" onClick={() => navigate('/about')} style={{ textDecoration: 'none', color: 'var(--accent)', fontWeight: 700, fontSize: '0.95rem', background: 'none', border: 'none', cursor: 'pointer', padding: '0.75rem 1.25rem' }}>About</button>
        
        {currentUser ? (
          <>
            <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Hi, {userData?.name || currentUser.email.split('@')[0]}</span>
            <button className="btn btn-outline" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <button className="btn btn-outline" onClick={() => navigate('/login')}>Login</button>
            <button className="btn btn-primary" onClick={() => navigate('/signup')}>Sign Up</button>
          </>
        )}
      </div>
    </header>
  );
};

const FloatingActions = ({ toggleChat, toggleHelp }) => {
  return (
    <div className="floating-actions" style={{ position: 'fixed', bottom: '2rem', right: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', zIndex: 1000, alignItems: 'flex-end' }}>
      <div 
        className="help-bubble" 
        title="Help" 
        onClick={toggleHelp}
        style={{ width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'white', border: '1px solid var(--border)', color: 'var(--accent)', boxShadow: 'var(--shadow-md)' }}
      >
        <HelpCircle size={24} strokeWidth={2} />
      </div>

      <div 
        className="chat-bubble" 
        id="chat-bubble" 
        onClick={toggleChat}
        style={{ width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'var(--accent)', color: 'white', boxShadow: 'var(--shadow-md)' }}
      >
        <MessageCircle size={28} strokeWidth={2} />
      </div>
    </div>
  );
};

const PublicRoute = ({ children }) => {
  const { currentUser } = useAuth();
  if (currentUser) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

const App = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  return (
    <AuthProvider>
      <Router>
        <div id="app" style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Header />
          
          <main id="main-content" style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
              <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
              <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
              <Route path="/about" element={<About />} />
              <Route path="/form" element={<ProtectedRoute><FormResult /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/appeal" element={<ProtectedRoute><AppealGenerator /></ProtectedRoute>} />
              <Route path="/hunter" element={<ProtectedRoute><BenefitHunter /></ProtectedRoute>} />
              <Route path="/validator" element={<ProtectedRoute><DocumentValidator /></ProtectedRoute>} />
              <Route path="/assistant" element={<ProtectedRoute><FormAssistant /></ProtectedRoute>} />
            </Routes>
          </main>

          <FloatingActions 
            toggleChat={() => setIsChatOpen(!isChatOpen)} 
            toggleHelp={() => setIsHelpOpen(!isHelpOpen)} 
          />

          <Chatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
          <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
