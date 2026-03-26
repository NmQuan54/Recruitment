import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { 
  FileText, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  History,
  TrendingUp,
  Loader2,
  ChevronRight,
  BookmarkCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';

const CandidateDashboard = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [savedCount, setSavedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [appRes, recRes, savedRes] = await Promise.all([
          api.get('/candidate/applications'),
          api.get('/candidate/jobs/recommendations'),
          api.get('/candidate/saved-jobs')
        ]);
        setApplications(appRes.data || []);
        setRecommendations(recRes.data || []);
        setSavedCount(savedRes.data?.length || 0);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const getStatusInfo = (status) => {
    switch (status) {
      case 'ACCEPTED': return { label: 'Đã chấp nhận', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
      case 'REJECTED': return { label: 'Đã từ chối', color: 'bg-rose-100 text-rose-700 border-rose-200' };
      case 'PENDING': return { label: 'Đang chờ', color: 'bg-amber-100 text-amber-700 border-amber-200' };
      case 'INTERVIEW': return { label: 'Phỏng vấn', color: 'bg-brand-100 text-brand-700 border-brand-200' };
      case 'REVIEWING': return { label: 'Đang xem xét', color: 'bg-blue-100 text-blue-700 border-blue-200' };
      default: return { label: status, color: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <Loader2 className="animate-spin text-brand-600 mb-4" size={40} />
      <p className="font-bold text-slate-400">Đang tải lịch sử ứng tuyển...</p>
    </div>
  );

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 pt-32 pb-10">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Dashboard của bạn</h1>
        <p className="text-slate-500 font-medium">Theo dõi hành trình sự nghiệp cùng RecruitPro</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        {}
        <div className="lg:col-span-2 space-y-8">
           <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                 <History className="text-brand-600" /> Hồ sơ đã nộp
              </h2>
              <span className="text-slate-400 font-bold text-sm tracking-widest uppercase ">{applications.length} Tổng số</span>
           </div>

           {applications.length > 0 ? (
             <div className="space-y-4">
                {applications.map(app => {
                  const statusInfo = getStatusInfo(app.status);
                  return (
                    <div key={app.id} className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 hover:shadow-xl hover:shadow-brand-50 transition group">
                       <div className="flex flex-col md:flex-row justify-between gap-6">
                          <div className="flex-1">
                             <div className="flex items-center gap-2 mb-2">
                                <span className={`px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest  border ${statusInfo.color}`}>
                                   {statusInfo.label}
                                </span>
                                <span className="text-slate-300 text-xs font-bold">• {new Date(app.appliedAt || app.createdAt).toLocaleDateString('vi-VN')}</span>
                             </div>
                             <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-600 transition mb-1">{app.job?.title}</h3>
                             <p className="font-bold text-slate-500 text-sm mb-4">{app.job?.company?.name}</p>
                             
                             {app.status === 'INTERVIEW' && app.interviewDate && (
                               <div className="mb-4 p-4 bg-brand-50 border border-brand-100 rounded-2xl">
                                 <p className="text-brand-700 font-bold text-xs uppercase tracking-widest mb-1 ">Lịch phỏng vấn</p>
                                 <p className="text-slate-900 font-bold text-sm">{new Date(app.interviewDate).toLocaleString()}</p>
                                 {app.interviewNotes && <p className="text-slate-500 text-xs  mt-1">{app.interviewNotes}</p>}
                               </div>
                             )}

                             {app.feedback && (
                               <div className="mb-4 p-5 bg-slate-50 border border-slate-100 rounded-2xl relative overflow-hidden">
                                 <div className="absolute top-0 right-0 w-16 h-16 bg-brand-50 rounded-full -mr-8 -mt-8 opacity-40"></div>
                                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3  flex items-center gap-2">
                                    <CheckCircle2 size={12} className="text-brand-600" /> Phản hồi từ nhà tuyển dụng
                                 </p>
                                 <p className="text-slate-700 font-bold text-sm  leading-relaxed">
                                    "{app.feedback}"
                                 </p>
                               </div>
                             )}

                             <div className="flex items-center gap-4 text-slate-400 text-xs font-medium ">
                                <span className="flex items-center gap-1"><MapPin size={14} /> {app.job?.location}</span>
                                <span className="flex items-center gap-1"><Clock size={14} /> {app.job?.jobType}</span>
                             </div>
                          </div>
                          <div className="flex items-center">
                             <Link 
                               to={`/jobs/${app.job?.id}`} 
                               className="flex items-center justify-center w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl hover:bg-brand-600 hover:text-white transition"
                             >
                               <ChevronRight />
                             </Link>
                          </div>
                       </div>
                    </div>
                  );
                })}
             </div>
           ) : (
             <div className="bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 p-20 text-center">
                <p className="text-slate-400 font-bold text-xl  mb-6 uppercase tracking-widest">Chưa có ứng tuyển nào</p>
                <Link to="/jobs" className="bg-brand-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:bg-slate-900 transition inline-block">Tìm việc ngay bây giờ</Link>
             </div>
           )}
        </div>

        {}
        <div className="space-y-8">
           {}
           <div className="bg-slate-900 p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-600/20 rounded-full blur-3xl group-hover:bg-brand-600/40 transition-all duration-700"></div>
              <div className="relative z-10 flex flex-col items-center text-center">
                 <h3 className="text-xl font-bold text-white mb-2 italic">Xin chào, {user.fullName}!</h3>
                 <p className="text-brand-400 font-bold mb-8 uppercase tracking-[0.3em] text-[10px]">Cùng tìm kiếm bến đỗ tiếp theo nào</p>
                 
                 <div className="w-full flex gap-3 mb-2">
                    <div className="flex-1 bg-white/5 p-5 rounded-3xl backdrop-blur-md flex flex-col items-center border border-white/10 group-hover:border-white/20 transition-all">
                       <span className="text-slate-400 text-[9px] font-black uppercase tracking-widest opacity-60 mb-1">Ứng tuyển</span>
                       <span className="text-2xl font-black text-white">{applications.length}</span>
                    </div>
                    <Link to="/candidate/saved-jobs" className="flex-1 bg-white/5 p-5 rounded-3xl backdrop-blur-md flex flex-col items-center border border-white/10 hover:bg-brand-600/20 hover:border-brand-500 transition-all">
                       <span className="text-brand-400 text-[9px] font-black uppercase tracking-widest opacity-60 mb-1">Đã lưu</span>
                       <span className="text-2xl font-black text-white">{savedCount}</span>
                    </Link>
                  </div>
              </div>
           </div>

           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <h4 className="font-bold text-slate-900 mb-6  uppercase tracking-wider text-sm flex items-center gap-2">
                 <TrendingUp className="text-brand-600" size={18} /> Gợi ý cho bạn
              </h4>
              <div className="space-y-6">
                 {recommendations.length > 0 ? recommendations.map(job => (
                    <Link key={job.id} to={`/jobs/${job.id}`} className="block group decoration-none">
                       <p className="font-bold text-slate-900 text-sm group-hover:text-brand-600 transition tracking-tight">
                         {job.title}
                         {job.isPromoted && <span className="ml-2 text-[8px] bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded ">AD</span>}
                       </p>
                       <p className="text-[10px] text-slate-400 font-bold  uppercase tracking-tighter">{job.company?.name || '---'} • Đang tuyển</p>
                    </Link>
                 )) : (
                    <p className="text-xs text-slate-400 font-medium ">Chưa có gợi ý phù hợp...</p>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;


