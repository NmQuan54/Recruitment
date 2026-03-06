import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { 
  Briefcase, 
  MapPin, 
  Calendar, 
  Download, 
  Clock,
  Loader2,
  AlertCircle,
  Building2,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  FileText,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const CandidateAppliedJobs = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await api.get('/candidate/applications'); 
      setApplications(response.data || []);
    } catch (error) {
      toast.error('Không thể tải danh sách việc làm đã ứng tuyển');
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case 'ACCEPTED': return { label: 'Đã chấp nhận', color: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: <CheckCircle className="w-4 h-4" /> };
      case 'REJECTED': return { label: 'Đã từ chối', color: 'bg-rose-50 text-rose-600 border-rose-100', icon: <XCircle className="w-4 h-4" /> };
      case 'PENDING': return { label: 'Đang chờ', color: 'bg-amber-50 text-amber-600 border-amber-100', icon: <Clock className="w-4 h-4" /> };
      case 'INTERVIEW': return { label: 'Hẹn phỏng vấn', color: 'bg-brand-50 text-brand-600 border-brand-100', icon: <Calendar className="w-4 h-4" /> };
      case 'REVIEWING': return { label: 'Đang xem xét', color: 'bg-blue-50 text-blue-600 border-blue-100', icon: <FileText className="w-4 h-4" /> };
      default: return { label: status, color: 'bg-slate-50 text-slate-600 border-slate-100', icon: <Clock className="w-4 h-4" /> };
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <Loader2 className="animate-spin text-brand-600 mb-4" size={40} />
      <p className="font-bold text-slate-400 uppercase tracking-widest text-sm">Đang tải lịch sử ứng tuyển...</p>
    </div>
  );

  return (
    <div className="w-full px-4 pt-32 pb-20">
      <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2 tracking-tight">Việc làm đã ứng tuyển</h1>
          <p className="text-slate-500 font-bold">Theo dõi trạng thái của {applications.length} hồ sơ bạn đã gửi đi.</p>
        </div>
        <Link to="/jobs" className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-brand-600 transition shadow-xl">
          Tìm việc thêm
        </Link>
      </div>

      <div className="grid gap-8">
        {applications.length > 0 ? applications.map((app) => {
          const statusInfo = getStatusInfo(app.status);
          return (
            <div 
              key={app.id}
              className="group bg-white rounded-[3rem] border border-slate-100 p-8 shadow-xl hover:shadow-brand-500/10 transition-all duration-500 relative overflow-hidden"
            >
               <div className="flex flex-col lg:flex-row gap-10 items-start">
                  {}
                  <div className="w-24 h-24 bg-white border border-slate-100 rounded-3xl p-4 flex items-center justify-center shrink-0 shadow-sm transition-transform">
                     {app.job?.company?.logoUrl ? (
                       <img src={app.job.company.logoUrl} alt={app.job.company.name} className="w-full h-full object-contain" />
                     ) : (
                       <Building2 size={32} className="text-brand-300" />
                     )}
                  </div>

                  <div className="flex-1 min-w-0">
                     <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest  border ${statusInfo.color}`}>
                           {statusInfo.label}
                        </span>
                        <span className="text-slate-400 text-xs font-bold font-mono">ID: {app.id.toString().padStart(6, '0')}</span>
                     </div>

                     <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-brand-600 transition leading-tight">
                       {app.job?.title}
                     </h3>
                     <p className="text-brand-600 font-bold mb-6 flex items-center gap-2">
                       {app.job?.company?.name}
                       <Link to={`/companies/${app.job?.company?.id}`} className="text-slate-300 hover:text-brand-400"><ExternalLink size={14}/></Link>
                     </p>

                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8 mb-8 text-slate-500 font-bold text-sm">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400"><MapPin size={16} /></div>
                           <span className="truncate">{app.job?.location}</span>
                        </div>
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400"><Calendar size={16} /></div>
                           <span>Đã nộp: {new Date(app.appliedAt).toLocaleDateString('vi-VN')}</span>
                        </div>
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400"><Briefcase size={16} /></div>
                           <span>Loại hình: {app.job?.jobType}</span>
                        </div>
                     </div>

                     {app.status === 'INTERVIEW' && app.interviewDate && (
                        <div className="bg-brand-600 p-6 rounded-[2rem] text-white mb-8 shadow-xl shadow-brand-100 animate-pulse-slow">
                           <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2 opacity-80">Thông báo phỏng vấn</h4>
                           <p className="text-lg font-bold mb-1">Thời gian: {new Date(app.interviewDate).toLocaleString('vi-VN')}</p>
                           {app.interviewNotes && <p className="text-sm font-bold opacity-90">"{app.interviewNotes}"</p>}
                        </div>
                     )}

                     {app.feedback && (
                        <div className="bg-slate-50 p-6 rounded-[2rem] border-2 border-slate-100 mb-8 relative">
                           <div className="absolute top-4 right-6 text-brand-200">
                             <MessageSquare size={32} />
                           </div>
                           <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-3">Phản hồi của Employer</h4>
                           <p className="text-slate-700 font-bold text-sm leading-relaxed">"{app.feedback}"</p>
                        </div>
                     )}

                     <div className="flex flex-wrap gap-4">
                        <Link 
                          to={`/jobs/${app.job?.id}`}
                          className="px-8 py-3 bg-slate-900 text-white font-bold text-xs uppercase tracking-widest rounded-2xl flex items-center gap-2 hover:bg-brand-600 transition-all shadow-lg active:scale-95"
                        >
                          Xem tin tuyển dụng <ChevronRight size={16} />
                        </Link>
                        {app.resumeUrl && (
                          <a 
                            href={app.resumeUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="px-8 py-3 bg-white border-2 border-slate-100 text-slate-900 font-bold text-xs uppercase tracking-widest rounded-2xl flex items-center gap-2 hover:border-brand-600 hover:text-brand-600 transition-all active:scale-95"
                          >
                            <Download size={16} /> Xem CV đã nộp
                          </a>
                        )}
                        <Link 
                          to="/messages"
                          className="px-8 py-3 bg-brand-50 text-brand-600 font-bold text-xs uppercase tracking-widest rounded-2xl flex items-center gap-2 hover:bg-brand-600 hover:text-white transition-all active:scale-95"
                        >
                          <MessageSquare size={16} /> Liên hệ Chat
                        </Link>
                     </div>
                  </div>
               </div>
               
               {}
               <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-brand-500/5 rounded-full blur-3xl group-hover:bg-brand-500/10 transition-colors"></div>
            </div>
          );
        }) : (
          <div className="text-center py-32 bg-slate-50 rounded-[4rem] border-4 border-dashed border-slate-200">
            <AlertCircle size={80} className="mx-auto text-slate-200 mb-8" />
            <h3 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">Chưa có ứng tuyển nào</h3>
            <p className="text-slate-400 font-bold mb-10 text-lg uppercase tracking-widest">Hãy bắt đầu hành trình sự nghiệp ngay thôi!</p>
            <Link to="/jobs" className="btn-premium px-12 py-5 rounded-[2rem] text-lg font-bold shadow-2xl">
              Khám phá việc làm ngay
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateAppliedJobs;


