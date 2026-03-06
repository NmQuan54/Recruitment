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
  AlertCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

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
                <span className={`px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                  job.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                }`}>
                  {job.status === 'ACTIVE' ? 'Đang hoạt động' : 'Đã đóng'}
                </span>
              </div>
              <div className="flex flex-wrap justify-center lg:justify-start gap-4 lg:gap-6 text-slate-500 font-medium text-sm">
                <span className="flex items-center gap-1.5"><MapPin size={16} /> {job.location}</span>
                <span className="flex items-center gap-1.5"><Clock size={16} /> Hạn: {new Date(job.deadline).toLocaleDateString('vi-VN')}</span>
                <span className="flex items-center gap-1.5 text-brand-600 font-bold"><Users size={16} /> {job.applicantCount || 0} ứng viên</span>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3 w-full lg:w-auto mt-2 lg:mt-0">
              <button 
                onClick={() => navigate(`/employer/jobs/${job.id}/applicants`)}
                className="p-3.5 bg-slate-50 text-slate-600 rounded-xl hover:bg-brand-50 hover:text-brand-600 transition-colors"
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
    </div>
  );
};

export default ManageJobs;


