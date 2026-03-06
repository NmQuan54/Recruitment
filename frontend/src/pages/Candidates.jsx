import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Search, MapPin, Briefcase, User, Code, BookOpen, GraduationCap, Mail, Loader2, X, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const avatarColors = [
  'from-blue-500 to-indigo-600',
  'from-purple-500 to-pink-600',
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-orange-600',
  'from-rose-500 to-red-600',
  'from-sky-500 to-cyan-600',
];

const SkillTag = ({ skill }) => (
  <span className="inline-block px-3 py-1 bg-brand-50 text-brand-700 text-xs font-bold rounded-xl border border-brand-100">
    {skill.trim()}
  </span>
);

const CandidateCard = ({ candidate, idx, onMessage }) => {
  const [expanded, setExpanded] = useState(false);
  const colorClass = avatarColors[idx % avatarColors.length];
  const skills = candidate.skills ? candidate.skills.split(',').filter(Boolean) : [];
  const initials = candidate.user?.fullName
    ? candidate.user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '??';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.05 }}
      className="bg-white rounded-[2rem] border border-slate-100 shadow-lg shadow-slate-100/50 hover:shadow-xl hover:shadow-brand-100/20 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start gap-4 mb-5">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colorClass} flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-lg`}>
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-900 text-lg leading-tight truncate">
              {candidate.user?.fullName || 'Ứng viên'}
            </h3>
            <p className="text-brand-600 font-bold text-sm mt-0.5 truncate">
              {candidate.title || 'Chưa cập nhật chức danh'}
            </p>
            <p className="text-slate-400 text-xs font-bold mt-1">
              {candidate.user?.email || ''}
            </p>
          </div>
        </div>

        {/* Summary */}
        {candidate.summary && (
          <p className="text-slate-500 text-sm font-medium leading-relaxed mb-4 line-clamp-2">
            {candidate.summary}
          </p>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {skills.slice(0, 4).map((skill, i) => (
              <SkillTag key={i} skill={skill} />
            ))}
            {skills.length > 4 && (
              <span className="inline-block px-3 py-1 bg-slate-50 text-slate-400 text-xs font-bold rounded-xl border border-slate-100">
                +{skills.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Expandable Details */}
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="border-t border-slate-100 pt-4 mt-2 space-y-3"
          >
            {candidate.experience && (
              <div className="flex gap-3">
                <Briefcase size={16} className="text-brand-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Kinh nghiệm</p>
                  <p className="text-sm text-slate-700 font-medium">{candidate.experience}</p>
                </div>
              </div>
            )}
            {candidate.education && (
              <div className="flex gap-3">
                <GraduationCap size={16} className="text-brand-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Học vấn</p>
                  <p className="text-sm text-slate-700 font-medium">{candidate.education}</p>
                </div>
              </div>
            )}
            {candidate.resumeUrl && (
              <a
                href={candidate.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sm font-bold text-brand-600 hover:text-brand-700 transition"
              >
                <BookOpen size={14} /> Xem CV / Resume
              </a>
            )}
          </motion.div>
        )}

        {}
        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-100">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex-1 py-2.5 text-sm font-bold text-brand-600 bg-brand-50 hover:bg-brand-100 rounded-xl transition"
          >
            {expanded ? 'Thu gọn' : 'Xem thêm'}
          </button>
          {candidate.user?.id && (
            <button
              onClick={() => onMessage(candidate.user.id)}
              className="p-2.5 bg-slate-50 hover:bg-brand-50 text-slate-400 hover:text-brand-600 rounded-xl transition relative"
              title="Nhắn tin"
            >
              <MessageCircle size={18} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const Candidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [searched, setSearched] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleMessage = (candidateUserId) => {
    navigate(`/messages?candidateId=${candidateUserId}`);
  };

  const fetchCandidates = async (kw = '') => {
    setLoading(true);
    try {
      const res = await api.get('/candidate/search', { params: kw ? { keyword: kw } : {} });
      setCandidates(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error fetching candidates:', err);
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearched(keyword);
    fetchCandidates(keyword);
  };

  const handleReset = () => {
    setKeyword('');
    setSearched('');
    fetchCandidates('');
  };

  return (
    <div className="container-center pt-36 pb-20 animate-fade-in">
      {/* Hero Header */}
      <div className="text-center mb-14 max-w-none mx-auto">
        <div className="inline-flex items-center gap-2 px-5 py-2 bg-brand-50 text-brand-600 rounded-2xl text-sm font-bold mb-6 border border-brand-100">
          <User size={16} />
          Kho ứng viên
        </div>
        <h1 className="text-5xl font-bold text-slate-900 tracking-tight leading-tight mb-4">
          Tìm kiếm <span className="text-gradient">Nhân tài</span>
        </h1>
        <p className="text-slate-500 font-bold text-lg leading-relaxed">
          Khám phá hàng trăm ứng viên tiềm năng có kỹ năng phù hợp với nhu cầu tuyển dụng của bạn.
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="max-w-none mx-auto mb-14">
        <div className="glass-effect p-3 rounded-[3rem] border border-white/50 shadow-2xl shadow-brand-100/20 flex gap-3">
          <div className="flex-1 flex items-center px-6 py-3 bg-white/60 rounded-[2.5rem] border border-slate-100/50 gap-3">
            <Search className="text-brand-500 shrink-0" size={20} />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Tìm theo kỹ năng, chức danh..."
              className="bg-transparent border-none focus:ring-0 w-full font-bold text-slate-800 placeholder:text-slate-400 placeholder:font-bold text-sm"
            />
            {keyword && (
              <button type="button" onClick={handleReset} className="text-slate-300 hover:text-slate-500 transition">
                <X size={16} />
              </button>
            )}
          </div>
          <button type="submit" className="btn-premium px-10 py-4 rounded-[2.5rem] font-bold">
            Tìm
          </button>
        </div>
      </form>

      {/* Results header */}
      <div className="flex items-center justify-between mb-8 px-2">
        <p className="font-bold text-slate-500">
          {searched ? (
            <>Kết quả cho <span className="text-slate-900 font-bold">"{searched}"</span>: </>
          ) : 'Tất cả ứng viên: '}
          <span className="text-brand-600 font-bold text-xl">{candidates.length}</span> người
        </p>
        {searched && (
          <button onClick={handleReset} className="text-sm font-bold text-brand-600 hover:text-brand-700 transition flex items-center gap-1">
            <X size={14} /> Xóa bộ lọc
          </button>
        )}
      </div>

      {}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 glass-effect rounded-[3.5rem] border border-white/50">
          <div className="w-20 h-20 border-4 border-brand-100 border-t-brand-600 rounded-full animate-spin mb-6" />
          <p className="font-bold text-slate-400 uppercase tracking-widest text-sm">Đang tải danh sách...</p>
        </div>
      ) : candidates.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {candidates.map((candidate, idx) => (
            <CandidateCard key={candidate.id} candidate={candidate} idx={idx} onMessage={handleMessage} />
          ))}
        </div>
      ) : (
        <div className="text-center py-28 glass-effect rounded-[3.5rem] border border-white/50 shadow-inner">
          <div className="bg-white w-24 h-24 rounded-[2rem] shadow-xl mx-auto flex items-center justify-center mb-6 ">
            <User className="text-slate-200" size={48} />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-3">Không tìm thấy ứng viên</h3>
          <p className="text-slate-500 font-bold max-w-sm mx-auto leading-relaxed">
            Chưa có ứng viên nào phù hợp. Hãy thử điều chỉnh từ khóa tìm kiếm.
          </p>
          <button onClick={handleReset} className="mt-8 px-8 py-3 bg-brand-50 text-brand-600 font-bold rounded-2xl hover:bg-brand-100 transition">
            Xem tất cả
          </button>
        </div>
      )}
    </div>
  );
};

export default Candidates;



