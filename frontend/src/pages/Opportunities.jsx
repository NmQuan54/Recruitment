import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { Search, MapPin, Briefcase, Zap, Star, TrendingUp, Loader2, Megaphone, Clock, ArrowRight, Filter, X } from 'lucide-react';
import { motion } from 'framer-motion';

const JOB_TYPES = [
  { id: '', label: 'Tất cả' },
  { id: 'FULL_TIME', label: 'Toàn thời gian' },
  { id: 'PART_TIME', label: 'Bán thời gian' },
  { id: 'REMOTE', label: 'Remote' },
  { id: 'INTERN', label: 'Thực tập' },
];

const OpportunityCard = ({ job, idx }) => {
  const timeAgo = (dateStr) => {
    if (!dateStr) return '';
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return 'Hôm nay';
    if (days === 1) return 'Hôm qua';
    return `${days} ngày trước`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.05 }}
      className="h-full"
    >
      <div className="group h-full flex flex-col bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-brand-500/10 transition-all duration-500 overflow-hidden relative">
        <div className="p-8 flex-grow">
          <div className="flex justify-between items-start mb-6">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:bg-white transition-colors">
              {job.company?.logoUrl ? (
                <img src={job.company.logoUrl} alt={job.company.name} className="w-10 h-10 object-contain" />
              ) : (
                <Briefcase size={28} className="text-slate-300" />
              )}
            </div>
            <div className="flex flex-col items-end gap-2">
              {job.isPromoted && (
                <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-bold rounded-lg uppercase tracking-wider border border-amber-100">Hot</span>
              )}
              {job.jobType && (
                <span className="px-3 py-1 bg-brand-50 text-brand-600 text-[10px] font-bold rounded-lg uppercase tracking-wider border border-brand-100">
                  {job.jobType === 'FULL_TIME' ? 'Toàn thời gian' : job.jobType === 'PART_TIME' ? 'Bán thời gian' : job.jobType === 'REMOTE' ? 'Remote' : job.jobType === 'INTERN' ? 'Thực tập' : job.jobType}
                </span>
              )}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-600 transition-colors mb-2 line-clamp-2 h-[3.5rem] leading-snug">
              {job.title}
            </h3>
            <p className="text-sm font-semibold text-brand-600">
              {job.company?.companyName || job.company?.name || 'Công ty ẩn danh'}
            </p>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 text-slate-500">
              <MapPin size={16} className="text-slate-400" />
              <span className="text-sm font-semibold truncate">{job.location || 'Toàn quốc'}</span>
            </div>
            {job.salary && (
              <div className="flex items-center gap-3 text-emerald-600">
                <TrendingUp size={16} />
                <span className="text-sm font-bold">{job.salary}</span>
              </div>
            )}
          </div>

          {job.description && (
            <p className="text-slate-400 text-sm font-medium leading-relaxed line-clamp-2 opacity-80 group-hover:opacity-100 transition-opacity">
              {job.description}
            </p>
          )}
        </div>

        <div className="px-8 pb-8">
           <Link
            to={`/jobs/${job.id}`}
            className="w-full py-4 bg-slate-50 text-slate-400 group-hover:bg-slate-900 group-hover:text-white rounded-2xl flex items-center justify-center gap-2 font-bold text-sm transition-all shadow-sm"
          >
            Xem chi tiết 
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
          <div className="flex justify-center mt-4">
             <span className="flex items-center gap-1.5 text-[10px] text-slate-300 font-bold uppercase tracking-widest">
              <Clock size={12} />
              Đăng {timeAgo(job.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Opportunities = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [activeType, setActiveType] = useState('');

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = {};
      if (keyword) params.keyword = keyword;
      if (location) params.location = location;
      const res = await api.get('/jobs', { params });
      const data = res.data?.content || res.data || [];
      const all = Array.isArray(data) ? data : [];
      
      const filtered = activeType ? all.filter(j => j.jobType === activeType) : all;
      setJobs(filtered);
    } catch (err) {
      console.error('Error:', err);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [activeType]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleReset = () => {
    setKeyword('');
    setLocation('');
    setActiveType('');
  };

  const promoted = jobs.filter(j => j.isPromoted);
  const regular = jobs.filter(j => !j.isPromoted);

  return (
    <div className="pt-36 pb-20 animate-fade-in">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-brand-700 to-brand-900 py-20 px-4 mb-16 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none" />

        <div className="max-w-none mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/10 text-white rounded-2xl text-sm font-bold mb-6 border border-white/20">
            <Zap size={16} className="text-yellow-300" />
            Cơ Hội Việc Làm
          </div>
          <h1 className="text-5xl xl:text-6xl font-bold text-white tracking-tight leading-tight mb-6">
            Tìm việc làm <br />
            <span className="text-brand-200">phù hợp nhất</span> với bạn
          </h1>
          <p className="text-brand-200 font-bold text-xl leading-relaxed max-w-none mx-auto mb-10">
            Hàng nghìn cơ hội việc làm từ các doanh nghiệp hàng đầu Việt Nam đang chờ bạn.
          </p>

          {/* Search form */}
          <form onSubmit={handleSearch} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-[3rem] p-3 flex flex-col md:flex-row gap-3 max-w-none mx-auto">
            <div className="flex-[2] flex items-center px-6 py-3 bg-white rounded-[2.5rem] gap-3">
              <Search className="text-brand-500 shrink-0" size={20} />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Chức danh, kỹ năng, công ty..."
                className="bg-transparent border-none focus:ring-0 w-full font-bold text-slate-800 placeholder:text-slate-400 placeholder:font-bold text-sm"
              />
            </div>
            <div className="flex-1 flex items-center px-6 py-3 bg-white rounded-[2.5rem] gap-3">
              <MapPin className="text-brand-500 shrink-0" size={20} />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Địa điểm..."
                className="bg-transparent border-none focus:ring-0 w-full font-bold text-slate-800 placeholder:text-slate-400 placeholder:font-bold text-sm"
              />
            </div>
            <button type="submit" className="bg-white text-brand-600 px-10 py-4 rounded-[2.5rem] font-bold hover:bg-brand-50 transition shadow-lg">
              Tìm ngay
            </button>
          </form>
        </div>
      </div>

      <div className="container-center">
        {/* Filter Pills */}
        <div className="flex items-center gap-3 mb-10 flex-wrap">
          <div className="flex items-center gap-2 mr-2">
            <Filter size={16} className="text-slate-400" />
            <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Loại:</span>
          </div>
          {JOB_TYPES.map(type => (
            <button
              key={type.id}
              onClick={() => setActiveType(type.id)}
              className={`px-5 py-2 rounded-2xl text-sm font-bold transition-all
                ${activeType === type.id
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-200/50'
                  : 'bg-white text-slate-500 border border-slate-200 hover:border-brand-300 hover:text-brand-600'
                }`}
            >
              {type.label}
            </button>
          ))}
          {(keyword || location || activeType) && (
            <button onClick={handleReset} className="ml-auto flex items-center gap-1.5 text-sm font-bold text-slate-400 hover:text-slate-600 transition">
              <X size={14} /> Xóa tất cả
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 glass-effect rounded-[3.5rem] border border-white/50">
            <div className="w-20 h-20 border-4 border-brand-100 border-t-brand-600 rounded-full animate-spin mb-6" />
            <p className="font-bold text-slate-400 uppercase tracking-widest text-sm">Đang tải cơ hội việc làm...</p>
          </div>
        ) : (
          <>
            {}
            {promoted.length > 0 && (
              <section className="mb-14">
                <div className="flex items-center gap-3 mb-7">
                  <div className="p-2 bg-brand-600 rounded-xl">
                    <Star size={18} className="text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Việc làm nổi bật</h2>
                  <span className="px-3 py-1 bg-brand-50 text-brand-600 text-xs font-bold rounded-xl border border-brand-100">
                    {promoted.length} tin
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {promoted.map((job, idx) => (
                    <OpportunityCard key={job.id} job={job} idx={idx} />
                  ))}
                </div>
              </section>
            )}

            {}
            <section>
              <div className="flex items-center justify-between mb-7">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 rounded-xl">
                    <Briefcase size={18} className="text-slate-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    {promoted.length > 0 ? 'Việc làm khác' : 'Tất cả việc làm'}
                  </h2>
                  <span className="px-3 py-1 bg-slate-50 text-slate-500 text-xs font-bold rounded-xl border border-slate-200">
                    {regular.length} tin
                  </span>
                </div>
                <div className="text-sm font-bold text-slate-400">
                  Tổng: <span className="text-slate-900 font-bold">{jobs.length}</span> vị trí
                </div>
              </div>

              {regular.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {regular.map((job, idx) => (
                    <OpportunityCard key={job.id} job={job} idx={idx} />
                  ))}
                </div>
              ) : promoted.length === 0 ? (
                <div className="text-center py-28 glass-effect rounded-[3.5rem] border border-white/50 shadow-inner">
                  <div className="bg-white w-24 h-24 rounded-[2rem] shadow-xl mx-auto flex items-center justify-center mb-6 ">
                    <Search className="text-slate-200" size={48} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">Không tìm thấy việc làm</h3>
                  <p className="text-slate-500 font-bold max-w-sm mx-auto leading-relaxed">
                    Hiện chưa có tin tuyển dụng phù hợp. Hãy thử điều chỉnh từ khóa hoặc địa điểm.
                  </p>
                  <button onClick={handleReset} className="mt-8 px-8 py-3 bg-brand-50 text-brand-600 font-bold rounded-2xl hover:bg-brand-100 transition">
                    Xem tất cả
                  </button>
                </div>
              ) : (
                <p className="text-center text-slate-400 font-bold py-10">
                  Tất cả việc làm đều đang được quảng bá ở trên.
                </p>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default Opportunities;



