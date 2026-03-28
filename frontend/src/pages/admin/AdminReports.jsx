import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
  TrendingUp, 
  Users, 
  Building2, 
  Briefcase, 
  Loader2,
  PieChart,
  BarChart,
  Calendar,
  ArrowUpRight,
  ChevronRight
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const AdminReports = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/stats');
        setStats(res.data);
      } catch (error) {
        toast.error('Không thể tải dữ liệu báo cáo');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="animate-spin text-brand-600" size={40} />
    </div>
  );

  const statCards = [
    { title: 'Tài khoản', value: stats?.totalUsers || 0, icon: <Users size={28} />, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+12%' },
    { title: 'Doanh nghiệp', value: stats?.totalCompanies || 0, icon: <Building2 size={28} />, color: 'text-purple-600', bg: 'bg-purple-50', trend: '+5%' },
    { title: 'Tin tuyển dụng', value: stats?.totalJobs || 0, icon: <Briefcase size={28} />, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+18%' },
  ];

  return (
    <div className="w-full px-4 pt-32 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-900  mb-2">Báo cáo & Thống kê</h1>
          <p className="text-slate-500 font-bold">Tổng quan tiến độ và hiệu suất hoạt động của toàn bộ nền tảng.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
         {statCards.map((card, i) => (
           <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
              <div className={`absolute -right-4 -bottom-4 w-24 h-24 ${card.bg} rounded-full opacity-0 group-hover:opacity-100 transition-opacity scale-[2] `}></div>
              <div className="flex items-center justify-between mb-6 relative z-10">
                 <div className={`w-14 h-14 ${card.bg} ${card.color} rounded-2xl flex items-center justify-center`}>
                    {card.icon}
                 </div>
                 <span className="flex items-center text-xs font-bold text-emerald-500 bg-emerald-50 px-2.5 py-1 rounded-full ">
                    <ArrowUpRight size={14} /> {card.trend}
                 </span>
              </div>
              <h3 className="text-4xl font-bold text-slate-900 mb-1 relative z-10">{card.value}</h3>
              <p className="text-sm font-bold text-slate-400  uppercase tracking-widest relative z-10">{card.title}</p>
           </div>
         ))}
      </div>

      <div className="grid grid-cols-1 gap-10">
         <div className="bg-brand-600 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group max-w-4xl mx-auto w-full">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="flex items-center justify-between mb-10 relative z-10">
               <h2 className="text-2xl font-bold flex items-center gap-3">
                  <PieChart className="text-brand-100" /> Phân bổ nhân sự
               </h2>
            </div>
            <div className="space-y-6 relative z-10">
               {[
                 { label: 'Công nghệ thông tin', value: 45, color: 'bg-white' },
                 { label: 'Kinh doanh / Sales', value: 25, color: 'bg-emerald-300' },
                 { label: 'Marketing', value: 15, color: 'bg-purple-300' },
                 { label: 'Khác', value: 15, color: 'bg-brand-800' }
               ].map((item, i) => (
                 <div key={i} className="space-y-2">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                       <span>{item.label}</span>
                       <span className="text-brand-200">{item.value}%</span>
                    </div>
                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                       <div 
                         className="h-full bg-current transition-all duration-1000"
                         style={{ width: `${item.value}%`, backgroundColor: item.color === 'bg-white' ? 'white' : '' }}
                       ></div>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

export default AdminReports;


