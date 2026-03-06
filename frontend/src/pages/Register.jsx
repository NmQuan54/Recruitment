import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Mail, Lock, User, Briefcase, GraduationCap, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    role: 'CANDIDATE'
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(formData.email, formData.password, formData.fullName, formData.role);
      toast.success('Đăng ký thành công! Hãy đăng nhập.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi đăng ký');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-brand-900">
        <img 
          src="/register-bg.png" 
          alt="Collaboration Background" 
          className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-brand-900 via-brand-900/40 to-transparent"></div>
        
        <div className="relative z-10 w-full p-20 flex flex-col justify-between text-white">
          <Link to="/" className="flex items-center gap-3">
            <div className="bg-white p-2.5 rounded-xl">
              <Briefcase className="h-6 w-6 text-brand-600" />
            </div>
            <span className="text-2xl font-bold tracking-tighter">RecruitPro</span>
          </Link>

          <div className="max-w-xl">
            <h1 className="text-6xl font-bold leading-tight mb-8 tracking-tighter">
              Bắt đầu <br />
              Chương mới.
            </h1>
            <p className="text-xl text-brand-100 font-medium leading-relaxed opacity-80">
              Gia nhập mạng lưới tuyển dụng chuyên nghiệp nhất, nơi tài năng hội tụ và cơ hội được lan tỏa.
            </p>
          </div>

          <div className="flex items-center gap-10">
             <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-brand-800 bg-brand-700 flex items-center justify-center overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
                  </div>
                ))}
             </div>
             <p className="text-sm font-bold text-brand-200">Đã có hơn <span className="text-white">25,000+</span> chuyên gia đã tham gia</p>
          </div>
        </div>
      </div>

      {}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 lg:p-24 bg-slate-50">
        <div className="max-w-xl w-full">
          {}
          <div className="lg:hidden flex justify-center mb-10">
            <Link to="/" className="flex items-center gap-3">
              <div className="bg-brand-600 p-2 rounded-xl shadow-lg">
                <Briefcase className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tighter">RecruitPro</span>
            </Link>
          </div>

          <div className="mb-12 text-center lg:text-left">
            <h2 className="text-4xl font-bold text-slate-900 tracking-tight mb-4">Tạo tài khoản mới</h2>
            <p className="text-slate-500 font-bold text-lg">Chào mừng bạn đến với cộng đồng RecruitPro</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 ml-1 uppercase tracking-widest">Họ và tên</label>
                <div className="relative group">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-600 transition-colors" size={20} />
                  <input
                    type="text"
                    required
                    className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-600 transition-all font-bold text-slate-900 placeholder:text-slate-300 shadow-sm"
                    placeholder="Nguyễn Văn A"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 ml-1 uppercase tracking-widest">Địa chỉ Email</label>
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-600 transition-colors" size={20} />
                  <input
                    type="email"
                    required
                    className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-600 transition-all font-bold text-slate-900 placeholder:text-slate-300 shadow-sm"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 ml-1 uppercase tracking-widest">Mật khẩu bảo mật</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-600 transition-colors" size={20} />
                <input
                  type="password"
                  required
                  className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-600 transition-all font-bold text-slate-900 placeholder:text-slate-300 shadow-sm"
                  placeholder="Tối thiểu 6 ký tự"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-4">
               <label className="text-[11px] font-bold text-slate-400 ml-1 uppercase tracking-widest">Bạn tham gia với vai trò?</label>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'CANDIDATE' })}
                    className={`relative p-6 rounded-2xl border-2 flex items-center gap-4 transition-all duration-300 ${
                      formData.role === 'CANDIDATE' 
                      ? 'border-brand-600 bg-white shadow-xl shadow-brand-100/50' 
                      : 'border-slate-200 bg-white/50 hover:border-slate-300'
                    }`}
                  >
                    <div className={`p-3 rounded-xl transition-colors ${formData.role === 'CANDIDATE' ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                      <GraduationCap size={24} />
                    </div>
                    <div className="text-left">
                      <span className={`block font-bold text-md ${formData.role === 'CANDIDATE' ? 'text-slate-900' : 'text-slate-500'}`}>Ứng viên</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Tìm việc làm</span>
                    </div>
                    {formData.role === 'CANDIDATE' && <CheckCircle2 className="absolute top-3 right-3 text-brand-600" size={18} />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'EMPLOYER' })}
                    className={`relative p-6 rounded-2xl border-2 flex items-center gap-4 transition-all duration-300 ${
                      formData.role === 'EMPLOYER' 
                      ? 'border-brand-600 bg-white shadow-xl shadow-brand-100/50' 
                      : 'border-slate-200 bg-white/50 hover:border-slate-300'
                    }`}
                  >
                    <div className={`p-3 rounded-xl transition-colors ${formData.role === 'EMPLOYER' ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                      <Briefcase size={24} />
                    </div>
                    <div className="text-left">
                      <span className={`block font-bold text-md ${formData.role === 'EMPLOYER' ? 'text-slate-900' : 'text-slate-500'}`}>Nhà tuyển dụng</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Đăng tin tuyển dụng</span>
                    </div>
                    {formData.role === 'EMPLOYER' && <CheckCircle2 className="absolute top-3 right-3 text-brand-600" size={18} />}
                  </button>
               </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-brand-600 text-white rounded-2xl font-bold text-xl shadow-xl shadow-brand-100 hover:bg-brand-700 transition-all duration-300 flex items-center justify-center gap-3 active:scale-[0.98]"
            >
              {loading ? <Loader2 className="animate-spin h-6 w-6" /> : (
                <>
                  Hoàn tất đăng ký
                  <Sparkles size={20} />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-slate-200/50 text-center lg:text-left">
            <p className="text-slate-500 font-bold">
              Đã có tài khoản?{' '}
              <Link to="/login" className="text-brand-600 font-bold hover:text-brand-800 transition-colors relative inline-block group">
                Đăng nhập ngay
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-brand-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

