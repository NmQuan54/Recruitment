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
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-brand-100/20 transition-all duration-500 group relative flex flex-col h-full">
      {/* Top Badges */}
      <div className="flex justify-between items-center mb-6 relative z-10">
        <div className="flex gap-2">
          {job.isPromoted && (
            <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-bold rounded-lg uppercase tracking-wider border border-amber-100">
              Hot
            </span>
          )}
          <span className="px-3 py-1 bg-brand-50 text-brand-600 text-[10px] font-bold rounded-lg uppercase tracking-wider border border-brand-100">
            {JOB_TYPE_LABELS[job.jobType] || job.jobType || 'N/A'}
          </span>
        </div>
        
        {isCandidate && (
          <button
            onClick={handleToggleSave}
            disabled={toggling}
            className={`p-2 rounded-xl transition-all duration-300 ${
              saved
                ? 'bg-brand-50 text-brand-600'
                : 'bg-slate-50 text-slate-300 hover:text-brand-500 hover:bg-brand-50'
            }`}
          >
            {saved ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
          </button>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-grow">
        <div className="flex items-center gap-5 mb-6">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 shrink-0 group-hover:bg-white transition-colors">
            {job.company?.logoUrl ? (
              <img src={job.company.logoUrl} alt={job.company.name} className="w-10 h-10 object-contain" />
            ) : (
              <Building className="h-8 w-8 text-slate-300" />
            )}
          </div>
          <div className="min-w-0">
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors tracking-tight leading-snug line-clamp-2 mb-1 h-[3.5rem]">
              {job.title || 'Tiêu đề trống'}
            </h3>
            <p className="text-sm font-semibold text-slate-400 truncate">{job.company?.name || 'Công ty ẩn danh'}</p>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-3 text-slate-600">
            <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
              <MapPin size={16} className="text-slate-400" />
            </div>
            <span className="text-sm font-semibold truncate">{job.location || 'Chưa cập nhật'}</span>
          </div>
          <div className="flex items-center gap-3 text-brand-600">
            <div className="w-9 h-9 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
              <DollarSign size={16} className="text-brand-500" />
            </div>
            <span className="text-sm font-bold">{formatSalary(job.salaryMin, job.salaryMax)}</span>
          </div>
        </div>
      </div>

      {/* Footer & Action */}
      <div className="pt-6 border-t border-slate-50 mt-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-slate-400">
            <Clock size={14} />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              {job.createdAt ? new Date(job.createdAt).toLocaleDateString('vi-VN') : 'Vừa đăng'}
            </span>
          </div>
        </div>

        <Link
          to={`/jobs/${job.id}`}
          className="w-full h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center gap-3 font-bold text-sm tracking-wide hover:bg-brand-600 transition-all active:scale-[0.98] shadow-lg shadow-slate-200 hover:shadow-brand-200"
        >
          Chi tiết công việc
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
};

export default JobCard;


