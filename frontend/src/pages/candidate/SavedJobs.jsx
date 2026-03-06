import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import JobCard from '../../components/JobCard';
import { BookmarkCheck, Loader2, Search } from 'lucide-react';

const SavedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const res = await api.get('/candidate/saved-jobs');
        setJobs(res.data || []);
      } catch (err) {
        console.error('Error fetching saved jobs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSaved();
  }, []);

  
  const handleUnsave = (jobId) => {
    setJobs(prev => prev.filter(j => j.id !== jobId));
  };

  return (
    <div className="w-full px-4 pt-32 pb-16">
      {}
      <div className="mb-10">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-14 h-14 bg-brand-50 rounded-[1.25rem] flex items-center justify-center">
            <BookmarkCheck size={28} className="text-brand-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Việc đã lưu</h1>
            <p className="text-slate-500 font-medium">
              {jobs.length > 0 ? `${jobs.length} công việc đang chờ bạn` : 'Chưa có công việc nào được lưu'}
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center py-32">
          <Loader2 className="animate-spin text-brand-600 mb-4" size={40} />
          <p className="font-bold text-slate-400">Đang tải danh sách...</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-32 bg-white rounded-[3rem] border border-slate-100 shadow-sm">
          <div className="w-24 h-24 bg-slate-100 rounded-[2rem] mx-auto flex items-center justify-center mb-6">
            <BookmarkCheck size={40} className="text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">Chưa lưu công việc nào</h3>
          <p className="text-slate-400 font-medium mb-8 max-w-sm mx-auto">
            Hãy khám phá các công việc phù hợp và nhấn biểu tượng bookmark để lưu lại nhé!
          </p>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 px-8 py-4 bg-brand-600 text-white font-bold rounded-2xl hover:bg-slate-900 transition shadow-xl shadow-brand-200"
          >
            <Search size={18} /> Tìm kiếm công việc
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {jobs.map((job, idx) => (
            <SavedJobCardWrapper key={job.id} job={job} onUnsave={handleUnsave} />
          ))}
        </div>
      )}
    </div>
  );
};


const SavedJobCardWrapper = ({ job, onUnsave }) => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div>
      <JobCard
        job={job}
        initialSaved={true}
      />
    </div>
  );
};

export default SavedJobs;

