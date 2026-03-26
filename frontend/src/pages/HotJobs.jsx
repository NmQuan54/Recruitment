import React, { useState, useEffect } from 'react';
import api from '../services/api';
import JobCard from '../components/JobCard';
import { Loader2, Zap, Sparkles, TrendingUp, Search, Crown, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const HotJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPromotedJobs = async () => {
      setLoading(true);
      try {
        const response = await api.get('/jobs/promoted', { params: { size: 12 } });
        setJobs(response.data.content || []);
      } catch (error) {
        console.error('Error fetching promoted jobs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPromotedJobs();
  }, []);

  return (
    <div className="min-h-screen pt-40 pb-32 bg-slate-50 relative overflow-hidden">
      {}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20"></div>
      
      {}
      <div className="absolute top-[10%] right-[10%] w-[500px] h-[500px] bg-brand-200/20 rounded-full blur-[120px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-[10%] left-[10%] w-[400px] h-[400px] bg-amber-100/30 rounded-full blur-[100px] -z-10"></div>

      <div className="max-w-[1400px] mx-auto px-4 relative z-10">
        {}
        <div className="mb-24 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-3 px-8 py-3 bg-brand-50 border border-brand-100 text-brand-600 rounded-full font-black text-xs uppercase tracking-[0.4em] mb-12 shadow-sm"
          >
            <Crown size={18} className="animate-bounce" /> Tuyệt Phẩm Tuyển Dụng
          </motion.div>
          
          <div className="mb-12 relative inline-block">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="text-7xl md:text-9xl font-black text-slate-900 tracking-tighter leading-none"
            >
              Đại Lộ <br />
              <div className="relative inline-block mt-4">
                <span className="text-transparent bg-clip-text bg-gradient-to-br from-amber-400 via-orange-500 to-rose-600">
                  Tinh Hoa
                </span>
                {}
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 1, duration: 1 }}
                  className="absolute -bottom-4 left-0 h-3 bg-gradient-to-r from-brand-500 via-brand-600 to-transparent rounded-full opacity-20"
                ></motion.div>
                {}
                <div className="absolute -top-6 -right-12">
                   <Star size={48} className="text-amber-400 fill-amber-400 animate-pulse" />
                </div>
              </div>
            </motion.h1>
          </div>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="max-w-3xl mx-auto text-slate-500 font-bold text-2xl leading-relaxed mb-16 px-4"
          >
            Nơi hội tụ những vị trí dẫn đầu, dành riêng cho 
            những tài năng xuất chúng trên hành trình rực rỡ.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex flex-wrap justify-center gap-10 text-slate-400 text-xs font-black uppercase tracking-[0.3em]"
          >
            <div className="flex items-center gap-2 group">
               <div className="w-2 h-2 bg-amber-500 rounded-full group-hover:scale-150 transition-transform"></div>
               Đặc Quyền VIP
            </div>
            <span className="opacity-20">/</span>
            <div className="flex items-center gap-2 group">
               <div className="w-2 h-2 bg-brand-500 rounded-full group-hover:scale-150 transition-transform"></div>
               Tuyển Dụng Top
            </div>
            <span className="opacity-20">/</span>
            <div className="flex items-center gap-2 group">
               <div className="w-2 h-2 bg-rose-500 rounded-full group-hover:scale-150 transition-transform"></div>
               Cơ Hội Đột Phá
            </div>
          </motion.div>
        </div>

        {}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-48">
            <div className="relative">
              <div className="w-24 h-24 border-4 border-slate-100 border-t-brand-600 rounded-full animate-spin" />
              <Zap className="absolute inset-0 m-auto text-brand-600 animate-pulse" size={32} />
            </div>
            <p className="mt-10 font-black text-slate-400 uppercase tracking-[0.5em] text-xs">
              Đang chuẩn bị trang trọng...
            </p>
          </div>
        ) : jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {jobs.map((job, idx) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="relative group "
              >
                {}
                <div className="absolute inset-x-4 inset-y-10 bg-brand-500/10 rounded-[3rem] opacity-0 group-hover:opacity-100 blur-2xl transition-all duration-700 -z-10"></div>
                
                <div className="relative bg-white rounded-[3.5rem] border border-slate-100 p-2 shadow-sm group-hover:shadow-[0_40px_80px_-20px_rgba(37,99,235,0.15)] group-hover:-translate-y-2 transition-all duration-500 group-hover:border-brand-200 overflow-hidden">
                  {}
                  <div className="absolute top-6 right-8 z-30 opacity-0 group-hover:opacity-100 transition-opacity">
                     <div className="bg-gradient-to-r from-brand-600 to-brand-800 text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl">
                        Elite Choice
                     </div>
                  </div>
                  
                  <JobCard job={job} />
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-40 rounded-[5rem] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-200/20 blur-[80px]"></div>
            <div className="bg-white w-24 h-24 rounded-[2rem] shadow-2xl mx-auto flex items-center justify-center mb-10 group-hover:scale-110 transition-transform border border-slate-50">
              <TrendingUp className="text-brand-300" size={48} />
            </div>
            <h3 className="text-4xl font-black text-slate-900 mb-6 tracking-tighter uppercase leading-none">Vườn đào đang chớm nở</h3>
            <p className="text-slate-500 font-bold max-w-sm mx-auto leading-relaxed text-lg mb-12">
               Chúng tôi đang chọn lọc những viên ngọc sáng nhất. Hãy trở lại trong tích tắc để đón nhận.
            </p>
            <button
               onClick={() => window.location.href = '/jobs'}
               className="px-12 py-5 bg-slate-900 text-white font-black rounded-3xl hover:bg-brand-600 transition shadow-2xl shadow-slate-200 uppercase tracking-widest text-xs transform hover:-translate-y-1"
            >
               Khám phá kho việc làm
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HotJobs;
