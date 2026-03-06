import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  TrendingUp, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Star,
  Sparkles,
  Loader2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import JobCard from '../components/JobCard';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [featuredJobs, setFeaturedJobs] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState({ keyword: '', location: '' });
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    const fetchFeatured = async () => {
       try {
          const res = await api.get('/jobs', { params: { size: 10 } }); 
          setFeaturedJobs(res.data.content || []);
       } catch (_) {} finally {
          setLoading(false);
       }
    };
    fetchFeatured();
  }, []);

  const nextSlide = () => {
    if (currentIndex + 3 < featuredJobs.length) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleSearch = () => {
     navigate(`/jobs?keyword=${search.keyword}&location=${search.location}`);
  };

  return (
    <div className="flex flex-col min-h-screen pt-32">
      {}
      <div className="bg-blob w-[600px] h-[600px] bg-brand-100/40 -top-40 -left-60"></div>
      <div className="bg-blob w-[500px] h-[500px] bg-brand-200/20 bottom-0 -right-40"></div>

      {}
      <section className="relative pb-32 overflow-hidden w-full flex justify-center">
        <div className="container-center relative z-10 flex flex-col items-center">
          <div className="text-center max-w-none">
            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-brand-50 border border-brand-100 text-brand-700 text-xs font-bold uppercase tracking-widest mb-10 animate-fade-in shadow-sm">
              <Sparkles size={14} className="text-brand-500" />
              <span>Nền tảng tuyển dụng tin cậy số 1</span>
            </div>
            
            <h1 className="text-5xl md:text-8xl font-bold text-slate-900 tracking-tighter mb-10 leading-[1.05]">
              Vươn tầm <br />
              <span className="text-gradient">
                Sự nghiệp Quốc tế
              </span>
            </h1>
            
            <p className="text-lg md:text-2xl text-slate-500 max-w-none mx-auto mb-16 leading-relaxed font-bold opacity-80">
              Kết nối <span className="text-brand-600 font-bold underline decoration-brand-200 underline-offset-8">25,000+</span> ứng viên tiềm năng với những doanh nghiệp hàng đầu. Chuyên nghiệp - Uy tín - Hiệu quả.
            </p>

            {}
            <div className="max-w-none w-full mx-auto glass-effect p-3 rounded-[3rem] flex flex-col md:flex-row gap-2 mb-16 group transition-all duration-700 hover:shadow-2xl hover:shadow-brand-200/40">
              <div className="flex-[1.5] flex items-center px-8 py-5 gap-5 bg-white/50 rounded-[2.5rem] border border-transparent focus-within:border-brand-200 focus-within:bg-white transition-all duration-300">
                <Search className="h-6 w-6 text-brand-500" />
                <input 
                  type="text" 
                  placeholder="Vị trí tuyển dụng, công ty..." 
                  className="w-full bg-transparent border-none focus:ring-0 text-slate-900 font-bold text-lg placeholder-slate-400"
                  value={search.keyword}
                  onChange={e => setSearch({...search, keyword: e.target.value})}
                />
              </div>
              <div className="flex-1 flex items-center px-8 py-5 gap-5 bg-white/50 rounded-[2.5rem] border border-transparent focus-within:border-brand-200 focus-within:bg-white transition-all duration-300">
                <MapPin className="h-6 w-6 text-brand-500" />
                <input 
                  type="text" 
                  placeholder="Địa điểm..." 
                  className="w-full bg-transparent border-none focus:ring-0 text-slate-900 font-bold text-lg placeholder-slate-400"
                  value={search.location}
                  onChange={e => setSearch({...search, location: e.target.value})}
                />
              </div>
              <button 
                onClick={handleSearch}
                className="btn-premium px-12 py-5 text-lg rounded-[2.5rem]"
              >
                Tìm công việc <ArrowRight size={22} className="ml-1" strokeWidth={3} />
              </button>
            </div>

            <div className="flex flex-wrap justify-center gap-10 text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em] opacity-50">
                <span className="hover:text-brand-600 hover:opacity-100 cursor-pointer transition-all">#Technology</span>
                <span className="hover:text-brand-600 hover:opacity-100 cursor-pointer transition-all">#FinTech</span>
                <span className="hover:text-brand-600 hover:opacity-100 cursor-pointer transition-all">#AI_Automation</span>
                <span className="hover:text-brand-600 hover:opacity-100 cursor-pointer transition-all">#Management</span>
            </div>
          </div>
        </div>
      </section>

      {}
      <section className="py-12 w-full flex justify-center -translate-y-12">
        <div className="container-center">
           <div className="glass-effect rounded-[4rem] p-12 md:p-20 grid grid-cols-2 lg:grid-cols-4 gap-12 text-center group shadow-2xl shadow-slate-200/50">
              <div className="flex flex-col items-center">
                 <div className="text-5xl md:text-7xl font-bold text-brand-600 mb-4 tracking-tighter">5k+</div>
                 <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] opacity-80">Việc làm đang tuyển</div>
              </div>
              <div className="flex flex-col items-center lg:border-l border-slate-100">
                 <div className="text-5xl md:text-7xl font-bold text-slate-900 mb-4 tracking-tighter">2.5k</div>
                 <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] opacity-80">Đối tác chiến lược</div>
              </div>
              <div className="flex flex-col items-center lg:border-l border-slate-100">
                 <div className="text-5xl md:text-7xl font-bold text-slate-900 mb-4 tracking-tighter">100k</div>
                 <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] opacity-80">Ứng viên tiềm năng</div>
              </div>
              <div className="flex flex-col items-center lg:border-l border-slate-100">
                 <div className="text-5xl md:text-7xl font-bold text-brand-800 mb-4 tracking-tighter">98%</div>
                 <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] opacity-80">Đánh giá uy tín</div>
              </div>
           </div>
        </div>
      </section>

      {}
      <section className="py-24 w-full flex justify-center bg-white relative">
         <div className="container-center relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                <div className="max-w-none">
                   <h2 className="text-sm font-bold text-brand-600 uppercase tracking-[0.4em] mb-6 flex items-center gap-2">
                     <span className="w-8 h-[2px] bg-brand-600"></span> Nổi bật trong tuần
                   </h2>
                   <p className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tighter leading-tight">
                     Cơ hội <span className="text-amber-500 font-extrabold relative">
                       vàng
                       <span className="absolute -bottom-1 left-0 w-full h-1 bg-amber-200/50 rounded-full"></span>
                     </span> bạn <br /> 
                     không nên bỏ lỡ
                   </p>
                </div>
               <Link to="/jobs" className="flex items-center gap-2 font-bold text-slate-400 hover:text-brand-600 transition group">
                  Xem tất cả <ArrowRight size={18} className="group-hover:translate-x-1 transition" />
               </Link>
            </div>

            {loading ? (
               <div className="flex justify-center py-20">
                  <Loader2 className="animate-spin text-brand-600" size={40} />
               </div>
            ) : featuredJobs.length > 0 ? (
               <div className="relative group">
                  {}
                  <div className="absolute top-1/2 -left-6 -translate-y-1/2 z-20 hidden md:block">
                    <button 
                      onClick={prevSlide}
                      disabled={currentIndex === 0}
                      className={`w-14 h-14 bg-white rounded-full shadow-xl flex items-center justify-center border border-slate-100 transition-all ${currentIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-brand-600 hover:text-white hover:-translate-x-1'}`}
                    >
                      <ChevronLeft size={24} />
                    </button>
                  </div>

                  <div className="absolute top-1/2 -right-6 -translate-y-1/2 z-20 hidden md:block">
                    <button 
                      onClick={nextSlide}
                      disabled={currentIndex + 3 >= featuredJobs.length}
                      className={`w-14 h-14 bg-white rounded-full shadow-xl flex items-center justify-center border border-slate-100 transition-all ${currentIndex + 3 >= featuredJobs.length ? 'opacity-30 cursor-not-allowed' : 'hover:bg-brand-600 hover:text-white hover:translate-x-1'}`}
                    >
                      <ChevronRight size={24} />
                    </button>
                  </div>

                  <div className="overflow-hidden pb-8">
                    <motion.div 
                      className="flex gap-8 items-stretch"
                      initial={false}
                      animate={{ x: `calc(-${currentIndex * (100 / 3)}% - ${currentIndex * (32 / 3)}px)` }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                      {featuredJobs.map(job => (
                        <div key={job.id} className="min-w-[calc((100%-64px)/3)] flex flex-col">
                            <JobCard job={job} />
                        </div>
                      ))}
                    </motion.div>
                  </div>
                  
                  {}
                  <div className="flex justify-center mt-12 gap-2">
                    {Array.from({ length: Math.max(0, featuredJobs.length - 2) }).map((_, i) => (
                      <button 
                        key={i}
                        onClick={() => setCurrentIndex(i)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${currentIndex === i ? 'w-8 bg-brand-600' : 'w-2 bg-slate-200 hover:bg-slate-300'}`}
                      />
                    ))}
                  </div>
               </div>
            ) : (
               <p className="text-center py-20 text-slate-400 font-bold ">Đang cập nhật các vị trí hấp dẫn...</p>
            )}
         </div>
      </section>
      <section className="py-32 w-full flex justify-center bg-slate-50/50 relative overflow-hidden">
        <div className="container-center relative z-10">
           <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
              <div className="max-w-none">
                 <h2 className="text-sm font-bold text-brand-600 uppercase tracking-[0.4em] mb-6">Giải pháp toàn diện</h2>
                 <p className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tighter leading-tight">Tuyển dụng <br /><span className="text-brand-200 font-light ">thông minh & hiệu quả</span></p>
              </div>
              <button className="flex items-center gap-3 font-bold text-brand-600 hover:gap-5 transition-all text-sm uppercase tracking-widest">
                Khám phá hệ sinh thái <ArrowRight size={20} />
              </button>
           </div>

           <div className="grid md:grid-cols-3 gap-10">
              {[
                { icon: Zap, title: 'AI Matching', desc: 'Công nghệ AI phân tích và gợi ý hồ sơ chính xác đến 99% theo yêu cầu công việc.' },
                { icon: ShieldCheck, title: 'Bảo mật đa lớp', desc: 'Đảm bảo an toàn tuyệt đối cho thông tin doanh nghiệp và ứng viên quốc tế.' },
                { icon: Star, title: 'Dịch vụ cao cấp', desc: 'Hỗ trợ tư vấn và quy trình tuyển dụng chuẩn mực cho các tập đoàn lớn.' }
              ].map((item, idx) => (
                <div key={idx} className="group p-12 rounded-[3.5rem] bg-white border border-slate-100 hover:shadow-2xl hover:shadow-brand-100/30 transition-all duration-500">
                    <div className="w-20 h-20 bg-brand-50 rounded-3xl flex items-center justify-center mb-10 group-hover:scale-110 group-hover:bg-brand-600 transition-all duration-500 shadow-sm">
                        <item.icon className="h-10 w-10 text-brand-600 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-3xl font-bold text-slate-900 mb-6">{item.title}</h3>
                    <p className="text-slate-500 font-bold text-lg leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">{item.desc}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {}
      <section className="py-24 w-full flex justify-center bg-white">
         <div className="container-center">
             <div className="relative rounded-[4rem] bg-slate-950 p-12 md:p-20 overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-slate-800">
                 {}
                 <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-600/20 blur-[100px] rounded-full -mr-40 -mt-40 animate-pulse"></div>
                 <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/10 blur-[80px] rounded-full -ml-20 -mb-20 animate-pulse" style={{ animationDelay: '2s' }}></div>

                 <div className="relative z-10 flex flex-col items-center text-center text-white max-w-none mx-auto">
                    <h2 className="text-5xl md:text-7xl font-bold mb-8 leading-tight tracking-tighter text-white">
                      Sẵn sàng để <br /> 
                      <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-300 via-emerald-300 to-amber-200 animate-gradient-x drop-shadow-[0_0_30px_rgba(59,130,246,0.5)]">
                        Bứt phá?
                      </span>
                    </h2>
                    <p className="text-slate-400 text-lg md:text-xl mb-10 max-w-none font-bold opacity-90 leading-relaxed">
                      Bắt đầu hành trình chinh phục những nấc thang mới <br className="hidden md:block" /> trong sự nghiệp của bạn ngay hôm nay.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-6 w-full justify-center">
                        <Link to="/register" className="bg-white text-slate-950 px-12 py-5 rounded-[2rem] font-bold text-lg shadow-[0_20px_40px_-10px_rgba(255,255,255,0.3)] hover:bg-brand-50 transition-all hover:-translate-y-1 active:scale-95">Đăng ký ngay</Link>
                        <Link to="/jobs" className="px-12 py-5 rounded-[2rem] border-2 border-white/10 bg-white/5 text-white font-bold text-lg hover:bg-white/10 hover:border-white/20 transition-all duration-500 backdrop-blur-sm">Xem việc làm</Link>
                    </div>
                 </div>
             </div>
         </div>
      </section>
    </div>
  );
}

export default Home;



