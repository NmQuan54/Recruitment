import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import JobCard from '../components/JobCard';
import { Search, MapPin, Loader2, SlidersHorizontal, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

const JOB_TYPES = [
  { id: 'FULL_TIME', label: 'Toàn thời gian' },
  { id: 'PART_TIME', label: 'Bán thời gian' },
  { id: 'REMOTE', label: 'Làm việc từ xa' },
  { id: 'INTERN', label: 'Thực tập sinh' },
];

const SALARY_RANGES = [
  { id: '', label: 'Tất cả mức lương' },
  { id: '0-10000000', label: 'Dưới 10 triệu', min: 0, max: 10000000 },
  { id: '10000000-20000000', label: '10 – 20 triệu', min: 10000000, max: 20000000 },
  { id: '20000000-40000000', label: '20 – 40 triệu', min: 20000000, max: 40000000 },
  { id: '40000000-', label: 'Trên 40 triệu', min: 40000000, max: null },
];

const JobSearch = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const [filters, setFilters] = useState({
    keyword: '',
    location: '',
    jobType: '',
    salaryRangeId: '',
    categoryId: '',
  });
  const [tempKeyword, setTempKeyword] = useState('');
  const [tempLocation, setTempLocation] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await api.get('/admin/categories');
        setCategories(res.data);
      } catch (_) {}
    };
    fetchCats();
  }, []);

  const fetchJobs = useCallback(async (page = 0) => {
    setLoading(true);
    try {
      const selectedRange = SALARY_RANGES.find(r => r.id === filters.salaryRangeId);
      const params = {
        keyword: filters.keyword || undefined,
        location: filters.location || undefined,
        jobType: filters.jobType || undefined,
        salaryMin: selectedRange?.min ?? undefined,
        salaryMax: selectedRange?.max ?? undefined,
        page,
        size: 9,
      };

      const response = await api.get('/jobs', { params });
      const data = response.data;
      setJobs(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    setTempKeyword(filters.keyword);
    setTempLocation(filters.location);
    fetchJobs(0);
  }, [filters]);

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, keyword: tempKeyword, location: tempLocation }));
  };

  const handleJobTypeChange = (typeId) => {
    setFilters(prev => ({
      ...prev,
      jobType: prev.jobType === typeId ? '' : typeId,
    }));
  };

  const handleSalaryChange = (rangeId) => {
    setFilters(prev => ({ ...prev, salaryRangeId: rangeId }));
  };

  const handleClearFilters = () => {
    setTempKeyword('');
    setTempLocation('');
    setFilters({ keyword: '', location: '', jobType: '', salaryRangeId: '' });
  };

  const hasActiveFilters = filters.keyword || filters.location || filters.jobType || filters.salaryRangeId;

  return (
    <div className="container-center pt-32 pb-16 animate-fade-in">
      {/* Search Header */}
      <div className="mb-16 text-center w-full">
        <h1 className="text-5xl font-bold text-slate-900 mb-6 tracking-tight">
          Tìm kiếm <span className="text-gradient">Cơ Hội Mới</span>
        </h1>
        <p className="text-slate-500 font-bold text-lg mb-10 leading-relaxed">
          Khám phá hàng ngàn công việc hấp dẫn từ những doanh nghiệp hàng đầu.
        </p>

        <form onSubmit={handleSearch} className="glass-effect p-3 rounded-[3rem] border border-white/50 shadow-2xl shadow-brand-100/20 flex flex-col md:flex-row gap-3">
          <div className="flex-[2] flex items-center px-8 py-4 gap-4 bg-white/50 rounded-[2.5rem] border border-slate-100/50 shadow-inner group">
            <Search className="text-brand-500 group-focus-within:scale-110 transition-transform" size={24} />
            <input
              type="text"
              placeholder="Chức danh, từ khóa hoặc công ty"
              className="bg-transparent border-none focus:ring-0 w-full font-bold text-slate-800 placeholder:text-slate-400 placeholder:font-bold"
              value={tempKeyword}
              onChange={(e) => setTempKeyword(e.target.value)}
            />
          </div>
          <div className="flex-1 flex items-center px-8 py-4 gap-4 bg-white/50 rounded-[2.5rem] border border-slate-100/50 shadow-inner group">
            <MapPin className="text-brand-500 group-focus-within:scale-110 transition-transform" size={24} />
            <input
              type="text"
              placeholder="Thành phố, khu vực"
              className="bg-transparent border-none focus:ring-0 w-full font-bold text-slate-800 placeholder:text-slate-400 placeholder:font-bold"
              value={tempLocation}
              onChange={(e) => setTempLocation(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-premium px-12 py-5 rounded-[2.5rem] font-bold text-lg">
            Tìm ngay
          </button>
        </form>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar Filters */}
        <div className="lg:w-[300px] shrink-0">
          <div className="glass-effect p-8 rounded-[3rem] border border-white/50 sticky top-32 shadow-xl shadow-slate-200/50">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold text-slate-900 flex items-center gap-3 text-lg">
                <div className="bg-brand-50 p-2 rounded-xl">
                  <SlidersHorizontal size={20} className="text-brand-600" />
                </div>
                Bộ lọc
              </h3>
              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="text-xs font-bold text-brand-600 uppercase tracking-widest hover:text-brand-700 transition"
                >
                  Xóa tất cả
                </button>
              )}
            </div>

            <div className="space-y-8">
              {/* Loại hình công việc */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-5 uppercase tracking-[0.2em]">
                  Loại hình công việc
                </label>
                <div className="space-y-3">
                  {JOB_TYPES.map((type) => (
                    <label key={type.id} className="flex items-center gap-4 cursor-pointer group">
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          className="peer hidden"
                          checked={filters.jobType === type.id}
                          onChange={() => handleJobTypeChange(type.id)}
                        />
                        <div className="w-6 h-6 rounded-lg border-2 border-slate-200 peer-checked:border-brand-600 peer-checked:bg-brand-600 transition-all duration-300 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                        </div>
                      </div>
                      <span className={`font-bold transition-colors ${filters.jobType === type.id ? 'text-brand-600' : 'text-slate-600 group-hover:text-brand-600'}`}>
                        {type.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Danh mục */}
              <div className="pt-6 border-t border-slate-100">
                <label className="block text-[10px] font-bold text-slate-400 mb-5 uppercase tracking-[0.2em]">
                  Danh mục ngành nghề
                </label>
                <div className="space-y-3">
                   <label className="flex items-center gap-4 cursor-pointer group">
                      <div className="relative flex items-center">
                        <input
                          type="radio"
                          name="category"
                          className="peer hidden"
                          checked={filters.categoryId === ''}
                          onChange={() => setFilters(prev => ({...prev, categoryId: ''}))}
                        />
                        <div className="w-6 h-6 rounded-full border-2 border-slate-200 peer-checked:border-brand-600 transition-all duration-300 flex items-center justify-center">
                          <div className="w-3 h-3 rounded-full bg-brand-600 scale-0 peer-checked:scale-100 transition-transform" />
                        </div>
                      </div>
                      <span className={`font-bold transition-colors ${filters.categoryId === '' ? 'text-brand-600' : 'text-slate-600 group-hover:text-brand-600'}`}>
                        Tất cả ngành nghề
                      </span>
                    </label>
                  {categories.map((cat) => (
                    <label key={cat.id} className="flex items-center gap-4 cursor-pointer group">
                      <div className="relative flex items-center">
                        <input
                          type="radio"
                          name="category"
                          className="peer hidden"
                          checked={filters.categoryId === cat.id.toString()}
                          onChange={() => setFilters(prev => ({...prev, categoryId: cat.id.toString()}))}
                        />
                        <div className="w-6 h-6 rounded-full border-2 border-slate-200 peer-checked:border-brand-600 transition-all duration-300 flex items-center justify-center">
                          <div className="w-3 h-3 rounded-full bg-brand-600 scale-0 peer-checked:scale-100 transition-transform" />
                        </div>
                      </div>
                      <span className={`font-bold transition-colors ${filters.categoryId === cat.id.toString() ? 'text-brand-600' : 'text-slate-600 group-hover:text-brand-600'}`}>
                        {cat.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Mức lương */}
              <div className="pt-6 border-t border-slate-100">
                <label className="block text-[10px] font-bold text-slate-400 mb-5 uppercase tracking-[0.2em]">
                  Mức lương
                </label>
                <div className="space-y-3">
                  {SALARY_RANGES.map((range) => (
                    <label key={range.id} className="flex items-center gap-4 cursor-pointer group">
                      <div className="relative flex items-center">
                        <input
                          type="radio"
                          name="salaryRange"
                          className="peer hidden"
                          checked={filters.salaryRangeId === range.id}
                          onChange={() => handleSalaryChange(range.id)}
                        />
                        <div className="w-6 h-6 rounded-full border-2 border-slate-200 peer-checked:border-brand-600 transition-all duration-300 flex items-center justify-center">
                          <div className="w-3 h-3 rounded-full bg-brand-600 scale-0 peer-checked:scale-100 transition-transform" />
                        </div>
                      </div>
                      <span className={`font-bold transition-colors ${filters.salaryRangeId === range.id ? 'text-brand-600' : 'text-slate-600 group-hover:text-brand-600'}`}>
                        {range.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Job Listings */}
        <div className="flex-grow">
          <div className="flex items-center justify-between mb-8 px-2">
            <p className="font-bold text-slate-500">
              Tìm thấy <span className="text-brand-600 font-bold text-xl">{totalElements}</span> vị trí tuyển dụng
            </p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 glass-effect rounded-[3.5rem] border border-white/50">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-brand-100 border-t-brand-600 rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="text-brand-600 animate-pulse" size={32} />
                </div>
              </div>
              <p className="mt-8 font-bold text-slate-400 uppercase tracking-widest text-sm">Đang tìm kiếm...</p>
            </div>
          ) : jobs.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
                {jobs.map((job, idx) => (
                  <div key={job.id} style={{ animationDelay: `${idx * 80}ms` }}>
                    <JobCard job={job} />
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 mt-12">
                  <button
                    onClick={() => fetchJobs(currentPage - 1)}
                    disabled={currentPage === 0}
                    className="p-3 rounded-2xl bg-white border border-slate-100 hover:bg-brand-50 hover:border-brand-200 disabled:opacity-30 disabled:cursor-not-allowed transition"
                  >
                    <ChevronLeft size={20} className="text-slate-600" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i).map((pageIdx) => (
                    <button
                      key={pageIdx}
                      onClick={() => fetchJobs(pageIdx)}
                      className={`w-11 h-11 rounded-2xl font-bold text-sm transition ${
                        currentPage === pageIdx
                          ? 'bg-brand-600 text-white shadow-lg shadow-brand-200'
                          : 'bg-white border border-slate-100 text-slate-600 hover:bg-brand-50 hover:border-brand-200'
                      }`}
                    >
                      {pageIdx + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => fetchJobs(currentPage + 1)}
                    disabled={currentPage >= totalPages - 1}
                    className="p-3 rounded-2xl bg-white border border-slate-100 hover:bg-brand-50 hover:border-brand-200 disabled:opacity-30 disabled:cursor-not-allowed transition"
                  >
                    <ChevronRight size={20} className="text-slate-600" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-24 glass-effect rounded-[3.5rem] border border-white/50 shadow-inner">
              <div className="bg-white w-24 h-24 rounded-[2rem] shadow-xl shadow-slate-200/50 mx-auto flex items-center justify-center mb-8 ">
                <Search className="text-slate-200" size={48} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Không tìm thấy kết quả</h3>
              <p className="text-slate-500 font-bold max-w-sm mx-auto leading-relaxed">
                Chúng tôi không tìm thấy công việc nào phù hợp. Hãy thử điều chỉnh bộ lọc.
              </p>
              <button
                onClick={handleClearFilters}
                className="mt-10 px-8 py-3 bg-brand-50 text-brand-600 font-bold rounded-2xl hover:bg-brand-100 transition"
              >
                Đặt lại bộ lọc
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobSearch;


