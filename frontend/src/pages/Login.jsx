import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Mail, Lock, Loader2, ArrowRight, Briefcase } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success('Đăng nhập thành công!');
      if (user.role === 'EMPLOYER') {
        navigate('/employer/dashboard');
      } else if (user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Email hoặc mật khẩu không chính xác');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-brand-900">
        <img 
          src="/login-bg.png" 
          alt="Professional Background" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay scale-105 hover:scale-100 transition-transform duration-10000"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900/80 via-transparent to-brand-800/40"></div>
        
        <div className="relative z-10 w-full p-20 flex flex-col justify-between text-white">
          <Link to="/" className="flex items-center group shrink-0">
            <img
              src="/logo.png"
              alt="RecruitPro"
              className="h-28 w-auto rounded-[2.5rem] bg-white px-5 py-3 shadow-2xl object-contain hover:scale-105 transition-all duration-500"
            />
          </Link>

          <div>
            <h1 className="text-6xl font-bold leading-tight mb-8 tracking-tighter">
              Kiến tạo <br />
              Năng lực Việt.
            </h1>
            <p className="text-xl text-brand-100 max-w-md font-medium leading-relaxed opacity-80">
              Đồng hành cùng hàng ngàn chuyên gia và doanh nghiệp hàng đầu trong hành trình chinh phục đỉnh cao sự nghiệp.
            </p>
          </div>

          <div className="flex gap-12 font-bold text-xs uppercase tracking-[0.3em] opacity-50">
            <span>Professional</span>
            <span>Reliable</span>
            <span>Global</span>
          </div>
        </div>
      </div>

      {}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 lg:p-24 bg-slate-50">
        <div className="max-w-md w-full">
          {}
          <div className="lg:hidden flex justify-center mb-12">
            <Link to="/" className="flex items-center group shrink-0">
              <img
                src="/logo.png"
                alt="RecruitPro"
                className="h-14 w-auto rounded-xl bg-white px-2 py-1 shadow-lg object-contain"
              />
            </Link>
          </div>

          <div className="mb-12 text-center lg:text-left">
            <h2 className="text-4xl font-bold text-slate-900 tracking-tight mb-4">Chào mừng trở lại</h2>
            <p className="text-slate-500 font-bold text-lg">Đăng nhập để tiếp tục hành trình của bạn</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 ml-1 uppercase tracking-widest">Email doanh nghiệp / cá nhân</label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-600 transition-colors">
                  <Mail size={20} />
                </div>
                <input
                  type="text"
                  required
                  className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-600 transition-all font-bold text-slate-900 placeholder:text-slate-300 shadow-sm"
                  placeholder="Email hoặc tên đăng nhập"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Mật khẩu</label>
                <button type="button" className="text-[11px] font-bold text-brand-600 uppercase tracking-widest hover:underline decoration-2 underline-offset-4">Quên mật khẩu?</button>
              </div>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-600 transition-colors">
                  <Lock size={20} />
                </div>
                <input
                  type="password"
                  required
                  className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-600 transition-all font-bold text-slate-900 placeholder:text-slate-300 shadow-sm"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-brand-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-brand-100 hover:bg-brand-700 hover:shadow-2xl hover:shadow-brand-200 transition-all duration-300 flex items-center justify-center gap-3 active:scale-[0.98]"
            >
              {loading ? <Loader2 className="animate-spin h-6 w-6" /> : (
                <>
                  Đăng nhập hệ thống
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="mt-14 pt-10 border-t border-slate-200/50 text-center lg:text-left">
            <p className="text-slate-500 font-bold">
              Bạn chưa là thành viên?{' '}
              <Link to="/register" className="text-brand-600 font-bold hover:text-brand-800 transition-colors relative inline-block group">
                Đăng ký ngay
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-brand-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

