import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { 
  Users, 
  Building2, 
  Briefcase, 
  ListFilter, 
  TrendingUp, 
  Settings, 
  ChevronRight,
  ArrowUpRight,
  Bell,
  Search,
  Plus,
  Loader2
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes] = await Promise.all([
          api.get('/admin/stats'),
          
        ]);
        setStats(statsRes.data);
        
        setRecentActivities([
          { id: 1, type: 'USER', text: 'Người dùng mới đăng ký: Nguyễn Văn A', time: '2 phút trước' },
          { id: 2, type: 'JOB', text: 'Công ty TechGlobal đăng tin tuyển dụng mới', time: '15 phút trước' },
          { id: 3, type: 'COMPANY', text: 'Yêu cầu phê duyệt doanh nghiệp: X-Soft Co.', time: '1 giờ trước' },
          { id: 4, type: 'ALERT', text: 'Báo cáo vi phạm tin tuyển dụng #1024', time: '3 giờ trước' }
        ]);
      } catch (error) {
        toast.error('Không thể tải dữ liệu tổng quan');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="animate-spin text-brand-600" size={40} />
    </div>
  );

  const menuItems = [
    { label: 'Người dùng', path: '/admin/users', icon: <Users size={24} />, count: stats?.totalUsers || 0, color: 'text-blue-600', bg: 'bg-blue-50', desc: 'Quản lý tài khoản & Phân quyền' },
    { label: 'Doanh nghiệp', path: '/admin/companies', icon: <Building2 size={24} />, count: stats?.totalCompanies || 0, color: 'text-purple-600', bg: 'bg-purple-50', desc: 'Kiểm duyệt & Thông tin công ty' },
    { label: 'Việc làm', path: '/admin/jobs', icon: <Briefcase size={24} />, count: stats?.totalJobs || 0, color: 'text-emerald-600', bg: 'bg-emerald-50', desc: 'Giám sát tin đăng tuyển dụng' },
    { label: 'Danh mục', path: '/admin/categories', icon: <ListFilter size={24} />, count: stats?.totalCategories || 0, color: 'text-amber-600', bg: 'bg-amber-50', desc: 'Cấu hình ngành nghề hệ thống' },
    { label: 'Báo cáo', path: '/admin/reports', icon: <TrendingUp size={24} />, count: 'LIVE', color: 'text-rose-600', bg: 'bg-rose-50', desc: 'Thống kê & Hiệu suất nền tảng' },
  ];

  return (
    <div className="w-full px-4 pt-32 pb-20">
      {}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <span className="bg-brand-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">Hệ thống</span>
              <h1 className="text-4xl font-bold text-slate-900  tracking-tight">Trung tâm Quản trị</h1>
           </div>
           <p className="text-slate-500 font-bold ">Chào mừng trở lại, quản trị viên. Dưới đây là tình hình hệ thống hôm nay.</p>
        </div>
        <div className="flex items-center gap-4">
           <button className="relative w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100 hover:text-brand-600 transition shadow-sm">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>
           </button>
           <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-bold  shadow-xl">AD</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
         {}
         <div className="lg:col-span-2 grid sm:grid-cols-2 gap-6">
            {menuItems.map((item, i) => (
              <Link 
                key={i} 
                to={item.path}
                className="group bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-brand-500/10 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-56"
              >
                 <div className="relative z-10 flex justify-between items-start">
                    <div className={`w-14 h-14 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                       {item.icon}
                    </div>
                    <div className="text-right">
                       <p className="text-3xl font-bold text-slate-900">{item.count}</p>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ">Dữ liệu</p>
                    </div>
                 </div>
                 <div className="relative z-10">
                    <h3 className="text-xl font-bold text-slate-900 mb-1 flex items-center gap-2">
                       {item.label} <ArrowUpRight size={16} className="text-brand-500 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </h3>
                    <p className="text-xs font-bold text-slate-400  line-clamp-1">{item.desc}</p>
                 </div>
                 {}
                 <div className={`absolute -right-8 -bottom-8 w-32 h-32 ${item.bg} rounded-full opacity-0 group-hover:opacity-100 transition-opacity scale-150`}></div>
              </Link>
            ))}
         </div>

         <div className="space-y-8">
            <div className="bg-brand-600 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
               <h3 className="text-2xl font-bold mb-4">Chào mừng Admin!</h3>
               <p className="text-brand-100 font-bold mb-8 opacity-90">Hệ thống đang hoạt động ổn định. Kiểm tra ngay các hoạt động mới nhất bên dưới.</p>
               <div className="flex gap-4">
                  <button className="px-6 py-3 bg-white text-brand-600 rounded-2xl font-bold text-sm shadow-xl hover:bg-brand-50 transition">Báo cáo mới</button>
                  <button className="px-6 py-3 bg-brand-700 text-white rounded-2xl font-bold text-sm hover:bg-brand-800 transition">Cài đặt</button>
               </div>
            </div>

            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
               <h2 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                  <TrendingUp className="text-brand-600" /> Hoạt động mới
               </h2>
               <div className="space-y-6">
                  {recentActivities.map(activity => (
                    <div key={activity.id} className="flex gap-4 group">
                       <div className="w-1 h-12 bg-slate-100 group-hover:bg-brand-600 transition-colors rounded-full shrink-0"></div>
                       <div>
                          <p className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors">{activity.text}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{activity.time}</p>
                       </div>
                    </div>
                  ))}
               </div>
               <button className="w-full mt-10 py-4 bg-slate-50 border border-slate-100 hover:bg-slate-100 rounded-2xl font-bold text-xs uppercase tracking-widest transition text-slate-400">
                  Xem tất cả nhật ký
               </button>
            </div>

            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
               <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Settings size={18} className="text-brand-600" /> Trạng thái Server
               </h3>
               <div className="space-y-6">
                  {[
                    { label: 'Database Service', status: 'Healthy', color: 'text-emerald-500' },
                    { label: 'Storage API', status: 'Online', color: 'text-emerald-500' },
                    { label: 'Search Engine', status: 'Syncing', color: 'text-amber-500' }
                  ].map((s, i) => (
                    <div key={i} className="flex items-center justify-between">
                       <span className="text-xs font-bold text-slate-500">{s.label}</span>
                       <span className={`text-[10px] font-bold uppercase ${s.color}`}>{s.status}</span>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default AdminDashboard;


