import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { 
  Building2, 
  MapPin, 
  Users, 
  Globe, 
  Search,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await api.get('/companies');
        setCompanies(response.data);
      } catch (error) {
        console.error('Error fetching companies:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (company.industry && company.industry.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <Loader2 className="animate-spin text-brand-600 mb-4" size={40} />
      <p className="font-bold text-slate-400">Đang tải danh sách công ty...</p>
    </div>
  );

  return (
    <div className="w-full px-4 pt-32 pb-20">
      {/* Header Section */}
      <div className="text-center mb-16 max-w-none mx-auto animate-fade-in">
        <h1 className="text-5xl font-bold text-slate-900 mb-6  tracking-tight">Cộng đồng doanh nghiệp</h1>
        <p className="text-slate-500 font-bold text-lg ">Khám phá và kết nối với những công ty hàng đầu đang tìm kiếm tài năng.</p>
      </div>

      {/* Search Bar */}
      <div className="max-w-xl mx-auto mb-16 relative group">
        <div className="absolute inset-0 bg-brand-500/10 blur-[40px] rounded-full group-hover:bg-brand-500/20 transition-all duration-700 opacity-0 group-hover:opacity-100"></div>
        <div className="relative flex items-center bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden p-2">
          <Search className="ml-6 text-slate-300" size={24} />
          <input
            type="text"
            placeholder="Tìm kiếm công ty, ngành nghề..."
            className="flex-1 px-4 py-4 focus:outline-none font-bold text-slate-700 placeholder:text-slate-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCompanies.map((company, index) => (
          <motion.div
            key={company.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group relative bg-white rounded-[3rem] border border-slate-50 p-8 shadow-2xl shadow-brand-100/20 hover:shadow-brand-500/10 transition-all duration-500 hover:-translate-y-2 overflow-hidden"
          >
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-50 rounded-full -mr-16 -mt-16 group-hover:bg-brand-100 transition-colors duration-500 opacity-20"></div>
            
            <div className="relative z-10">
              <div className="flex items-start gap-6 mb-8">
                <div className="w-20 h-20 bg-white rounded-2xl shadow-lg border border-slate-50 flex items-center justify-center p-3 shrink-0 group-hover:scale-110 transition-transform duration-500">
                  {company.logoUrl ? (
                    <img src={company.logoUrl} alt={company.name} className="w-full h-full object-contain" />
                  ) : (
                    <Building2 className="w-10 h-10 text-brand-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-600 transition-colors truncate mb-1">{company.name}</h3>
                  <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest ">
                    <MapPin size={12} className="text-brand-400" /> {company.address || 'Toàn quốc'}
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-slate-500 font-medium text-sm">
                  <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                    <Users size={14} className="text-slate-400" />
                  </div>
                  <span className="font-bold">{company.companySize || 'N/A'} nhân viên</span>
                </div>
                <div className="flex items-center gap-3 text-slate-500 font-medium text-sm">
                  <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                    <Globe size={14} className="text-slate-400" />
                  </div>
                  <span className="font-bold truncate">{company.industry || 'Đa ngành'}</span>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-brand-100 flex items-center justify-center text-[10px] font-bold text-brand-600">HR</div>
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600">+</div>
                </div>
                <Link 
                  to={`/companies/${company.id}`} 
                  className="flex items-center gap-2 text-brand-600 font-bold text-sm group/btn"
                >
                  Chi tiết <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredCompanies.length === 0 && (
        <div className="text-center py-20 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
          <Building2 size={64} className="mx-auto text-slate-200 mb-6" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">Không tìm thấy doanh nghiệp nào</h3>
          <p className="text-slate-500 ">Thử với từ khóa tìm kiếm khác của bạn</p>
        </div>
      )}
    </div>
  );
};

export default Companies;



