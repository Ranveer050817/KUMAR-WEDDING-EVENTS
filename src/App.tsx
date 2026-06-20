import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { FloatingFABs } from './components/FloatingFABs';
import { Home } from './pages/Home';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <div className="min-h-screen bg-dark-900 text-white selection:bg-gold-500/30 selection:text-white">
            <Navigation />
            <main>
              <Home />
            </main>
            <Footer />
            <FloatingFABs />
          </div>
        } />
        <Route path="/admin" element={
          <>
            <AdminLogin />
          </>
        } />
        <Route path="/admin/dashboard" element={
          <>
            <AdminDashboard />
          </>
        } />
      </Routes>
    </BrowserRouter>
  );
}
