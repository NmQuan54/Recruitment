import React, { useState, useEffect, useRef } from 'react';
import html2pdf from 'html2pdf.js';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../../services/api';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Printer, 
  ChevronLeft,
  Loader2,
  Calendar,
  Building
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const ViewOnlineCV = () => {
  const { candidateId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const autoDownload = searchParams.get('download') === 'true';

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const cvRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get(`/candidate/${candidateId}/profile`);
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching candidate profile:', error);
        toast.error('Không thể tải thông tin ứng viên');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [candidateId]);

  useEffect(() => {
    if (!loading && profile && autoDownload && !downloading) {
      const timer = setTimeout(() => {
        handleDownloadPDF();
      }, 300); // Faster trigger
      return () => clearTimeout(timer);
    }
  }, [loading, profile, autoDownload]);

  const handleDownloadPDF = async () => {
    if (!cvRef.current) return;
    setDownloading(true);
    const element = cvRef.current;
    
    // Create custom options for A4 perfect fit
    const opt = {
      margin: 0,
       filename: `CV_${profile.user?.fullName?.replace(/\s+/g, '_')}_Online.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true,
        letterRendering: true,
        backgroundColor: '#ffffff'
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
      await html2pdf().from(element).set(opt).save();
      toast.success('Hồ sơ PDF đã được tải xuống!');
      if (autoDownload) {
        // Automatically close the window after download
        setTimeout(() => window.close(), 1000);
      }
    } catch (err) {
      console.error('PDF export error:', err);
      toast.error('Có lỗi xảy ra khi xuất PDF. Vui lòng sử dụng tính năng In (Ctrl + P).');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader2 className="animate-spin text-brand-600 mb-4" size={40} />
      <p className="font-bold text-slate-400 uppercase tracking-widest">Đang tạo bản xem trước CV...</p>
    </div>
  );

  if (!profile) return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <p className="font-bold text-slate-500">Không tìm thấy thông tin ứng viên</p>
      <button onClick={() => navigate(-1)} className="mt-4 text-brand-600 font-bold hover:underline">Quay lại</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      {/* Action Bar - Hidden during print */}
      <div className="max-w-4xl mx-auto mb-8 flex justify-between items-center print:hidden">
         <button 
           onClick={() => navigate(-1)}
           className="flex items-center gap-2 text-slate-500 font-bold hover:text-brand-600 transition"
         >
           <ChevronLeft size={20} /> Quay lại danh sách
         </button>
         <button 
           onClick={handleDownloadPDF}
           disabled={downloading}
           className="bg-brand-600 text-white px-8 py-4 rounded-full font-black flex items-center gap-3 shadow-2xl shadow-brand-200 hover:bg-slate-900 transition-all active:scale-95 disabled:opacity-50"
         >
           {downloading ? <Loader2 size={24} className="animate-spin" /> : <Printer size={24} />}
           {downloading ? 'Đang tạo hồ sơ...' : 'Tải xuống hồ sơ PDF '}
         </button>
      </div>

      {/* CV Content - Paper A4 style */}
      <div 
        ref={cvRef}
        className="max-w-[210mm] mx-auto bg-white shadow-2xl rounded-[2rem] overflow-hidden print:shadow-none print:rounded-none print:max-w-none print:w-full"
      >
         {/* Sidebar / Top Header with brand color */}
         <div className="bg-slate-900 text-white p-12 lg:p-16">
            <div className="flex flex-col lg:flex-row gap-10 items-center justify-between">
               <div className="text-center lg:text-left">
                  <h1 className="text-4xl lg:text-5xl font-extrabold mb-4 tracking-tighter uppercase">{profile.user?.fullName}</h1>
                  <p className="text-xl text-brand-400 font-bold uppercase tracking-widest">{profile.title || 'Ứng viên'}</p>
               </div>
               <div className="grid gap-3 text-sm font-bold text-slate-300">
                  <div className="flex items-center gap-3"><Mail size={16} className="text-brand-400" /> {profile.user?.email}</div>
                  <div className="flex items-center gap-3"><Phone size={16} className="text-brand-400" /> {profile.phoneNumber || 'Chưa cập nhật'}</div>
                  <div className="flex items-center gap-3"><MapPin size={16} className="text-brand-400" /> {profile.address || 'Việt Nam'}</div>
               </div>
            </div>
         </div>

         <div className="p-12 lg:p-16 space-y-12">
            {/* Summary */}
            <section>
               <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                  <div className="w-8 h-[2px] bg-brand-600"></div> GIỚI THIỆU
               </h2>
               <p className="text-slate-700 font-medium leading-relaxed text-lg italic bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                  "{profile.summary || 'Ứng viên chưa cập nhật phần giới thiệu bản thân.'}"
               </p>
            </section>

            {/* Work Experience */}
            <section>
               <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] mb-8 flex items-center gap-3 text-brand-600">
                  <div className="w-8 h-[2px] bg-brand-600"></div> KINH NGHIỆM LÀM VIỆC
               </h2>
               <div className="space-y-10">
                  {profile.experiences?.length > 0 ? profile.experiences.map((exp, idx) => (
                    <div key={idx} className="relative pl-8 border-l-2 border-slate-100 group">
                       <div className="absolute top-0 left-[-9px] w-4 h-4 bg-white border-2 border-brand-600 rounded-full group-hover:scale-125 transition"></div>
                       <div className="flex flex-wrap justify-between items-start gap-4 mb-2">
                          <h3 className="text-xl font-bold text-slate-900">{exp.position}</h3>
                          <span className="text-xs font-bold text-brand-600 uppercase tracking-widest bg-brand-50 px-3 py-1 rounded-full">
                             {new Date(exp.startDate).toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' })} 
                             {' - '} 
                             {exp.isCurrent ? 'HIỆN TẠI' : new Date(exp.endDate).toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' })}
                          </span>
                       </div>
                       <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mb-4 flex items-center gap-2">
                          <Building size={12} /> {exp.companyName}
                       </p>
                       <p className="text-slate-600 font-medium whitespace-pre-wrap leading-relaxed">{exp.description}</p>
                    </div>
                  )) : (
                    <p className="text-slate-400 italic">Chưa có thông tin kinh nghiệm.</p>
                  )}
               </div>
            </section>

            {/* Education */}
            <section>
               <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                  <div className="w-8 h-[2px] bg-brand-600"></div> HỌC VẤN
               </h2>
               <div className="grid sm:grid-cols-2 gap-8">
                  {profile.educations?.length > 0 ? profile.educations.map((edu, idx) => (
                    <div key={idx} className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 ">
                       <h3 className="font-bold text-slate-900 text-lg mb-1">{edu.degree} - {edu.major}</h3>
                       <p className="text-sm font-bold text-brand-600 mb-2 uppercase">{edu.institution}</p>
                       <p className="text-xs font-bold text-slate-400">{edu.startDate} - {edu.endDate}</p>
                    </div>
                  )) : (
                    <p className="text-slate-400 italic">Chưa có thông tin học vấn.</p>
                  )}
               </div>
            </section>

            {/* Skills */}
            <section>
               <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                  <div className="w-8 h-[2px] bg-brand-600"></div> KỸ NĂNG
               </h2>
               <div className="flex flex-wrap gap-2">
                  {(profile.skills || '').split(',').map((skill, idx) => (
                    <span key={idx} className="px-4 py-2 bg-slate-900 text-white font-bold text-[10px] uppercase tracking-widest rounded-xl">
                       {skill.trim()}
                    </span>
                  ))}
               </div>
            </section>
         </div>

         {/* Footer - Branding */}
         <div className="bg-slate-50 border-t border-slate-100 p-8 text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Hồ sơ được tạo tự động bởi Recruitment System • {new Date().toLocaleDateString('vi-VN')}</p>
         </div>
      </div>
    </div>
  );
};

export default ViewOnlineCV;
