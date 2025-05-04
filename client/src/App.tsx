import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Welcome from './pages/Welcome';
import ContextForm from './pages/ContextForm';
import ThemeOverview from './pages/ThemeOverview';
import Survey from './pages/Survey';
import Ranking from './pages/Ranking';
import ThankYou from './pages/ThankYou';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import Summary from './pages/Summary';
import Send from './pages/Send';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/context" element={<ContextForm />} />
        <Route path="/overview" element={<ThemeOverview />} />
        <Route path="/survey/:themeId/:subthemeId" element={<Survey />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/thankyou" element={<ThankYou />} />
        <Route path="/send" element={<Send />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/summary" element={<Summary />} />
        {/* fallback: redirect alles onbekend naar Welcome */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
