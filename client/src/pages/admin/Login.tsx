import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Shield, Key, Mail, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { authAPI } from '../../lib/api';
import { useAuthStore } from '../../store';

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormData = z.infer<typeof schema>;

export default function Login() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const response = await authAPI.login(data.email, data.password);
      const { user, token } = response.data;
      setAuth(user, token);
      toast.success('System Access Granted');
      navigate('/admin');
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Access Denied: Invalid credentials';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.documentElement.style.fontSize = '17.5px';
    return () => {
      document.documentElement.style.fontSize = '';
    };
  }, []);

  return (
    <div className="admin-login min-h-screen relative flex items-center justify-center px-6 py-12 overflow-hidden" style={{ fontFamily: "'Milan Display', 'Cairo', 'Inter', 'Outfit', sans-serif", fontSize: '17px' }}>
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="mb-4 rounded-[22px] border border-white/10 bg-white/5 px-6 py-5">
            <img
              src="/Mo3taz..svg"
              alt="MO3TAZ."
              className="h-16 w-auto object-contain drop-shadow-[0_0_15px_rgba(0,229,255,0.4)]"
              style={{
                filter: 'brightness(0) saturate(100%) invert(75%) sepia(60%) saturate(500%) hue-rotate(145deg) brightness(1.1)',
              }}
            />
          </div>
          <p className="text-[10px] text-[#aab8d1] font-mono tracking-widest uppercase">
            System Control Panel
          </p>
        </div>

        <div className="glass-card p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-[#1f6fb2] mb-2 uppercase tracking-widest">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#687895]" />
                <input
                  {...register('email')}
                  type="email"
                  placeholder="admin@portfolio.system"
                  className="input-field pl-10 text-sm"
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-xs mt-1.5 font-mono">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1f6fb2] mb-2 uppercase tracking-widest">
                Password
              </label>
              <div className="relative">
                <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#687895]" />
                <input
                  {...register('password')}
                  type="password"
                  placeholder="••••••••••••"
                  className="input-field pl-10 text-sm"
                />
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs mt-1.5 font-mono">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full neon-btn-solid py-3 text-xs font-black flex items-center justify-center gap-2 group transition-all"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Login
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="text-center mt-6">
          <p className="text-xs text-[#aab8d1] font-mono">
            AUTHORIZED PERSONNEL ONLY &bull; SECURE DATABASE SYSTEM
          </p>
        </div>
      </div>
    </div>
  );
}
