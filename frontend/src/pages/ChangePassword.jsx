import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { KeyRound, Eye, EyeOff, ChevronLeft, Loader2, CheckCircle2, ShieldCheck } from 'lucide-react';

const ChangePassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.currentPassword) errs.currentPassword = 'Vui lòng nhập mật khẩu hiện tại';
    if (!form.newPassword || form.newPassword.length < 6)
      errs.newPassword = 'Mật khẩu mới phải có ít nhất 6 ký tự';
    if (form.newPassword !== form.confirmPassword)
      errs.confirmPassword = 'Xác nhận mật khẩu không khớp';
    if (form.newPassword === form.currentPassword)
      errs.newPassword = 'Mật khẩu mới phải khác mật khẩu hiện tại';
    return errs;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      const res = await api.put('/user/change-password', {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      setDone(true);
      toast.success('Đổi mật khẩu thành công!');
      setTimeout(() => navigate(-1), 2000);
    } catch (err) {
      const msg = err.response?.data?.error || 'Có lỗi xảy ra. Vui lòng thử lại.';
      toast.error(msg);
      if (msg.includes('hiện tại')) {
        setErrors({ currentPassword: msg });
      }
    } finally {
      setLoading(false);
    }
  };

  const PasswordInput = ({ name, label, value, showState, toggleShow }) => (
    <div className="space-y-2">
      <label className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider">
        {label}
      </label>
      <div className="relative">
        <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input
          type={showState ? 'text' : 'password'}
          name={name}
          value={value}
          onChange={handleChange}
          placeholder="••••••••"
          className={`w-full pl-12 pr-12 py-4 bg-slate-50 border-2 rounded-2xl focus:ring-0 transition font-bold
            ${errors[name]
              ? 'border-red-300 focus:border-red-500 bg-red-50'
              : 'border-transparent focus:border-brand-500'
            }`}
        />
        <button
          type="button"
          onClick={toggleShow}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
        >
          {showState ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {errors[name] && (
        <p className="text-sm font-bold text-red-500 ml-1">{errors[name]}</p>
      )}
    </div>
  );

  return (
    <div className="w-full px-4 pt-32 pb-16">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 font-bold mb-8 hover:text-brand-600 transition group"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition" />
        Quay lại
      </button>

      <div className="bg-white rounded-[3rem] shadow-2xl shadow-brand-100/20 p-8 md:p-12 border border-slate-50">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-brand-50 rounded-[1.75rem] mx-auto flex items-center justify-center mb-6">
            <ShieldCheck size={36} className="text-brand-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2 ">Đổi mật khẩu</h1>
          <p className="text-slate-500 font-medium">Hãy tạo một mật khẩu mạnh để bảo vệ tài khoản của bạn</p>
        </div>

        {done ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-emerald-50 rounded-full mx-auto flex items-center justify-center mb-6">
              <CheckCircle2 size={48} className="text-emerald-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Thành công!</h2>
            <p className="text-slate-500 font-medium">Mật khẩu của bạn đã được cập nhật. Đang chuyển hướng...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <PasswordInput
              name="currentPassword"
              label="Mật khẩu hiện tại"
              value={form.currentPassword}
              showState={showCurrent}
              toggleShow={() => setShowCurrent(!showCurrent)}
            />

            <div className="pt-2 border-t border-slate-100" />

            <PasswordInput
              name="newPassword"
              label="Mật khẩu mới"
              value={form.newPassword}
              showState={showNew}
              toggleShow={() => setShowNew(!showNew)}
            />

            {/* Strength hint */}
            {form.newPassword.length > 0 && (
              <div className="ml-1">
                <div className="flex gap-1.5 mb-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                        form.newPassword.length >= i * 3
                          ? form.newPassword.length >= 12 ? 'bg-emerald-500'
                          : form.newPassword.length >= 8 ? 'bg-amber-400'
                          : 'bg-red-400'
                          : 'bg-slate-200'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs font-bold text-slate-400">
                  {form.newPassword.length < 6 ? 'Quá ngắn'
                    : form.newPassword.length < 8 ? 'Yếu'
                    : form.newPassword.length < 12 ? 'Trung bình'
                    : 'Mạnh'}
                </p>
              </div>
            )}

            <PasswordInput
              name="confirmPassword"
              label="Xác nhận mật khẩu mới"
              value={form.confirmPassword}
              showState={showConfirm}
              toggleShow={() => setShowConfirm(!showConfirm)}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-brand-600 text-white rounded-2xl font-bold text-xl shadow-2xl shadow-brand-200 hover:bg-slate-900 transition flex items-center justify-center gap-3 mt-4"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <><ShieldCheck size={22} /> Cập nhật mật khẩu</>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ChangePassword;


