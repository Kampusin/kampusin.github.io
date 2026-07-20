import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import { Mail, Lock, AlertCircle, GraduationCap } from 'lucide-react';

interface LoginProps {
  onDemoLogin?: () => void;
}

export function Login({ onDemoLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [role, setRole] = useState<'mahasiswa' | 'dosen'>('mahasiswa');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!email || !password) {
      setError('Email dan kata sandi wajib diisi.');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message === 'Invalid login credentials' ? 'Email atau kata sandi salah.' : error.message);
      } else {
        // Successful login
      }
    } catch (err: any) {
      setError('Terjadi kesalahan pada server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-900 overflow-hidden font-sans">
      {/* Mesh Gradient Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -inset-[100%] opacity-40 mix-blend-screen animate-pulse" 
             style={{ background: 'radial-gradient(circle at 15% 50%, rgba(79, 70, 229, 0.4), transparent 25%), radial-gradient(circle at 85% 30%, rgba(147, 51, 234, 0.3), transparent 25%), radial-gradient(circle at 50% 80%, rgba(59, 130, 246, 0.3), transparent 25%)' }} 
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="relative z-10 w-full max-w-md p-6 sm:p-10 mx-4 bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)] rounded-[2rem]"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(79,70,229,0.5)] text-white">
            <GraduationCap size={32} strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Kampusin</h1>
        </div>

        <div className="flex bg-black/20 p-1 rounded-xl mb-6">
          <button 
            type="button"
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${role === 'mahasiswa' ? 'bg-white/15 text-white shadow' : 'text-white/50 hover:text-white/80'}`}
            onClick={() => setRole('mahasiswa')}
          >
            Mahasiswa
          </button>
          <button 
            type="button"
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${role === 'dosen' ? 'bg-white/15 text-white shadow' : 'text-white/50 hover:text-white/80'}`}
            onClick={() => setRole('dosen')}
          >
            Dosen & TU
          </button>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 p-3 mb-5 text-sm text-red-200 bg-red-500/20 border border-red-500/30 rounded-xl"
          >
            <AlertCircle size={16} />
            <span>{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={role === 'mahasiswa' ? 'nim@kampusin.ac.id' : 'nidn@kampusin.ac.id'}
                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-white/30 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Kata Sandi</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-white/30 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                required
              />
            </div>
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            disabled={loading}
            className="w-full mt-2 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-semibold py-3.5 rounded-xl shadow-[0_10px_20px_rgba(79,70,229,0.3)] hover:shadow-[0_15px_25px_rgba(79,70,229,0.4)] transition-shadow disabled:opacity-70 flex justify-center items-center"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Masuk'
            )}
          </motion.button>

          {onDemoLogin && (
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button" 
              onClick={onDemoLogin}
              className="w-full mt-1 bg-white/10 text-white font-semibold py-3.5 rounded-xl border border-white/20 hover:bg-white/20 transition-all flex justify-center items-center"
            >
              Mode Demo (Tanpa Login)
            </motion.button>
          )}
        </form>

        <p className="mt-8 text-center text-xs text-white/30">
          Develop by <strong className="text-white/50">Nugraha Nastya</strong> · Yogyakarta
        </p>
      </motion.div>
    </div>
  );
}
