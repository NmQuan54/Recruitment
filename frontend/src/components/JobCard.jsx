import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, DollarSign, Building, ArrowRight, Bookmark, BookmarkCheck } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const JOB_TYPE_LABELS = {
  FULL_TIME: 'Toàn thời gian',
  PART_TIME: 'Bán thời gian',
  REMOTE: 'Từ xa',
  INTERN: 'Thực tập',
};

const formatSalary = (min, max) => {
  if (!min && !max) return 'Thỏa thuận';
  if (min && max) return `${(min / 1e6).toFixed(0)} - ${(max / 1e6).toFixed(0)} Tr`;
  if (min) return `Từ ${(min / 1e6).toFixed(0)} Tr`;
  return `Đến ${(max / 1e6).toFixed(0)} Tr`;
};

const JobCard = ({ job, initialSaved = false }) => {
  const { user } = useAuth();
  const isCandidate = user?.role === 'CANDIDATE';
  const [saved, setSaved] = useState(initialSaved);
  const [toggling, setToggling] = useState(false);

  const handleToggleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isCandidate || toggling) return;
    setToggling(true);
    try {
      if (saved) {
        await api.delete(`/candidate/saved-jobs/${job.id}`);
        setSaved(false);
      } else {
        await api.post(`/candidate/saved-jobs/${job.id}`);
        setSaved(true);
      }
    } catch (err) {
      console.error('Bookmark error:', err);
    } finally {
      setToggling(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-brand-500/10 transition-all duration-500 group relative flex flex-col h-full overflow-hidden">
      {}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-3xl"></div>

      {}
      <div className="flex justify-between items-start mb-8 relative z-10">
        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:bg-white group-hover:border-brand-200 transition-all duration-500 shadow-sm">
          {job.company?.logoUrl ? (
            <img src={job.company.logoUrl} alt={job.company.name} className="w-10 h-10 object-contain" />
          ) : (
            <Building className="h-8 w-8 text-slate-300" />
          )}
        </div>
        
        {isCandidate && (
          <button
            onClick={handleToggleSave}
            disabled={toggling}
            className={`p-3 rounded-2xl transition-all duration-500 ${
              saved
                ? 'bg-brand-600 text-white shadow-lg shadow-brand-200'
                : 'bg-slate-50 text-slate-400 hover:text-brand-600 hover:bg-brand-50'
            }`}
          >
            {saved ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
          </button>
        )}
      </div>

      {}
      <div className="flex flex-wrap gap-2 mb-6">
        {job.isPromoted && (
          <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-bold rounded-lg uppercase tracking-wider border border-amber-100 flex items-center gap-1">
             <span className="w-1 h-1 bg-amber-500 rounded-full"></span> Hot
          </span>
        )}
        <span className="px-3 py-1 bg-brand-50 text-brand-600 text-[10px] font-bold rounded-lg uppercase tracking-wider border border-brand-100">
          {JOB_TYPE_LABELS[job.jobType] || job.jobType || 'Toàn thời gian'}
        </span>
      </div>

      {}
      <div className="flex-grow">
        <div className="h-[3.5rem] mb-2 overflow-hidden">
          <h3 className="text-lg md:text-xl font-bold text-slate-900 group-hover:text-brand-600 transition-colors tracking-tight leading-snug line-clamp-2">
            {job.title || 'Vị trí tuyển dụng'}
          </h3>
        </div>
        <div className="h-[1.25rem] mb-6 overflow-hidden">
          <p className="text-sm font-semibold text-brand-600 opacity-80 truncate uppercase tracking-wider text-[11px]">
            {job.company?.name || 'Doanh nghiệp'}
          </p>
        </div>

        {}
        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-3 text-slate-500 h-[1.25rem]">
            <MapPin size={16} className="text-slate-300 shrink-0" />
            <span className="text-xs font-bold truncate">{job.location || 'Toàn quốc'}</span>
          </div>
          <div className="flex items-center gap-3 text-emerald-600 h-[1.25rem]">
            <DollarSign size={16} className="text-emerald-400 shrink-0" />
            <span className="text-sm font-extrabold">{formatSalary(job.salaryMin, job.salaryMax)}</span>
          </div>
        </div>
      </div>

      {}
      <div className="pt-6 border-t border-slate-50 mt-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-slate-400">
            <Clock size={14} className="opacity-50" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
              {job.createdAt ? new Date(job.createdAt).toLocaleDateString('vi-VN') : 'Vừa đăng'}
            </span>
          </div>
        </div>

        <Link
          to={`/jobs/${job.id}`}
          className="w-full h-14 bg-slate-50 text-slate-500 group-hover:bg-slate-900 group-hover:text-white rounded-2xl flex items-center justify-center gap-3 font-bold text-sm tracking-wide transition-all active:scale-[0.98]"
        >
          Chi tiết công việc
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default JobCard;


