import { useState } from 'react';
import { Eye, EyeOff, ShieldCheck, Mail, Lock } from 'lucide-react';
import { apiFetch } from '../../lib/api';

const AdminLogin = ({ onLogin }: { onLogin: () => void }) => {
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (res.user.role !== 'admin') {
        setError('Akses ditolak. Hanya admin yang bisa masuk.');
        return;
      }

      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      onLogin();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="bg-card rounded-2xl border border-border p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-black tracking-widest text-white">PHL<span className="text-primary">O</span>X</h1>
            <p className="text-muted-foreground text-sm mt-2">Admin Panel Login</p>
          </div>

          {error && (
            <div className="bg-red-500/10 text-red-400 text-sm px-4 py-2.5 rounded-xl mb-4 border border-red-500/20">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type="email" placeholder="Email admin" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-3 text-white text-sm outline-none focus:border-primary" />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type={showPass ? 'text' : 'password'} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full bg-background border border-border rounded-xl pl-10 pr-10 py-3 text-white text-sm outline-none focus:border-primary" />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white">
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-primary text-black font-semibold py-3 rounded-xl hover:bg-primary-hover transition-colors text-sm disabled:opacity-50">
              {loading ? 'Memproses...' : 'Login Admin'}
            </button>
          </form>

          <div className="flex items-center justify-center gap-2 mt-6 text-xs text-muted-foreground">
            <ShieldCheck className="w-4 h-4 text-green-400" /> Protected with SSL encryption
          </div>
        </div>
        <p className="text-center text-xs text-muted-foreground mt-4">
          Demo: <strong>admin@phlox.com</strong> / admin123
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
