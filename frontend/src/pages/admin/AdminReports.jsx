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
        <button className="px-6 py-3 bg-brand-600 text-white rounded-2xl font-bold text-sm flex items-center gap-2 shadow-xl hover:bg-brand-700 transition">
          <Calendar size={18} /> Tải báo cáo tháng 03/2026
        </button>
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

      <div className="grid lg:grid-cols-2 gap-10">
         <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className="flex items-center justify-between mb-10">
               <h2 className="text-2xl font-bold text-slate-900  flex items-center gap-3">
                  <BarChart className="text-brand-600" /> Tăng trưởng hồ sơ
               </h2>
               <button className="text-brand-500 font-bold text-xs uppercase  flex items-center gap-1 group-hover:gap-2 transition-all">
                  Xem chi tiết <ChevronRight size={14} />
               </button>
            </div>
            <div className="h-64 flex items-end justify-between gap-4 px-4">
               {[40, 70, 45, 90, 65, 80, 100].map((h, i) => (
                 <div key={i} className="flex-1 flex flex-col items-center gap-4">
                    <div 
                      className="w-full bg-slate-50 rounded-2xl relative overflow-hidden group/bar"
                      style={{ height: '100%' }}
                    >
                       <div 
                         className="absolute bottom-0 w-full bg-brand-600 rounded-2xl transition-all duration-1000 group-hover:bg-slate-900"
                         style={{ height: `${h}%` }}
                       ></div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ">{['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'][i]}</span>
                 </div>
               ))}
            </div>
         </div>

         <div className="bg-brand-600 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
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
                         className={`h-full ${item.color} transition-all duration-1000`}
                         style={{ width: `${item.value}%` }}
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


