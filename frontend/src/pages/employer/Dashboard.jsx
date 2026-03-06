import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { 
  PlusCircle, 
  Users, 
  Briefcase, 
  CheckCircle, 
  Clock, 
  Edit,
  Trash2,
  Loader2,
  Megaphone,
  Building2,
  XCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const EmployerDashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ active: 0, totalApplicants: 0 });

  useEffect(() => {
    const fetchEmployerData = async () => {
      try {
        const response = await api.get('/employer/jobs');
        const jobsData = response.data;
        setJobs(jobsData);
        
        
        const active = jobsData.filter(j => j.status === 'ACTIVE').length;
        const totalApps = jobsData.reduce((acc, current) => acc + (current.applicantCount || 0), 0);
        
        setStats({ active, totalApplicants: totalApps });
      } catch (error) {
        console.error('Error fetching employer jobs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployerData();
  }, []);

  const handleTogglePromotion = async (jobId) => {
    try {
      await api.post(`/employer/jobs/${jobId}/promote`);
      setJobs(prevJobs => prevJobs.map(job => 
        job.id === jobId ? { ...job, isPromoted: !job.isPromoted } : job
      ));
      toast.success('Đã cập nhật trạng thái quảng cáo');
    } catch (error) {
      console.error('Error toggling promotion:', error);
      toast.error('Không thể cập nhật quảng cáo');
    }
  };

  const handleToggleStatus = async (jobId, currentStatus) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'CLOSED' : 'ACTIVE';
    try {
      await api.put(`/employer/jobs/${jobId}/status?status=${newStatus}`);
      setJobs(prevJobs => prevJobs.map(job =>
        job.id === jobId ? { ...job, status: newStatus } : job
      ));
      toast.success(newStatus === 'ACTIVE' ? 'Đã kích hoạt tin tuyển dụng' : 'Đã tạm ngừng tin tuyển dụng');
    } catch (error) {
      toast.error('Không thể thay đổi trạng thái tin');
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <Loader2 className="animate-spin text-brand-600 mb-4" size={40} />
      <p className="font-bold text-slate-400">Đang tải dữ liệu quản trị...</p>
    </div>
  );

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 pt-32 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
           <h1 className="text-3xl font-bold text-slate-900 mb-2">Quản lý tuyển dụng</h1>
           <p className="text-slate-500 font-medium ">Chào mừng trở lại, {user.fullName}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/employer/company"
            className="border-2 border-slate-200 text-slate-700 px-6 py-4 rounded-2xl font-bold hover:border-brand-600 hover:text-brand-600 transition flex items-center gap-2"
          >
            <Building2 size={18} /> Hồ sơ công ty
          </Link>
          <Link 
            to="/employer/post-job"
            className="bg-brand-600 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-brand-100 hover:bg-slate-900 transition flex items-center gap-2"
          >
            <PlusCircle size={20} /> Đăng tin mới
          </Link>
        </div>
      </div>

      {}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 flex items-center gap-6 shadow-sm">
           <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600">
              <Briefcase size={32} />
           </div>
           <div>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Tin đang chạy</p>
              <h3 className="text-3xl font-bold text-slate-900">{stats.active}</h3>
           </div>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 flex items-center gap-6 shadow-sm">
           <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
              <Users size={32} />
           </div>
           <div>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Tổng hồ sơ</p>
              <h3 className="text-3xl font-bold text-slate-900">{stats.totalApplicants}</h3>
           </div>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 flex items-center gap-6 shadow-sm">
           <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
              <Clock size={32} />
           </div>
           <div>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Đang chờ duyệt</p>
              <h3 className="text-3xl font-bold text-slate-900">0</h3>
           </div>
        </div>
      </div>

      {}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
         <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
            <h2 className="font-bold text-xl text-slate-900">Danh sách tin đã đăng</h2>
         </div>
         
         {jobs.length > 0 ? (
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead>
                    <tr className="text-slate-400 text-xs font-bold uppercase tracking-widest border-b border-slate-50">
                       <th className="px-8 py-5">Chức danh</th>
                       <th className="px-8 py-5 text-center">Trạng thái</th>
                       <th className="px-8 py-5 text-center">Ứng viên</th>
                       <th className="px-8 py-5 text-center">Quảng cáo</th>
                       <th className="px-8 py-5 text-center">Ngày đăng</th>
                       <th className="px-8 py-5 text-right">Hành động</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {jobs.map(job => (
                      <tr key={job.id} className="hover:bg-slate-50/80 transition group">
                         <td className="px-8 py-6">
                            <p className="font-bold text-slate-900 group-hover:text-brand-600 transition">{job.title}</p>
                            <p className="text-xs text-slate-400 font-medium ">{job.location}</p>
                         </td>
                         <td className="px-8 py-6">
                            <div className="flex justify-center">
                               <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider  ${
                                 job.status === 'ACTIVE' 
                                 ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                                 : 'bg-slate-100 text-slate-500 border border-slate-200'
                               }`}>
                                 {job.status}
                               </span>
                            </div>
                         </td>
                         <td className="px-8 py-6 text-center font-bold text-slate-900">
                            {job.applicantCount || 0}
                         </td>
                         <td className="px-8 py-6 text-center">
                             <button 
                               onClick={() => handleTogglePromotion(job.id)}
                               className={`p-2 rounded-xl transition ${
                                 job.isPromoted 
                                 ? 'text-amber-600 bg-amber-50 cursor-pointer' 
                                 : 'text-slate-300 hover:text-slate-400 cursor-pointer'
                               }`}
                               title={job.isPromoted ? "Đang quảng cáo" : "Chưa quảng cáo"}
                             >
                                <Megaphone size={20} fill={job.isPromoted ? "currentColor" : "none"} />
                             </button>
                          </td>
                         <td className="px-8 py-6 text-center text-sm font-bold text-slate-500 ">
                            {new Date(job.createdAt).toLocaleDateString()}
                         </td>
                         <td className="px-8 py-6 text-right">
                             <div className="flex justify-end gap-2 opacity-40 group-hover:opacity-100 transition">
                                <Link to={`/employer/jobs/${job.id}/applicants`} className="p-2.5 text-brand-600 hover:bg-brand-50 rounded-xl transition" title="Xem ứng viên">
                                   <Users size={18} />
                                </Link>
                                <Link to={`/employer/jobs/${job.id}/edit`} className="p-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition" title="Chỉnh sửa">
                                   <Edit size={18} />
                                </Link>
                                <button 
                                  onClick={() => handleToggleStatus(job.id, job.status)}
                                  className="p-2.5 text-amber-500 hover:bg-amber-50 rounded-xl transition"
                                  title={job.status === 'ACTIVE' ? 'Tạm ngừng' : 'Kích hoạt lại'}
                                >
                                   <XCircle size={18} />
                                </button>
                             </div>
                          </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
         ) : (
           <div className="p-20 text-center">
              <div className="bg-slate-100 w-20 h-20 rounded-3xl mx-auto flex items-center justify-center mb-6 text-slate-300">
                 <Briefcase size={40} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Bạn chưa đăng tin nào</h3>
              <p className="text-slate-500 font-medium mb-8 ">Bắt đầu tìm kiếm nhân tài ngay hôm nay!</p>
              <Link to="/employer/post-job" className="text-brand-600 font-bold border-2 border-brand-600 px-8 py-3 rounded-2xl hover:bg-brand-600 hover:text-white transition inline-block">Đăng tin đầu tiên</Link>
           </div>
         )}
      </div>
    </div>
  );
};

export default EmployerDashboard;


