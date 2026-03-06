import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Megaphone, Briefcase, TrendingUp, Star, Zap, CheckCircle, Loader2, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const PLANS = [
  {
    id: 'basic',
    name: 'Cơ bản',
    price: '299.000',
    duration: '7 ngày',
    color: 'from-slate-400 to-slate-500',
    icon: Star,
    features: ['Hiển thị badge "Nổi bật"', 'Ưu tiên xuất hiện đầu danh sách', 'Thống kê lượt xem cơ bản'],
  },
  {
    id: 'pro',
    name: 'Chuyên nghiệp',
    price: '599.000',
    duration: '15 ngày',
    color: 'from-brand-500 to-brand-700',
    icon: Zap,
    badge: 'Phổ biến nhất',
    features: [
      'Hiển thị badge "Nổi bật"',
      'Ưu tiên cao nhất trong danh sách',
      'Hiện trên trang "Cơ hội việc làm"',
      'Gợi ý ưu tiên cho ứng viên phù hợp',
      'Thống kê chi tiết lượt xem & click',
    ],
  },
  {
    id: 'enterprise',
    name: 'Doanh nghiệp',
    price: 'Liên hệ',
    duration: 'Theo nhu cầu',
    color: 'from-amber-400 to-amber-600',
    icon: TrendingUp,
    features: [
      'Tất cả tính năng Chuyên nghiệp',
      'Banner quảng cáo trang chủ',
      'Email marketing đến ứng viên',
      'Hỗ trợ tư vấn tuyển dụng 1-1',
      'Báo cáo tuyển dụng hàng tháng',
    ],
  },
];

const AdsPage = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [promoting, setPromoting] = useState(null);

  const isEmployer = user?.role === 'EMPLOYER';

  useEffect(() => {
    if (!isEmployer) { setLoading(false); return; }
    const fetchJobs = async () => {
      try {
        const res = await api.get('/employer/jobs');
        setJobs(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [isEmployer]);

  const handleTogglePromotion = async (jobId) => {
    setPromoting(jobId);
    try {
      await api.post(`/employer/jobs/${jobId}/promote`);
      setJobs(prev => prev.map(j => j.id === jobId ? { ...j, isPromoted: !j.isPromoted } : j));
      toast.success('Đã cập nhật trạng thái quảng cáo!');
    } catch {
      toast.error('Không thể cập nhật. Vui lòng thử lại.');
    } finally {
      setPromoting(null);
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 pt-32 pb-16">
      {/* Hero Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 rounded-full text-brand-600 font-bold text-xs uppercase tracking-widest mb-6 border border-brand-100">
          <Megaphone size={14} /> Quảng cáo tuyển dụng
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tighter">
          Tiếp cận <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-brand-800">ứng viên tốt hơn</span>
        </h1>
        <p className="text-slate-500 font-medium text-lg max-w-xl mx-auto">
          Tăng khả năng hiển thị tin tuyển dụng và thu hút nhân tài phù hợp nhanh hơn.
        </p>
      </div>

      {/* Pricing Plans */}
      <div className="grid md:grid-cols-3 gap-6 mb-20">
        {PLANS.map((plan) => {
          const Icon = plan.icon;
          return (
            <div key={plan.id} className={`relative bg-white rounded-[2.5rem] border ${plan.id === 'pro' ? 'border-brand-200 shadow-2xl shadow-brand-100 scale-105' : 'border-slate-100 shadow-sm'} p-8 flex flex-col transition-all`}>
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 bg-brand-600 text-white text-xs font-bold rounded-full uppercase tracking-widest">
                  {plan.badge}
                </div>
              )}
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center text-white mb-6 shadow-lg`}>
                <Icon size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">{plan.name}</h3>
              <p className="text-slate-400 text-sm font-bold mb-4">{plan.duration}</p>
              <div className="mb-6">
                <span className="text-3xl font-bold text-slate-900">{plan.price}</span>
                {plan.price !== 'Liên hệ' && <span className="text-slate-400 font-bold"> ₫</span>}
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-600 font-medium">
                    <CheckCircle size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <button className={`w-full py-4 rounded-2xl font-bold transition ${plan.id === 'pro' ? 'bg-brand-600 text-white hover:bg-brand-700 shadow-lg shadow-brand-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                {plan.price === 'Liên hệ' ? 'Liên hệ ngay' : 'Chọn gói này'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Job Promotion Manager (for Employers) */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-xl text-slate-900 flex items-center gap-3"><Megaphone className="text-amber-500" size={22} /> Quản lý quảng cáo của bạn</h2>
            <p className="text-slate-500 text-sm font-medium mt-1">Bật/tắt quảng cáo cho từng tin tuyển dụng</p>
          </div>
          {isEmployer && (
            <Link to="/employer/post-job" className="px-6 py-3 bg-brand-600 text-white rounded-2xl font-bold text-sm hover:bg-brand-700 transition flex items-center gap-2">
              <Briefcase size={16} /> Đăng tin mới
            </Link>
          )}
        </div>

        {!isEmployer ? (
          <div className="p-20 text-center">
            <Lock size={40} className="text-slate-200 mx-auto mb-4" />
            <h3 className="font-bold text-slate-900 mb-2">Chỉ dành cho nhà tuyển dụng</h3>
            <p className="text-slate-400 font-medium text-sm mb-6">Đăng nhập với tài khoản Employer để quản lý quảng cáo.</p>
            <Link to="/login" className="px-8 py-3 bg-brand-600 text-white rounded-2xl font-bold hover:bg-brand-700 transition inline-block">Đăng nhập</Link>
          </div>
        ) : loading ? (
          <div className="p-20 flex justify-center">
            <Loader2 className="animate-spin text-brand-600" size={40} />
          </div>
        ) : jobs.length === 0 ? (
          <div className="p-20 text-center">
            <Briefcase size={40} className="text-slate-200 mx-auto mb-4" />
            <h3 className="font-bold text-slate-900 mb-2">Chưa có tin tuyển dụng nào</h3>
            <p className="text-slate-400 font-medium text-sm mb-6">Hãy đăng tin đầu tiên để bắt đầu quảng cáo.</p>
            <Link to="/employer/post-job" className="px-8 py-3 bg-brand-600 text-white rounded-2xl font-bold hover:bg-brand-700 transition inline-block">Đăng tin ngay</Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {jobs.map(job => (
              <div key={job.id} className="flex items-center justify-between px-8 py-5 hover:bg-slate-50/60 transition group">
                <div className="flex-1">
                  <p className="font-bold text-slate-900 group-hover:text-brand-600 transition">{job.title}</p>
                  <p className="text-xs text-slate-400 font-bold mt-0.5 ">{job.location} · {job.jobType}</p>
                </div>
                <div className="flex items-center gap-4">
                  {job.isPromoted && (
                    <span className="px-3 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold uppercase rounded-full border border-amber-200 tracking-wider">
                      ★ Đang chạy
                    </span>
                  )}
                  <button
                    onClick={() => handleTogglePromotion(job.id)}
                    disabled={promoting === job.id}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition ${
                      job.isPromoted
                        ? 'bg-amber-50 text-amber-600 hover:bg-amber-100 border border-amber-200'
                        : 'bg-slate-100 text-slate-500 hover:bg-brand-50 hover:text-brand-600 border border-slate-200'
                    }`}
                  >
                    {promoting === job.id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Megaphone size={14} fill={job.isPromoted ? 'currentColor' : 'none'} />
                    )}
                    {job.isPromoted ? 'Dừng QC' : 'Chạy QC'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdsPage;


