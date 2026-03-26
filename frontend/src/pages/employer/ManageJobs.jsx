import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  Users, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye,
  EyeOff,
  Plus,
  Loader2,
  AlertCircle,
  Zap,
  TrendingUp,
  XCircle,
  CheckCircle2
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [promotingJob, setPromotingJob] = useState(null);
  const [promotingLoading, setPromotingLoading] = useState(false);
  const [paymentMethod] = useState('ZALOPAY');
  const [promotionPackages, setPromotionPackages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
    fetchPromotionPackages();
  }, []);

  const fetchPromotionPackages = async () => {
    try {
      const res = await api.get('/public/promotion-packages');
      setPromotionPackages(res.data);
    } catch (error) {
      console.error('Failed to fetch promotion packages');
    }
  };

  const fetchJobs = async () => {
    try {
      const response = await api.get('/employer/jobs');
      setJobs(response.data);
    } catch (error) {
      toast.error('Không thể tải danh sách tin đăng');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tin tuyển dụng này?')) {
      try {
        await api.delete(`/employer/jobs/${id}`);
        toast.success('Đã xóa tin tuyển dụng');
        setJobs(jobs.filter(job => job.id !== id));
      } catch (error) {
        toast.error('Không thể xóa tin này');
      }
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/employer/jobs/${id}/status?status=${status}`);
      toast.success('Đã cập nhật trạng thái');
      fetchJobs();
    } catch (error) {
      toast.error('Cập nhật thất bại');
    }
  };

  const handlePromote = async (jobId, packageId) => {
    setPromotingLoading(true);
    try {
      const res = await api.post(`/employer/jobs/${jobId}/promote`, { 
        packageId,
        method: paymentMethod
      });
      if (res.data.paymentUrl) {
        window.location.href = res.data.paymentUrl;
      }
    } catch (error) {
      const msg = error.response?.data?.error || 'Lỗi khi khởi tạo thanh toán';
      toast.error(msg);
    } finally {
      setPromotingLoading(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <Loader2 className="animate-spin text-brand-600 mb-4" size={40} />
      <p className="font-bold text-slate-400">Đang tải danh sách công việc...</p>
    </div>
  );

  return (
    <div className="w-full px-4 pt-32 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2  tracking-tight">Quản lý tin tuyển dụng</h1>
          <p className="text-slate-500 font-bold ">Bạn có {jobs.length} tin đăng đang hoạt động trên hệ thống.</p>
        </div>
        <Link 
          to="/employer/post-job" 
          className="btn-premium px-8 py-4 rounded-3xl flex items-center gap-2 shadow-2xl shadow-brand-100"
        >
          <Plus size={20} /> Đăng tin mới
        </Link>
      </div>

      <div className="grid gap-6">
        {jobs.length > 0 ? jobs.map((job) => (
          <div 
            key={job.id}
            className={`group bg-white rounded-3xl border ${
              job.status === 'ACTIVE' ? 'border-brand-50 shadow-lg' : 'border-slate-200 shadow-sm opacity-75 grayscale-[20%]'
            } p-6 lg:p-8 hover:shadow-xl transition-all duration-300 flex flex-col lg:flex-row items-center gap-6`}
          >
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${
              job.status === 'ACTIVE' ? 'bg-brand-50 text-brand-600' : 'bg-slate-100 text-slate-400'
            }`}>
              <Briefcase size={32} />
            </div>

            <div className="flex-1 min-w-0 text-center lg:text-left">
                <div className="flex flex-wrap justify-center lg:justify-start items-center gap-3 mb-3">
                  <h3 className={`text-xl font-bold truncate ${job.status === 'ACTIVE' ? 'text-slate-900' : 'text-slate-500'}`}>{job.title}</h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      job.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {job.status === 'ACTIVE' ? 'Đang hoạt động' : 'Đã đóng'}
                    </span>
                    
                    {(job.promoted || job.isPromoted) && (
                      <div className="flex items-center gap-1 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 px-3 py-1 rounded-full shadow-sm animate-in fade-in zoom-in duration-500">
                        <Zap size={10} className="text-amber-600 fill-amber-600" />
                        <span className="text-[10px] font-black text-amber-700 uppercase tracking-tighter">
                          {job.promotionPackageName || 'VIP'}
                        </span>
                        <span className="text-[9px] font-bold text-amber-400 mx-1">|</span>
                        <span className="text-[9px] font-black text-amber-600 uppercase">Hết hạn: {new Date(job.promotionExpiry).toLocaleDateString('vi-VN')}</span>
                      </div>
                    )}
                  </div>
                </div>
              <div className="flex flex-wrap justify-center lg:justify-start gap-4 lg:gap-6 text-slate-500 font-medium text-sm">
                <span className="flex items-center gap-1.5"><MapPin size={16} /> {job.location}</span>
                <span className="flex items-center gap-1.5"><Clock size={16} /> Hạn: {new Date(job.deadline).toLocaleDateString('vi-VN')}</span>
                <span className="flex items-center gap-1.5 text-brand-600 font-bold"><Users size={16} /> {job.applicantCount || 0} ứng viên</span>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3 w-full lg:w-auto mt-2 lg:mt-0">
                  {job.status === 'ACTIVE' && (
                    <button 
                      onClick={() => setPromotingJob(job)}
                      className={`px-5 py-3.5 rounded-xl transition-all shadow-md flex items-center gap-2 font-bold text-xs uppercase tracking-widest ${
                        (job.promoted || job.isPromoted)
                        ? 'bg-gradient-to-r from-amber-400 to-orange-600 text-white shadow-orange-100' 
                        : 'bg-brand-600 text-white hover:bg-slate-900 shadow-brand-100'
                      }`}
                    >
                      <TrendingUp size={18} />
                      {(job.promoted || job.isPromoted) ? 'Đang quảng cáo' : 'Đẩy tin ngay'}
                    </button>
                  )}
              <button 
                onClick={() => navigate(`/employer/jobs/${job.id}/applicants`)}
                className="p-3.5 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors"
                title="Xem ứng viên"
              >
                <Users size={20} />
              </button>
              <button 
                onClick={() => navigate(`/employer/jobs/${job.id}/edit`)}
                className="p-3.5 bg-slate-50 text-slate-600 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-colors"
                title="Chỉnh sửa"
              >
                <Edit size={20} />
              </button>
              <button 
                onClick={() => updateStatus(job.id, job.status === 'ACTIVE' ? 'CLOSED' : 'ACTIVE')}
                className={`p-3.5 rounded-xl transition-colors ${
                  job.status === 'ACTIVE' 
                  ? 'bg-amber-50 text-amber-600 hover:bg-amber-100' 
                  : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                }`}
                title={job.status === 'ACTIVE' ? 'Đóng tin' : 'Mở lại tin'}
              >
                {job.status === 'ACTIVE' ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
              <button 
                onClick={() => handleDelete(job.id)}
                className="p-3.5 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-500 hover:text-white hover:shadow-lg hover:shadow-rose-200 transition-all duration-300"
                title="Xóa tin"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        )) : (
          <div className="text-center py-24 bg-slate-50 rounded-[4rem] border-4 border-dashed border-slate-100">
            <AlertCircle size={64} className="mx-auto text-slate-200 mb-6" />
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Chưa có bài đăng nào</h3>
            <p className="text-slate-400 font-bold  mb-8">Bắt đầu thu hút nhân tài bằng cách đăng tin tuyển dụng đầu tiên của bạn.</p>
            <Link to="/employer/post-job" className="btn-premium px-10 py-4 rounded-3xl inline-flex items-center gap-2">
              <Plus size={20} /> Tạo bài đăng ngay
            </Link>
          </div>
        )}
      </div>

      {promotingJob && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-start justify-center p-4 overflow-y-auto pt-20 pb-20">
          <div className="bg-white rounded-[3rem] w-full max-w-2xl p-10 animate-in fade-in zoom-in duration-300 shadow-2xl relative mt-auto mb-auto">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2 font-display">Đẩy tin tuyển dụng</h2>
                <p className="text-slate-500 font-medium  leading-relaxed px-1">Tin của bạn sẽ được hiển thị ưu tiên giúp thu hút gấp 5 lần ứng viên.</p>
              </div>
              <button onClick={() => setPromotingJob(null)} className="p-2 hover:bg-slate-100 rounded-full transition">
                <XCircle size={28} className="text-slate-300" />
              </button>
            </div>

            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-1">Chọn gói quảng cáo</p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {promotionPackages.length > 0 ? (
                promotionPackages.map((plan, idx) => (
                  <button 
                    key={idx}
                    disabled={promotingLoading}
                    onClick={() => plan.id && handlePromote(promotingJob.id, plan.id)}
                    className="relative p-6 rounded-[2rem] border-2 border-slate-100 bg-white hover:border-brand-500 hover:bg-brand-50/10 transition-all group hover:scale-105 active:scale-95 flex flex-col items-center"
                  >
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 bg-slate-100 text-slate-400 group-hover:bg-brand-600 group-hover:text-white shadow-sm transition">
                      <Zap size={24} />
                    </div>
                    <h4 className="font-bold text-slate-900 text-lg mb-1">{plan.name || 'Gói chưa đặt tên'}</h4>
                    <p className="text-xs text-slate-400 font-bold mb-4">{plan.days || 0} Ngày</p>
                    <div className="text-2xl font-black text-slate-900">
                      {(plan.amount || 0).toLocaleString()} <span className="text-xs font-bold text-slate-400">đ</span>
                    </div>
                  </button>
                ))
              ) : (
                <div className="col-span-full py-12 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                   <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Hiện không có gói quảng cáo nào khả dụng.</p>
                </div>
              )}
            </div>

            <div className="bg-brand-50 p-6 rounded-3xl flex items-center gap-4 border border-brand-100 mb-8">
              <div className="bg-white p-3 rounded-2xl shadow-sm">
                <CheckCircle2 className="text-brand-600" size={24} />
              </div>
              <p className="text-sm text-brand-900 font-bold leading-relaxed pr-2">
                Thanh toán an toàn qua ví <span className="text-brand-600">ZaloPay</span>. Giao giao dịch sẽ được xử lý ngay lập tức.
              </p>
            </div>

            {promotingLoading && (
              <div className="text-center py-4 flex flex-col items-center gap-2">
                 <Loader2 className="animate-spin text-brand-600" />
                 <span className="text-xs font-bold text-slate-400 tracking-widest uppercase">Đang mở cổng thanh toán...</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageJobs;


