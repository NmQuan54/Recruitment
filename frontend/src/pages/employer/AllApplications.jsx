import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { 
  User, 
  Briefcase, 
  MapPin, 
  Calendar, 
  Download, 
  CheckCircle, 
  XCircle, 
  Clock,
  Loader2,
  AlertCircle,
  Mail,
  Phone,
  ArrowRight
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const AllApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await api.get('/employer/applications'); 
      setApplications(response.data);
    } catch (error) {
      toast.error('Không thể tải danh sách ứng viên');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (applicationId, status) => {
    try {
      await api.put(`/employer/applications/${applicationId}/status?status=${status}`);
      toast.success('Đã cập nhật trạng thái');
      fetchApplications();
    } catch (error) {
      toast.error('Lỗi khi cập nhật trạng thái');
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <Loader2 className="animate-spin text-brand-600 mb-4" size={40} />
      <p className="font-bold text-slate-400">Đang tải danh sách ứng viên...</p>
    </div>
  );

  return (
    <div className="w-full px-4 pt-32 pb-20">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-2  tracking-tight">Tất cả ứng tuyển</h1>
        <p className="text-slate-500 font-bold  h-6">Bạn đang nhận được {applications.length} lượt ứng tuyển cho tất cả các vị trí.</p>
      </div>

      <div className="grid gap-6">
        {applications.length > 0 ? applications.map((app) => (
          <div 
            key={app.id}
            className="group bg-white rounded-[3rem] border border-slate-50 p-8 shadow-xl hover:shadow-brand-500/5 transition-all duration-500"
          >
            <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start">
               {/* Candidate Info */}
               <div className="w-20 h-20 bg-brand-50 rounded-full flex items-center justify-center text-brand-600 shrink-0 shadow-inner group-hover:scale-110 transition-transform">
                  <User size={36} />
               </div>

               <div className="flex-1 min-w-0 text-center lg:text-left">
                  <div className="flex flex-wrap justify-center lg:justify-start items-center gap-3 mb-4">
                     <h3 className="text-2xl font-bold text-slate-900">{app.candidate?.fullName || 'Ứng viên'}</h3>
                     <span className={`px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                        app.status === 'PENDING' ? 'bg-amber-50 text-amber-600' :
                        app.status === 'ACCEPTED' ? 'bg-emerald-50 text-emerald-600' :
                        app.status === 'REJECTED' ? 'bg-red-50 text-red-600' :
                        'bg-blue-50 text-blue-600'
                     }`}>
                        {app.status === 'PENDING' ? 'Mới ứng tuyển' :
                         app.status === 'ACCEPTED' ? 'Chấp nhận' :
                         app.status === 'REJECTED' ? 'Từ chối' :
                         'Xét duyệt'}
                     </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-slate-500 font-bold text-sm">
                     <div className="flex items-center justify-center lg:justify-start gap-2">
                        <Briefcase size={16} className="text-brand-400" />
                        <span className="truncate">Vị trí: <span className="text-slate-900">{app.job?.title}</span></span>
                     </div>
                     <div className="flex items-center justify-center lg:justify-start gap-2">
                        <Calendar size={16} className="text-brand-400" />
                        <span>Ngày nộp: {new Date(app.appliedAt).toLocaleDateString('vi-VN')}</span>
                     </div>
                     <div className="flex items-center justify-center lg:justify-start gap-2">
                        <Mail size={16} className="text-brand-400" />
                        <span>{app.candidate?.email}</span>
                     </div>
                     <div className="flex items-center justify-center lg:justify-start gap-2">
                        <Phone size={16} className="text-brand-400" />
                        <span>{app.candidate?.phoneNumber || 'N/A'}</span>
                     </div>
                  </div>

                  {app.coverLetter && (
                    <div className="bg-slate-50 p-6 rounded-3xl text-sm font-bold text-slate-500  mb-6">
                       "{app.coverLetter.substring(0, 200)}..."
                    </div>
                  )}

                  <div className="flex flex-wrap justify-center lg:justify-start gap-4 h-12">
                     <a 
                       href={app.resumeUrl} 
                       target="_blank" 
                       rel="noreferrer"
                       className="px-6 py-2.5 bg-slate-900 text-white font-bold text-xs uppercase tracking-widest rounded-2xl shadow-xl flex items-center gap-2 hover:bg-brand-600 transition-colors"
                     >
                       <Download size={16} /> Hồ sơ (CV)
                     </a>
                     
                     {app.status === 'PENDING' && (
                       <>
                         <button 
                           onClick={() => updateStatus(app.id, 'ACCEPTED')}
                           className="px-6 py-2.5 bg-emerald-500 text-white font-bold text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-emerald-200 flex items-center gap-2 hover:bg-emerald-600 transition-all active:scale-95"
                         >
                           <CheckCircle size={16} /> Chấp nhận
                         </button>
                         <button 
                           onClick={() => updateStatus(app.id, 'REJECTED')}
                           className="px-6 py-2.5 bg-white border border-red-200 text-red-500 font-bold text-xs uppercase tracking-widest rounded-2xl flex items-center gap-2 hover:bg-red-50 transition-all active:scale-95"
                         >
                           <XCircle size={16} /> Từ chối
                         </button>
                       </>
                     )}
                  </div>
               </div>
               
               <button 
                 onClick={() => navigate(`/employer/jobs/${app.job?.id}/applicants`)}
                 className="lg:self-center p-4 bg-brand-50 text-brand-600 rounded-2xl hover:bg-brand-600 hover:text-white transition-all duration-300"
                 title="Xem tất cả ứng viên của tin này"
               >
                 <ArrowRight size={24} />
               </button>
            </div>
          </div>
        )) : (
          <div className="text-center py-20 bg-slate-50 rounded-[4rem] border-4 border-dashed border-slate-100">
            <AlertCircle size={64} className="mx-auto text-slate-200 mb-6" />
            <h3 className="text-2xl font-bold text-slate-900 mb-2 ">Chưa có lượt ứng tuyển</h3>
            <p className="text-slate-400 font-bold ">Hãy tiếp tục chia sẻ bài đăng để thu hút nhân tài.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllApplications;


