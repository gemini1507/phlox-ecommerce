import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ShieldCheck, Mail, Lock, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login, register, isLoggedIn } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', name: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already logged in
  if (isLoggedIn) {
    navigate('/shop');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'login') {
        await login(form.email, form.password);
      } else {
        await register(form.name, form.email, form.password);
      }
      navigate('/shop');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-12 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black tracking-widest text-dark">PHL<span className="text-primary">O</span>X</h1>
            <p className="text-gray-500 text-sm mt-2">{mode === 'login' ? 'Sign in to your account' : 'Create your account'}</p>
          </div>

          <div className="flex rounded-xl bg-gray-100 p-1 mb-8">
            {(['login', 'register'] as const).map(m => (
              <button key={m} onClick={() => { setMode(m); setError(''); }} className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${mode === m ? 'bg-white shadow-sm text-dark' : 'text-gray-500 hover:text-dark'}`}>
                {m === 'login' ? 'Sign In' : 'Register'}
              </button>
            ))}
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-2.5 rounded-xl mb-4 border border-red-100">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div className="relative">
                <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Full Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-primary transition-colors" />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="email" placeholder="Email address" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-primary transition-colors" />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type={showPass ? 'text' : 'password'} placeholder="Password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required className="w-full border border-gray-200 rounded-xl pl-10 pr-10 py-3 text-sm outline-none focus:border-primary transition-colors" />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-sm font-semibold mt-2 disabled:opacity-50">
              {loading ? 'Loading...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="flex items-center justify-center gap-2 mt-6 text-xs text-gray-400">
            <ShieldCheck className="w-4 h-4 text-green-500" /> Protected with SSL encryption
          </div>
        </div>
        <p className="text-center text-xs text-gray-400 mt-4">
          Demo: <strong>danny@gmail.com</strong> / customer123
        </p>
      </div>
    </div>
  );
};

export default Login;
