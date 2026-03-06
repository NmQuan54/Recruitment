import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
  Building2, 
  Search, 
  CheckCircle, 
  XCircle, 
  Loader2,
  ExternalLink,
  Globe,
  MapPin,
  Briefcase
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const AdminCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCompanies = async () => {
    try {
      const res = await api.get('/admin/companies');
      setCompanies(res.data);
    } catch (error) {
      toast.error('Không thể tải danh sách doanh nghiệp');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await api.post(`/admin/companies/${id}/status?active=${!currentStatus}`);
      toast.success('Cập nhật trạng thái thành công');
      fetchCompanies();
    } catch (_) {
      toast.error('Không thể thay đổi trạng thái');
    }
  };

  const filteredCompanies = companies.filter(c => 
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.industry?.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-4xl font-bold text-slate-900  mb-2">Quản lý Doanh nghiệp</h1>
          <p className="text-slate-500 font-bold">Kiểm duyệt và quản lý thông tin các doanh nghiệp trên hệ thống.</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text"
            placeholder="Tìm theo tên hoặc ngành nghề..."
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
                <th className="px-8 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Doanh nghiệp</th>
                <th className="px-8 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Ngành nghề</th>
                <th className="px-8 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Trạng thái</th>
                <th className="px-8 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredCompanies.map(company => (
                <tr key={company.id} className="hover:bg-slate-50/30 transition group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-white border border-slate-100 rounded-2xl flex items-center justify-center p-2 shadow-sm shrink-0">
                         {company.logoUrl ? (
                           <img src={company.logoUrl} alt={company.name} className="w-full h-full object-contain" />
                         ) : (
                           <Building2 className="text-slate-200" size={24} />
                         )}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 leading-tight mb-1">{company.name}</p>
                        <div className="flex items-center gap-3 text-xs font-bold text-slate-400 ">
                           <span className="flex items-center gap-1"><MapPin size={12} /> {company.location}</span>
                           <span className="flex items-center gap-1"><Globe size={12} /> Website</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-center flex-col items-center gap-1">
                      <span className="text-sm font-bold text-slate-700">{company.industry}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Lĩnh vực</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-center">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest  border
                        ${company.user?.active ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}
                      `}>
                        {company.user?.active ? 'Đang hoạt động' : 'Tạm khóa'}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleToggleStatus(company.id, company.user?.active)}
                        className={`p-2.5 rounded-xl transition ${company.user?.active ? 'text-rose-500 bg-rose-50 hover:bg-rose-500 hover:text-white' : 'text-emerald-500 bg-emerald-50 hover:bg-emerald-500 hover:text-white'}`}
                        title={company.user?.active ? 'Khóa doanh nghiệp' : 'Mở khóa'}
                      >
                        {company.user?.active ? <XCircle size={18} /> : <CheckCircle size={18} />}
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

export default AdminCompanies;


