import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { 
  Building2, 
  MapPin, 
  Users, 
  Globe, 
  ChevronLeft,
  Briefcase,
  DollarSign,
  Calendar,
  Loader2,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const CompanyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [companyRes, jobsRes] = await Promise.all([
          api.get(`/companies/${id}`),
          api.get(`/jobs?companyId=${id}`)
        ]);
        setCompany(companyRes.data);
        setJobs(jobsRes.data.content || []); 
      } catch (error) {
        console.error('Error fetching company details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-16 h-16 border-4 border-brand-100 border-t-brand-600 rounded-full animate-spin"></div>
      <p className="mt-8 font-bold text-slate-400 uppercase tracking-widest text-sm">Đang tải thông tin doanh nghiệp...</p>
    </div>
  );

  if (!company) return (
    <div className="text-center py-20 mt-32">
      <h2 className="text-3xl font-bold text-slate-900 mb-4">Không tìm thấy thông tin công ty</h2>
      <button onClick={() => navigate('/companies')} className="btn-premium px-8 py-3 rounded-2xl">Quay lại danh sách</button>
    </div>
  );

  return (
    <div className="w-full px-4 pt-32 pb-20 animate-fade-in">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 font-bold mb-10 hover:text-brand-600 transition group"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition" /> Quay lại danh sách
      </button>

      {}
      <div className="relative mb-20">
         <div className="absolute inset-0 bg-brand-50 rounded-[4rem] group-hover:bg-brand-100 transition-colors duration-500 opacity-20 -z-10 blur-3xl"></div>
         <div className="glass-effect rounded-[3.5rem] shadow-2xl p-10 md:p-16 border border-white/50 flex flex-col md:flex-row gap-12 items-center md:items-start text-center md:text-left">
            <div className="w-40 h-40 bg-white rounded-[2.5rem] shadow-xl border border-slate-100 flex items-center justify-center p-6 shrink-0 transition-all duration-500">
               {company.logoUrl ? (
                 <img src={company.logoUrl} alt={company.name} className="w-full h-full object-contain" />
               ) : (
                 <Building2 className="h-16 w-16 text-brand-600" />
               )}
            </div>
            <div className="flex-1">
               <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6  tracking-tight">{company.name}</h1>
               <div className="flex flex-wrap justify-center md:justify-start gap-x-8 gap-y-4 text-slate-500 font-bold mb-8">
                  <span className="flex items-center gap-2.5"><MapPin size={18} className="text-brand-400" /> {company.address || 'Toàn quốc'}</span>
                  <span className="flex items-center gap-2.5"><Users size={18} className="text-brand-400" /> {company.companySize || 'N/A'} nhân viên</span>
                  <span className="flex items-center gap-2.5"><Globe size={18} className="text-brand-400" /> {company.industry || 'Đa ngành'}</span>
               </div>
               {company.website && (
                 <a 
                   href={company.website} 
                   target="_blank" 
                   rel="noreferrer"
                   className="inline-flex items-center gap-3 px-8 py-3.5 bg-brand-600 text-white font-bold text-sm rounded-2xl shadow-xl shadow-brand-100 hover:bg-brand-700 hover:-translate-y-1 transition-all"
                 >
                   Truy cập Website <Globe size={18} />
                 </a>
               )}
            </div>
         </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-16">
         {}
         <div className="lg:col-span-2 space-y-16">
            <section>
               <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-4">
                 <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center">
                   <Briefcase className="text-brand-600" size={20} />
                 </div>
                 Về chúng tôi
               </h3>
               <div className="text-slate-600 leading-[2] font-bold whitespace-pre-line text-lg bg-slate-50/30 p-10 rounded-[2.5rem] border border-slate-100/50 ">
                 {company.description || 'Chưa có thông tin mô tả chi tiết về doanh nghiệp này.'}
               </div>
            </section>

            {}
            <section>
               <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-4">
                 <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center">
                   <Briefcase className="text-brand-600" size={20} />
                 </div>
                 Vị trí đang tuyển dụng ({jobs.length})
               </h3>
               <div className="space-y-6">
                 {jobs.map((job) => (
                   <div 
                      key={job.id}
                      onClick={() => navigate(`/jobs/${job.id}`)}
                      className="group p-8 bg-white rounded-[2.5rem] border border-slate-100 hover:border-brand-100 shadow-lg hover:shadow-brand-500/10 transition-all cursor-pointer flex flex-col md:flex-row gap-6 items-center"
                   >
                     <div className="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600 shrink-0 group-hover:scale-110 transition-transform">
                        <Briefcase size={28} />
                     </div>
                     <div className="flex-1 min-w-0 text-center md:text-left">
                        <h4 className="text-xl font-bold text-slate-900 group-hover:text-brand-600 transition-colors mb-2">{job.title}</h4>
                        <div className="flex flex-wrap justify-center md:justify-start gap-6 text-slate-400 font-bold text-xs uppercase tracking-widest">
                           <span className="flex items-center gap-2"><MapPin size={14} className="text-brand-300" /> {job.location}</span>
                           <span className="flex items-center gap-2"><DollarSign size={14} className="text-brand-300" /> {job.salaryMax ? `${(job.salaryMax/1000000).toFixed(0)}M` : 'Thỏa thuận'}</span>
                           <span className="flex items-center gap-2"><Calendar size={14} className="text-brand-300" /> {new Date(job.deadline).toLocaleDateString('vi-VN')}</span>
                        </div>
                     </div>
                     <ArrowRight className="text-slate-200 group-hover:text-brand-600 group-hover:translate-x-2 transition-all" size={24} />
                   </div>
                 ))}
                 {jobs.length === 0 && (
                   <p className="text-slate-400 font-bold  text-center py-10">Hiện tập đoàn chưa đăng tuyển vị trí nào mới.</p>
                 )}
               </div>
            </section>
         </div>

         {}
          <div className="space-y-10">
             <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-50/50 rounded-full -mr-16 -mt-16"></div>
                <h4 className="font-bold text-2xl mb-10 tracking-tight text-slate-900">Thông tin chung</h4>
                <div className="space-y-8 font-semibold">
                   <div className="flex flex-col gap-2">
                      <span className="text-slate-400 uppercase tracking-[0.2em] text-[10px]">Lĩnh vực</span>
                      <span className="text-lg text-slate-700">{company.industry || 'Đang cập nhật'}</span>
                   </div>
                   <div className="flex flex-col gap-2">
                      <span className="text-slate-400 uppercase tracking-[0.2em] text-[10px]">Quy mô nhân sự</span>
                      <span className="text-lg text-slate-700">{company.companySize || 'N/A'} thành viên</span>
                   </div>
                   <div className="flex flex-col gap-2">
                      <span className="text-slate-400 uppercase tracking-[0.2em] text-[10px]">Trụ sở chính</span>
                      <span className="text-lg text-slate-700">{company.address || 'Đang cập nhật'}</span>
                   </div>
                </div>
             </div>
          </div>
      </div>
    </div>
  );
};

export default CompanyDetail;


