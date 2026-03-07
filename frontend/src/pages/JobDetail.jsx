import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { 
  Building, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Calendar, 
  ChevronLeft,
  FileText,
  Send,
  CheckCircle2,
  Loader2,
  Bookmark,
  BookmarkCheck,
  X,
  ArrowRight,
  AlertCircle,
  User
} from 'lucide-react';

const JobDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [saved, setSaved] = useState(false);
  const [checkingSaved, setCheckingSaved] = useState(true);
  const [togglingSave, setTogglingSave] = useState(false);
  const [profileResumeUrl, setProfileResumeUrl] = useState('');
  const [loadingResumes, setLoadingResumes] = useState(false);
  const [applyType, setApplyType] = useState('upload');
  const [resumeFile, setResumeFile] = useState(null);
  const [selectedResumeUrl, setSelectedResumeUrl] = useState('');

  useEffect(() => {
    if (showModal && user?.role === 'CANDIDATE') {
      const fetchData = async () => {
        setLoadingResumes(true);
        try {
          const res = await api.get('/candidate/profile');
          setProfileResumeUrl(res.data.resumeUrl || '');
          setApplyType('upload');
          if (res.data.resumeUrl) {
            setSelectedResumeUrl(res.data.resumeUrl);
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
        } finally {
          setLoadingResumes(false);
        }
      };
      fetchData();
    }
  }, [showModal, user]);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await api.get(`/jobs/${id}`);
        setJob(response.data);
      } catch (error) {
        toast.error('Không tìm thấy công việc này');
        navigate('/jobs');
      } finally {
        setLoading(false);
      }
    };

    const checkSaveStatus = async () => {
      if (user?.role === 'CANDIDATE') {
        try {
          const res = await api.get(`/candidate/saved-jobs/${id}/status`);
          setSaved(res.data.saved);
        } catch (_) {}
      }
      setCheckingSaved(false);
    };

    fetchJob();
    checkSaveStatus();
  }, [id, user]);

  const handleToggleSave = async () => {
    if (!user) {
      toast.error('Vui lòng đăng nhập để lưu công việc');
      navigate('/login');
      return;
    }
    if (user.role !== 'CANDIDATE') {
      toast.error('Chỉ ứng viên mới có thể lưu công việc');
      return;
    }

    setTogglingSave(true);
    try {
      if (saved) {
        await api.delete(`/candidate/saved-jobs/${id}`);
        setSaved(false);
        toast.success('Đã bỏ lưu công việc');
      } else {
        await api.post(`/candidate/saved-jobs/${id}`);
        setSaved(true);
        toast.success('Đã lưu công việc thành công!');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi cập nhật trạng thái lưu');
    } finally {
      setTogglingSave(false);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Vui lòng đăng nhập để ứng tuyển');
      navigate('/login');
      return;
    }
    
    let finalResumeUrl = selectedResumeUrl;
    if (applyType === 'profile') {
      finalResumeUrl = 'ONLINE_PROFILE';
    }

    setApplying(true);
    try {
      
      if (applyType === 'upload') {
        if (!resumeFile) {
          toast.error('Vui lòng chọn file CV để tải lên');
          setApplying(false);
          return;
        }

        const formData = new FormData();
        formData.append('file', resumeFile);
        
        try {
          const uploadRes = await api.post('/upload/resume', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          finalResumeUrl = uploadRes.data.url;
          toast.success('CV đã được tải lên hệ thống');
        } catch (uploadError) {
          toast.error(uploadError.response?.data?.error || 'Lỗi khi tải CV lên server');
          setApplying(false);
          return;
        }
      }

      if (!finalResumeUrl && applyType !== 'profile') {
        toast.error('Vui lòng chọn hoặc tải lên CV của bạn');
        setApplying(false);
        return;
      }

      const applyData = { 
        coverLetter,
        resumeUrl: finalResumeUrl 
      };
      
      console.log('Sending apply request:', applyData);
      const res = await api.post(`/candidate/jobs/${id}/apply`, applyData);
      
      toast.success('Ứng tuyển thành công!');
      setShowModal(false);
      setCoverLetter('');
      setResumeFile(null);
    } catch (error) {
      console.error('Apply error:', error.response?.data);
      const errorMsg = error.response?.data?.message || 'Có lỗi xảy ra khi nộp đơn';
      toast.error(errorMsg);
    } finally {
      setApplying(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-16 h-16 border-4 border-brand-100 border-t-brand-600 rounded-full animate-spin"></div>
      <p className="mt-8 font-bold text-slate-400 uppercase tracking-widest text-sm">Đang tải thông tin chi tiết...</p>
    </div>
  );

  return (
    <div className="container-center pt-32 pb-16 animate-fade-in">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 font-bold mb-10 hover:text-brand-600 transition group"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition" /> Quay lại danh sách
      </button>

      <div className="glass-effect rounded-[3.5rem] shadow-2xl shadow-brand-100/20 border border-white/50 overflow-hidden">
         {}
         <div className="p-8 md:p-16 bg-white/50 border-b border-slate-100/50">
            <div className="flex flex-col lg:flex-row gap-10 items-start lg:items-center">
               <div className="w-32 h-32 bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center justify-center p-6 shrink-0   transition-transform duration-500">
                  {job.company?.logoUrl ? (
                    <img src={job.company.logoUrl} alt={job.company.name} className="w-full h-full object-contain" />
                  ) : (
                    <Building className="h-12 w-12 text-brand-600" />
                  )}
               </div>
               <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-6">
                     <span className="px-4 py-1.5 bg-brand-600 text-white text-[10px] font-bold rounded-full uppercase tracking-widest">
                       {job.jobType === 'FULL_TIME' ? 'Toàn thời gian' : job.jobType === 'PART_TIME' ? 'Bán thời gian' : job.jobType?.replace('_', ' ') || 'Tuyển dụng'}
                     </span>
                     <span className="px-4 py-1.5 bg-emerald-500 text-white text-[10px] font-bold rounded-full uppercase tracking-widest">Đang tuyển</span>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight leading-tight">{job.title}</h1>
                  <p className="text-xl font-bold text-brand-600 mb-6 flex items-center gap-2">
                    {job.company?.name || 'Công ty ẩn danh'} 
                    {job.company?.website && (
                      <a href={job.company.website} target="_blank" rel="noreferrer" className="text-slate-300 hover:text-brand-400 transition">
                        <ArrowRight size={18} className="-rotate-45" />
                      </a>
                    )}
                  </p>
                  
                  <div className="flex flex-wrap gap-x-10 gap-y-4 text-slate-500 font-semibold">
                     <span className="flex items-center gap-2.5"><MapPin size={18} className="text-brand-400" /> {job.location}</span>
                     <span className="flex items-center gap-2.5"><DollarSign size={18} className="text-brand-400" /> {job.salaryMin && job.salaryMax ? `${(job.salaryMin/1000000).toFixed(0)} - ${(job.salaryMax/1000000).toFixed(0)} Triệu VNĐ` : 'Thỏa thuận'}</span>
                     <span className="flex items-center gap-2.5"><Calendar size={18} className="text-brand-400" /> Hạn nộp: {job.deadline ? new Date(job.deadline).toLocaleDateString('vi-VN') : 'Liên hệ'}</span>
                  </div>
               </div>
               
               {user?.role !== 'EMPLOYER' && (
                 <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                   <button 
                     onClick={handleToggleSave}
                     disabled={togglingSave}
                     className={`flex-1 lg:flex-none p-5 rounded-[2rem] border-2 transition-all flex items-center justify-center gap-3 font-bold
                       ${saved 
                        ? 'border-brand-600 bg-brand-50 text-brand-600' 
                        : 'border-slate-200 text-slate-400 hover:border-brand-600 hover:text-brand-600 bg-white'
                       }`}
                     title={saved ? 'Bỏ lưu' : 'Lưu công việc'}
                   >
                     {togglingSave ? <Loader2 size={24} className="animate-spin" /> : <div className="flex items-center gap-2"> {saved ? <><BookmarkCheck size={24} /> Đã lưu</> : <><Bookmark size={24} /> Lưu tin</>}</div>}
                   </button>
                   <button 
                     onClick={() => setShowModal(true)}
                     className="btn-premium flex-[2] lg:flex-none px-12 py-5 text-xl rounded-[2rem] shadow-2xl shadow-brand-100"
                   >
                     Ứng tuyển ngay
                   </button>
                 </div>
               )}
            </div>
         </div>

         {}
         <div className="p-8 md:p-16 grid lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2 space-y-16">
               <section>
                  <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-4">
                    <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center">
                      <FileText className="text-brand-600" size={20} />
                    </div>
                    Mô tả công việc
                  </h3>
                  <div className="text-slate-600 leading-[1.8] font-bold whitespace-pre-line text-lg bg-slate-50/50 p-8 rounded-[2.5rem] border border-slate-100/50">
                    {job.description}
                  </div>
               </section>

               <section>
                  <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-4">
                    <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center">
                      <CheckCircle2 className="text-brand-600" size={20} />
                    </div>
                    Yêu cầu ứng viên
                  </h3>
                  <div className="text-slate-600 leading-[1.8] font-bold whitespace-pre-line text-lg border-2 border-slate-50 p-8 rounded-[2.5rem]">
                    {job.requirements}
                  </div>
               </section>
            </div>

             <div className="space-y-8">
                <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-brand-50/50 rounded-full -mr-16 -mt-16"></div>
                   <h4 className="font-bold text-xl mb-8 tracking-tight text-slate-900">Thông tin doanh nghiệp</h4>
                   <div className="space-y-6 font-semibold text-sm">
                      <div className="flex flex-col gap-1 border-b border-slate-50 pb-4">
                         <span className="text-slate-400 uppercase tracking-widest text-[10px]">Quy mô</span>
                         <span className="text-slate-700">{job.company?.companySize || 'Đang cập nhật'} nhân viên</span>
                      </div>
                      <div className="flex flex-col gap-1 border-b border-slate-50 pb-4">
                         <span className="text-slate-400 uppercase tracking-widest text-[10px]">Lĩnh vực</span>
                         <span className="text-slate-700">{job.company?.industry || 'Đang cập nhật'}</span>
                      </div>
                      <div className="flex flex-col gap-1 border-b border-slate-50 pb-4">
                         <span className="text-slate-400 uppercase tracking-widest text-[10px]">Địa chỉ</span>
                         <span className="text-slate-700">{job.company?.address || 'Đang cập nhật'}</span>
                      </div>
                   </div>
                   <p className="mt-8 text-slate-500 text-sm leading-relaxed">
                     {job.company?.description}
                   </p>
                </div>
             </div>
         </div>
      </div>

      {}
      {showModal && (
        <div 
          className="fixed inset-0 z-[999] flex items-start justify-center p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto pt-32 pb-12 no-scrollbar"
          onClick={() => setShowModal(false)}
        >
           <div 
             className="bg-white w-full max-w-xl rounded-[3rem] p-12 shadow-3xl animate-fade-in relative my-8"
             onClick={(e) => e.stopPropagation()}
           >
              <button 
                onClick={() => setShowModal(false)}
                className="absolute top-8 right-8 w-11 h-11 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all shadow-sm"
              >
                <X size={24} />
              </button>
              <div className="text-center mb-10">
                 <div className="w-20 h-20 bg-brand-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                    <Send className="text-brand-600" size={32} />
                 </div>
                 <h2 className="text-3xl font-bold text-slate-900 mb-2">Ứng tuyển ngay</h2>
                 <p className="text-slate-500 font-bold">Vị trí: <span className="text-brand-600">{job.title}</span></p>
              </div>

              <form onSubmit={handleApply} className="space-y-8">
                <div className="space-y-3">
                    <label className="text-[10px] font-bold text-slate-400 ml-4 uppercase tracking-[0.2em]">Thư giới thiệu (Cover Letter)</label>
                    <textarea 
                      required
                      className="w-full p-8 bg-slate-50 border-none rounded-[2rem] h-48 focus:ring-2 focus:ring-brand-500/20 transition font-bold text-slate-900 placeholder:text-slate-300"
                      placeholder="Chia sẻ lý do bạn là ứng viên phù hợp nhất..."
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                    ></textarea>
                 </div>

                 <div className="space-y-4">
                    {/* Applying Options */}

                    {applyType === 'upload' && (
                      <div className="space-y-3">
                         <div className="flex items-center justify-between ml-4 mb-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Upload file CV (PDF/Ảnh)</label>
                         </div>
                         <div className="relative group">
                            <input 
                              type="file" 
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                              onChange={(e) => setResumeFile(e.target.files[0])}
                            />
                            <div className="w-full p-8 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] text-center group-hover:bg-brand-50/30 group-hover:border-brand-200 transition">
                               <FileText size={32} className="mx-auto mb-3 text-slate-300 group-hover:text-brand-400 transition" />
                               <p className="font-bold text-slate-500 text-sm">
                                 {resumeFile ? resumeFile.name : 'Nhấn để chọn file CV của bạn'}
                               </p>
                               <p className="text-[10px] text-slate-300 mt-2 font-bold uppercase tracking-widest">Tối đa 5MB • PDF, JPG, PNG</p>
                            </div>
                         </div>
                      </div>
                    )}
                 </div>

                  <div className="bg-brand-50/50 border border-brand-100 p-6 rounded-3xl flex items-start gap-4">
                    <CheckCircle2 className="text-brand-600 mt-1 shrink-0" size={20} />
                    <p className="text-xs font-bold text-slate-500 leading-relaxed">
                      File CV bạn vừa chọn sẽ được đính kèm vào hồ sơ ứng tuyển này.
                    </p>
                  </div>

                 <div className="flex gap-4">
                    <button 
                      type="submit"
                      disabled={applying}
                      className="btn-premium w-full py-5 rounded-[2rem] font-bold text-lg flex items-center justify-center gap-3 active:scale-95 transition-transform"
                    >
                      {applying ? <Loader2 className="animate-spin h-6 w-6" /> : (
                        <>
                          Xác nhận ứng tuyển
                          <ArrowRight size={20} />
                        </>
                      )}
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default JobDetail;


