import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
  Briefcase, 
  Search, 
  Trash2, 
  Loader2,
  ExternalLink,
  MapPin,
  Calendar,
  Clock,
  Filter
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const AdminJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchJobs = async () => {
    try {
      const res = await api.get('/admin/jobs');
      setJobs(res.data);
    } catch (error) {
      toast.error('Không thể tải danh sách tin tuyển dụng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa tin tuyển dụng này?')) return;
    try {
      await api.delete(`/admin/jobs/${id}`);
      toast.success('Đã xóa tin tuyển dụng');
      setJobs(jobs.filter(j => j.id !== id));
    } catch (_) {
      toast.error('Không thể xóa tin này');
    }
  };

  const filteredJobs = jobs.filter(j => 
    j.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    j.company?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="animate-spin text-brand-600" size={40} />
    </div>
  );

  return (
    <div className="w-full px-4 pt-32 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-900  mb-2">Quản lý Tin tuyển dụng</h1>
          <p className="text-slate-500 font-bold">Giám sát và kiểm soát chất lượng các bài đăng tuyển dụng trên nền tảng.</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text"
            placeholder="Tìm theo tiêu đề hoặc công ty..."
            className="w-full pl-12 pr-6 py-4 bg-white rounded-2xl border border-slate-100 shadow-sm font-bold text-slate-900 focus:ring-2 focus:ring-brand-500 transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Tin tuyển dụng</th>
                <th className="px-8 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Trạng thái</th>
                <th className="px-8 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Ngày đăng</th>
                <th className="px-8 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredJobs.map(job => (
                <tr key={job.id} className="hover:bg-slate-50/30 transition group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-50 text-brand-600 rounded-xl flex items-center justify-center shrink-0 border border-slate-100 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                        <Briefcase size={24} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 leading-tight mb-1">{job.title}</p>
                        <p className="text-xs font-bold text-slate-400  flex items-center gap-1">
                           {job.company?.name} • <MapPin size={10} /> {job.location}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest  border
                      ${job.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'}
                    `}>
                      {job.status === 'ACTIVE' ? 'Công khai' : 'Đã đóng'}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <p className="text-sm font-bold text-slate-700">{new Date(job.createdAt).toLocaleDateString('vi-VN')}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-center gap-1 ">
                       <Clock size={10} /> {new Date(job.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleDelete(job.id)}
                        className="p-2.5 rounded-xl text-rose-500 bg-rose-50 hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                        title="Xóa tin đăng"
                      >
                        <Trash2 size={18} />
                      </button>
                      <button className="p-2.5 text-slate-300 hover:text-brand-600 transition">
                         <ExternalLink size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminJobs;


