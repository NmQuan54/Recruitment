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
  Mail,
  Phone,
  ArrowRight,
  Loader2,
  AlertCircle,
  ExternalLink
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
    setLoading(true);
    try {
      const response = await api.get('/employer/applications'); 
      const sorted = response.data.sort((a, b) => {
        const dateA = a.appliedAt ? new Date(a.appliedAt) : new Date(0);
        const dateB = b.appliedAt ? new Date(b.appliedAt) : new Date(0);
        return dateB - dateA;
      });
      setApplications(sorted);
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

  const handleDownload = async (url, candidateName) => {
    if (!url) {
      toast.error('Không tìm thấy đường dẫn CV');
      return;
    }
    
    // Check if it's an absolute URL
    if (url.startsWith('http')) {
        // Just open in new tab for external URLs
        window.open(url, '_blank');
        return;
    }

    toast.loading('Đang tải file...', { id: 'downloading' });
    try {
      const response = await api.get(url, { responseType: 'blob' });
      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      
      const link = document.createElement('a');
      link.href = blobUrl;
      
      const extension = url.split('.').pop();
      link.download = `CV_${candidateName.replace(/\s+/g, '_')}.${extension}`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      toast.success('Tải xuống thành công', { id: 'downloading' });
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Lỗi khi tải file. Đang thử mở trong tab mới...', { id: 'downloading' });
      window.open(url, '_blank');
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
                <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center text-brand-600 shadow-inner group-hover:scale-110 transition-transform duration-500">
                   <User size={40} />
                </div>

                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                     <div>
                        <h2 className="text-2xl font-black text-slate-900 mb-1 group-hover:text-brand-600 transition-colors">{app.candidate?.fullName}</h2>
                        <p className="text-brand-500 font-bold text-sm uppercase tracking-widest">{app.candidate?.title || 'Ứng viên'}</p>
                     </div>
                     <span className={`px-5 py-2 rounded-2xl text-xs font-black uppercase tracking-widest ${
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
                     {app.resumeUrl && app.resumeUrl !== 'ONLINE_PROFILE' && (
                        <button 
                          onClick={() => handleDownload(app.resumeUrl, app.candidate?.fullName || 'Ung_Vien')}
                          className="px-8 py-3 bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-xl flex items-center gap-2 hover:bg-brand-600 transition-all active:scale-95"
                        >
                          <Download size={16} /> Hồ sơ (CV)
                        </button>
                      )}
                     
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
          <div className="text-center py-20 bg-white rounded-[3rem] border border-slate-50 shadow-xl">
             <div className="bg-slate-50 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-slate-200">
                <AlertCircle size={48} />
             </div>
             <h3 className="text-2xl font-bold text-slate-900 mb-2">Chưa có ứng tuyển nào</h3>
             <p className="text-slate-500 font-bold">Hãy cập nhật tin tuyển dụng để thu hút nhân tài!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllApplications;
