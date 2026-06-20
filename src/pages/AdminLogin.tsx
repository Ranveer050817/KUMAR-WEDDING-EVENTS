import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Lock, AlertCircle } from 'lucide-react';

export function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate single-password auth.
    // In production with Supabase, you would use signInWithPassword 
    // or call an edge function to verify the single admin password securely.
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || localStorage.getItem('ADMIN_PASSWORD') || 'Kumarwedding@007';
    
    if (password === adminPassword) {
      localStorage.setItem('admin_auth', 'true');
      navigate('/admin/dashboard');
    } else {
      setError(true);
      setTimeout(() => setError(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-[#050505] p-12 border border-white/5 relative overflow-hidden"
      >
        <div className="text-center mb-10 relative z-10">
          <div className="w-16 h-16 bg-white/[0.03] flex items-center justify-center mx-auto mb-8 border border-white/5">
            <Lock className="w-6 h-6 text-gold-500" />
          </div>
          <h2 className="font-serif text-4xl font-normal text-white">Admin Access</h2>
        </div>

        <form onSubmit={handleLogin} className="space-y-6 relative z-10">
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-white/40 mb-3 text-center">Dashboard Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full bg-white/[0.03] border ${error ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-gold-500'} p-4 text-center text-white font-mono tracking-widest focus:outline-none transition-colors`}
              autoFocus
            />
            {error && (
              <p className="text-red-400 text-xs mt-4 flex items-center justify-center gap-2 uppercase tracking-widest">
                <AlertCircle className="w-3 h-3" /> Incorrect password
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-gold-500 hover:bg-white text-black px-5 py-4 text-[10px] uppercase tracking-[0.2em] font-bold transition-colors"
          >
            Access Dashboard
          </button>
        </form>
        
        <p className="text-center text-[10px] uppercase tracking-widest text-white/20 mt-10 relative z-10">
          Protected System
        </p>
      </motion.div>
    </div>
  );
}
