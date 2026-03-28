import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { 
  Users, 
  Download, 
  CheckCircle, 
  XCircle, 
  Clock, 
  ChevronLeft,
  Mail,
  Phone,
  ArrowRight,
  Loader2,
  Calendar,
  MessageSquare,
  ExternalLink,
  X
} from 'lucide-react';

const JobApplicants = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const [appRes, jobRes] = await Promise.all([
          api.get(`/employer/jobs/${jobId}/applications`),
          api.get(`/jobs/${jobId}`)
        ]);
        setApplications(appRes.data.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt)));
        setJob(jobRes.data);
      } catch (error) {
        toast.error('Có lỗi xảy ra khi tải danh sách ứng viên');
      } finally {
        setLoading(false);
      }
    };
    fetchApplicants();
  }, [jobId]);

  const [schedulingApp, setSchedulingApp] = useState(null);
  const [slots, setSlots] = useState([{ startTime: '', endTime: '' }]);
  const [interviewNotes, setInterviewNotes] = useState('');
  const [drafts, setDrafts] = useState({}); // Stores drafts per application ID: { appId: { slots, notes } }

  // Sync draft whenever slots or notes change
  useEffect(() => {
    if (schedulingApp) {
      setDrafts(prev => ({
        ...prev,
        [schedulingApp]: { slots, notes: interviewNotes }
      }));
    }
  }, [slots, interviewNotes, schedulingApp]);

  // Fetch or restore from draft when opening modal
  useEffect(() => {
    if (schedulingApp) {
      // 1. Use draft if available
      if (drafts[schedulingApp]) {
        setSlots(drafts[schedulingApp].slots);
        setInterviewNotes(drafts[schedulingApp].notes);
        return;
      }

      // 2. Otherwise load from applications list (for notes)
      const app = applications.find(a => a.id === schedulingApp);
      if (app) setInterviewNotes(app.interviewNotes || '');
      
      // 3. And fetch slots from server
      const fetchExistingSlots = async () => {
        try {
          const res = await api.get(`/employer/applications/${schedulingApp}/slots`);
          if (res.data && res.data.length > 0) {
            const formatted = res.data.map(s => {
              const dStart = new Date(s.startTime);
              const dEnd = new Date(s.endTime);
              const tzOffset = dStart.getTimezoneOffset() * 60000;
              return {
                startTime: new Date(dStart.getTime() - tzOffset).toISOString().slice(0, 16),
                endTime: new Date(dEnd.getTime() - tzOffset).toISOString().slice(0, 16)
              };
            });
            setSlots(formatted);
          } else {
            setSlots([{ startTime: '', endTime: '' }]);
          }
        } catch (error) {
          console.error('Error fetching slots:', error);
          setSlots([{ startTime: '', endTime: '' }]);
        }
      };
      fetchExistingSlots();
    }
  }, [schedulingApp, applications]);

  const [feedbackApp, setFeedbackApp] = useState(null); // { appId, status }
  const [feedbackContent, setFeedbackContent] = useState('');

  const handleScheduleInterview = async () => {
    try {
      const validSlots = slots.filter(s => s.startTime && s.endTime);
      if (validSlots.length === 0) {
        toast.error('Vui lòng chọn ít nhất một khung giờ phỏng vấn');
        return;
      }
      
      await api.post(`/employer/applications/${schedulingApp}/slots`, {
        slots: validSlots,
        notes: interviewNotes
      });
      
      // Also update application status to REVIEWING or handle a specific status if needed
      // Actually the service already handles notification. 
      // Let's also update the local state.
      setApplications(prev => prev.map(app => 
        app.id === schedulingApp ? { ...app, status: 'REVIEWING', interviewNotes: interviewNotes } : app
      ));
      
      toast.success('Đã gửi các khung giờ phỏng vấn cho ứng viên!');
      setSchedulingApp(null);
    } catch (error) {
      console.error('Error scheduling interview:', error);
      const errorMsg = error.response?.data?.message || 'Lỗi khi gửi khung giờ phỏng vấn';
      toast.error(errorMsg);
    }
  };

  const addSlot = () => setSlots([...slots, { startTime: '', endTime: '' }]);
  const removeSlot = (index) => setSlots(slots.filter((_, i) => i !== index));
  const updateSlot = (index, field, value) => {
    const newSlots = [...slots];
    newSlots[index][field] = value;
    setSlots(newSlots);
  };

  const updateStatus = async (appId, newStatus, feedback = '') => {
    try {
      await api.put(`/employer/applications/${appId}/status`, null, { 
        params: { status: newStatus, feedback: feedback } 
      });
      toast.success('Cập nhật trạng thái thành công!');
      setApplications(prev => prev.map(app => 
        app.id === appId ? { ...app, status: newStatus, feedback: feedback } : app
      ));
      setFeedbackApp(null);
      setFeedbackContent('');
    } catch (error) {
      toast.error('Lỗi khi cập nhật trạng thái');
    }
  };


  const handleDownload = async (url, candidateName) => {
    if (!url) {
      toast.error('Không tìm thấy đường dẫn CV');
      return;
    }
    
    try {
      toast.loading('Đang chuẩn bị tải xuống...', { id: 'downloading' });
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response was not ok');
      
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
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

  const handleOpenFeedbackModal = (appId, status) => {
    setFeedbackApp({ appId, status });
    setFeedbackContent('');
  };

  const handleChat = (candidateUserId) => {
    if (!candidateUserId) {
      toast.error('Không tìm thấy thông tin tài khoản ứng viên');
      return;
    }
    navigate(`/messages?candidateId=${candidateUserId}`);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'ACCEPTED': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'REJECTED': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'PENDING': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'REVIEWING': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'INTERVIEW': return 'bg-brand-100 text-brand-700 border-brand-200';
      default: return 'bg-slate-100 text-slate-500 border-slate-200';
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <Loader2 className="animate-spin text-brand-600 mb-4" size={40} />
      <p className="font-bold text-slate-400">Đang tải danh sách hồ sơ...</p>
    </div>
  );

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 pt-32 pb-10">
      <button 
        onClick={() => navigate('/employer/dashboard')}
        className="flex items-center gap-2 text-slate-500 font-bold mb-8 hover:text-brand-600 transition group"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition" /> Quay lại Dashboard
      </button>

      <div className="mb-10">
         <h1 className="text-3xl font-bold text-slate-900 mb-2">Hồ sơ ứng tuyển</h1>
         <p className="text-slate-500 font-medium">Vị trí: <span className="text-brand-600 font-bold">{job?.title}</span></p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {applications.length > 0 ? (
          applications.map(app => (
            <div key={app.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 hover:shadow-xl hover:shadow-brand-50 transition relative overflow-hidden">
               <div className="absolute top-0 right-0 p-6">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider  border ${getStatusStyle(app.status)}`}>
                    {app.status}
                  </span>
               </div>

               <div className="flex gap-6 mb-8">
                  <div className="w-20 h-20 bg-brand-50 rounded-3xl flex items-center justify-center text-brand-600 text-2xl font-bold ">
                     {app.candidate?.fullName.charAt(0)}
                  </div>
                   <div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-1">{app.candidate?.fullName}</h3>
                      <div className="flex flex-col gap-1 text-slate-500 text-sm font-medium">
                         <span className="flex items-center gap-2"><Mail size={14} /> {app.candidate?.email}</span>
                         <span className="flex items-center gap-2"><Phone size={14} /> {app.candidate?.phone || 'Chưa cập nhật'}</span>
                      </div>
                      <button 
                        onClick={() => handleChat(app.candidate?.id)}
                        className="mt-4 flex items-center gap-2 bg-brand-50 text-brand-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-brand-600 hover:text-white transition"
                      >
                         <MessageSquare size={14} /> Nhắn tin trực tiếp
                      </button>
                   </div>
               </div>

               <div className="space-y-6">
                  {app.interviewDate && (
                    <div className="bg-brand-600 p-6 rounded-[2rem] text-white shadow-xl shadow-brand-100 relative overflow-hidden group">
                       <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl group-hover:bg-white/20 transition-all"></div>
                       <div className="flex items-center gap-4 relative z-10">
                          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                             <Calendar size={22} className="animate-pulse" />
                          </div>
                          <div>
                             <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1 opacity-70">Lịch phỏng vấn chính thức</h4>
                             <p className="text-xl font-black tracking-tight leading-none italic">
                                {new Date(app.interviewDate).toLocaleString('vi-VN', { 
                                   hour: '2-digit', minute: '2-digit', 
                                   day: '2-digit', month: '2-digit', year: 'numeric' 
                                })}
                             </p>
                          </div>
                       </div>
                       {app.interviewNotes && (
                        <div className="mt-4 pt-4 border-t border-white/10 text-xs font-bold opacity-90 italic flex items-start gap-2 max-w-sm">
                           <MessageSquare size={12} className="shrink-0 mt-0.5" />
                           "{app.interviewNotes}"
                        </div>
                       )}
                    </div>
                  )}

                  <div>
                     <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 ">Thư giới thiệu</h4>
                     <p className="text-slate-700 font-medium leading-relaxed bg-slate-50 p-6 rounded-2xl ">
                        "{app.coverLetter}"
                     </p>
                  </div>

                  <div className="flex border-t border-slate-50 pt-6 gap-4">
                     <div className="flex-1 space-y-3">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest ">Thay đổi trạng thái</p>
                        <div className="flex gap-2">
                           <button 
                             onClick={() => updateStatus(app.id, 'REVIEWING')}
                             className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold hover:bg-blue-100 transition"
                           >
                              REVIEWING
                           </button>
                           <button 
                             onClick={() => setSchedulingApp(app.id)}
                             className="px-4 py-2 bg-brand-50 text-brand-600 rounded-xl text-xs font-bold hover:bg-brand-100 transition"
                           >
                              LỊCH PHỎNG VẤN
                           </button>
                           <button 
                              onClick={() => handleOpenFeedbackModal(app.id, 'ACCEPTED')}
                              className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold hover:bg-emerald-100 transition"
                            >
                               CHẤP NHẬN
                            </button>
                            <button 
                              onClick={() => handleOpenFeedbackModal(app.id, 'REJECTED')}
                              className="px-4 py-2 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold hover:bg-rose-100 transition"
                            >
                               TỪ CHỐI
                            </button>
                        </div>
                     </div>
                     <div className="flex items-end">
                        {app.resumeUrl && app.resumeUrl !== 'ONLINE_PROFILE' && (
                           <button onClick={() => handleDownload(app.resumeUrl, app.candidate?.fullName || 'Ung_Vien')} className="flex items-center gap-2 text-brand-600 font-bold text-sm hover:underline">
                             Tải CV <Download size={16} />
                           </button>
                        )}
                     </div>
                  </div>
               </div>
            </div>
          ))
        ) : (
          <div className="lg:col-span-2 py-20 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
             <div className="bg-white w-20 h-20 rounded-3xl mx-auto flex items-center justify-center mb-6 text-slate-200 shadow-lg">
                <Users size={40} />
             </div>
             <h3 className="text-xl font-bold text-slate-900 mb-2">Chưa có ứng viên nào</h3>
             <p className="text-slate-500 font-medium ">Hãy kiên nhẫn, những tài năng đang đến!</p>
          </div>
        )}
      </div>
      {schedulingApp && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl p-10 animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto no-scrollbar relative">
            <button 
              onClick={() => setSchedulingApp(null)}
              className="absolute top-8 right-8 p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition"
            >
              <X size={24} />
            </button>
            <h2 className="text-3xl font-bold text-slate-900 mb-6 font-display">Gửi các khung giờ phỏng vấn</h2>
            <p className="text-slate-500 font-medium mb-8">Ứng viên sẽ chọn 1 trong các khung giờ bạn đề xuất.</p>
            
            <div className="space-y-6">
              <div className="space-y-4">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest ">Các khung giờ đề xuất</label>
                {slots.map((slot, idx) => (
                  <div key={idx} className="flex gap-4 items-end bg-slate-50 p-4 rounded-2xl relative group">
                    <div className="flex-1">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Bắt đầu</label>
                      <input 
                        type="datetime-local" 
                        value={slot.startTime}
                        onChange={(e) => updateSlot(idx, 'startTime', e.target.value)}
                        className="w-full bg-white border-none rounded-xl px-4 py-3 font-bold text-slate-900 focus:ring-2 focus:ring-brand-500 transition"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Kết thúc</label>
                      <input 
                        type="datetime-local" 
                        value={slot.endTime}
                        onChange={(e) => updateSlot(idx, 'endTime', e.target.value)}
                        className="w-full bg-white border-none rounded-xl px-4 py-3 font-bold text-slate-900 focus:ring-2 focus:ring-brand-500 transition"
                      />
                    </div>
                    {slots.length > 1 && (
                      <button 
                        onClick={() => removeSlot(idx)}
                        className="p-3 text-rose-500 hover:bg-rose-50 rounded-xl transition"
                      >
                        <XCircle size={20} />
                      </button>
                    )}
                  </div>
                ))}
                <button 
                  onClick={addSlot}
                  className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold hover:border-brand-500 hover:text-brand-500 transition flex items-center justify-center gap-2"
                >
                  <Clock size={18} /> Thêm khung giờ khác
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 ">Ghi chú bổ sung (Tùy chọn)</label>
                <textarea 
                  value={interviewNotes}
                  onChange={(e) => setInterviewNotes(e.target.value)}
                  placeholder="Ví dụ: Link phỏng vấn Online, phòng họp..."
                  className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-slate-900 focus:ring-2 focus:ring-brand-500 transition h-24"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => {
                    setSchedulingApp(null);
                  }}
                  className="flex-1 px-8 py-4 bg-slate-100 text-slate-500 rounded-2xl font-bold hover:bg-slate-200 transition"
                >
                  Hủy bỏ
                </button>
                <button 
                  onClick={handleScheduleInterview}
                  className="flex-1 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-2xl hover:bg-brand-600 transition"
                >
                  Gửi lời mời
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {feedbackApp && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg p-10 animate-in fade-in zoom-in duration-300 no-scrollbar relative">
            <button 
              onClick={() => setFeedbackApp(null)}
              className="absolute top-8 right-8 p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition"
            >
              <X size={24} />
            </button>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              {feedbackApp.status === 'ACCEPTED' ? 'Chấp nhận hồ sơ' : 'Từ chối hồ sơ'}
            </h2>
            <p className="text-slate-500 font-medium mb-6 ">Gửi lời nhắn hoặc phản hồi chi tiết tới ứng viên.</p>
            
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 ">Nội dung phản hồi</label>
                <textarea 
                  value={feedbackContent}
                  onChange={(e) => setFeedbackContent(e.target.value)}
                  placeholder={feedbackApp.status === 'ACCEPTED' ? 'Chúc mừng bạn! Chúng tôi đã xem xét và...' : 'Cảm ơn bạn đã quan tâm, tuy nhiên...'}
                  className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-slate-900 focus:ring-2 focus:ring-brand-500 transition h-40"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => setFeedbackApp(null)}
                  className="flex-1 px-8 py-4 bg-slate-100 text-slate-500 rounded-2xl font-bold hover:bg-slate-200 transition"
                >
                  Hủy
                </button>
                <button 
                  onClick={() => updateStatus(feedbackApp.appId, feedbackApp.status, feedbackContent)}
                  className={`flex-1 px-8 py-4 text-white rounded-2xl font-bold shadow-lg transition ${
                    feedbackApp.status === 'ACCEPTED' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100' : 'bg-rose-600 hover:bg-rose-700 shadow-rose-100'
                  }`}
                >
                  Xác nhận & Gửi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobApplicants;


