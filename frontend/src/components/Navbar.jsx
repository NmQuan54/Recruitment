import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import {
  Briefcase,
  LogOut,
  Users,
  Search,
  Megaphone,
  Home,
  UserPlus,
  Bell,
  BookmarkCheck,
  KeyRound,
  User,
  ChevronDown,
  MessageSquare,
  ShieldCheck,
  FileText,
  LayoutDashboard,
  Building2,
  DollarSign,
  ListFilter,
  BarChart3,
  Settings,
  UserCheck,
  Send,
  CreditCard,
  PlusCircle,
  Sparkles,
  Zap,
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadChatCount, setUnreadChatCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMenuOpen(false);
  };


  useEffect(() => {
    if (!user) { setUnreadCount(0); return; }
    const fetchUnread = async () => {
      try {
        const res = await api.get('/notifications/unread-count');
        setUnreadCount(res.data.count || 0);
      } catch (_) { }
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, [user]);


  useEffect(() => {
    if (!user) { setUnreadChatCount(0); return; }
    const fetchUnreadChat = async () => {
      try {
        const res = await api.get('/chat/rooms/unread-counts');
        const total = Object.values(res.data).reduce((sum, c) => sum + (c || 0), 0);
        setUnreadChatCount(total);
      } catch (_) { }
    };
    fetchUnreadChat();
    const interval = setInterval(fetchUnreadChat, 15000);
    return () => clearInterval(interval);
  }, [user]);


  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);


  const guestNavItems = [
    { label: 'Trang chủ', path: '/', icon: Home },
    { label: 'Tìm việc làm', path: '/jobs', icon: Search },
    { label: 'Ưa chuộng', path: '/hot-jobs', icon: Zap },
    { label: 'Quét CV AI', path: '/ai-scanner', icon: Sparkles },
    { label: 'Công ty', path: '/companies', icon: Building2 },
  ];


  const adminMenuItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Quản lý người dùng', path: '/admin/users', icon: Users },
    { label: 'Quản lý doanh nghiệp', path: '/admin/companies', icon: Briefcase },
    { label: 'Quản lý bài đăng', path: '/admin/jobs', icon: FileText },
    { label: 'Quản lý ngành nghề', path: '/admin/categories', icon: ListFilter },
    { label: 'Báo cáo hệ thống', path: '/admin/reports', icon: BarChart3 },
    { label: 'Đổi mật khẩu', path: '/change-password', icon: KeyRound },
  ];


  const employerMenuItems = [
    { label: 'Bảng điều khiển', path: '/employer/dashboard', icon: LayoutDashboard },
    { label: 'Đăng tin mới', path: '/employer/post-job', icon: PlusCircle },
    { label: 'Tin đã đăng', path: '/employer/jobs', icon: Briefcase },
    { label: 'Dịch vụ quảng cáo', path: '/employer/jobs', icon: Zap },
    { label: 'Danh sách ứng tuyển', path: '/employer/applications', icon: UserCheck },
    { label: 'Tin nhắn/Chat', path: '/messages', icon: MessageSquare },
    { label: 'Hồ sơ công ty', path: '/employer/company', icon: ShieldCheck },
    { label: 'Đổi mật khẩu', path: '/change-password', icon: KeyRound },
  ];


  const candidateMenuItems = [
    { label: 'Dashboard', path: '/candidate/dashboard', icon: LayoutDashboard },
    { label: 'Việc làm đã lưu', path: '/candidate/saved-jobs', icon: BookmarkCheck },
    { label: 'Việc làm đã ứng tuyển', path: '/candidate/applied-jobs', icon: Send },
    { label: 'Tin nhắn/Chat', path: '/messages', icon: MessageSquare },
    { label: 'Đổi mật khẩu', path: '/change-password', icon: KeyRound },
  ];

  const getMenuItems = () => {
    if (user?.role === 'ADMIN') return adminMenuItems;
    if (user?.role === 'EMPLOYER') return employerMenuItems;
    if (user?.role === 'CANDIDATE') return candidateMenuItems;
    return [];
  };

  const menuItems = getMenuItems();
  const navItems = user ? guestNavItems : guestNavItems;

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] px-4 py-6">
      <div className="max-w-[90rem] mx-auto w-full">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-brand-600/90 backdrop-blur-xl rounded-[2.5rem] border border-white/20 shadow-[0_20px_50px_rgba(37,99,235,0.2)] h-20 px-6 lg:px-10 flex justify-between items-center transition-all duration-500"
        >
          { }
          <div className="flex items-center gap-6 xl:gap-12">
            <Link to="/" className="flex items-center group shrink-0">
              <motion.img
                src="/logo.png"
                alt="RecruitPro"
                whileHover={{ scale: 1.05 }}
                className="h-12 w-auto rounded-xl bg-white px-2 py-1 shadow-lg object-contain"
              />
            </Link>

            { }
            <div className="hidden lg:flex items-center gap-1 xl:gap-3">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-4 xl:px-5 py-2.5 rounded-2xl text-[13px] font-bold tracking-tight transition-all duration-500 flex items-center gap-2 group
                    ${isActive(item.path) ? 'text-brand-600' : 'text-brand-50 hover:text-white'}`}
                >
                  <AnimatePresence>
                    {isActive(item.path) && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 bg-white rounded-2xl shadow-lg"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ type: 'spring', bounce: 0.25, duration: 0.5 }}
                      />
                    )}
                  </AnimatePresence>
                  <span className="relative flex items-center gap-2 z-10">
                    <item.icon
                      size={16}
                      className={isActive(item.path) ? 'text-brand-600' : 'text-brand-200 group-hover:text-white transition-colors duration-300'}
                    />
                    {item.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          { }
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3 pl-6 border-l border-white/10">
                { }
                <Link
                  to="/notifications"
                  className="relative p-3 bg-white/10 text-white rounded-2xl hover:bg-white/20 transition border border-white/5"
                  title="Thông báo"
                >
                  <Bell size={18} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg animate-pulse">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>

                { }
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex items-center gap-3 pl-3 pr-4 py-2 bg-white/10 text-white rounded-2xl hover:bg-white/20 transition border border-white/5"
                  >
                    <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                      {user.fullName?.charAt(0).toUpperCase()}
                    </div>
                    <div className="hidden sm:flex flex-col items-start">
                      <span className="text-xs font-bold text-white leading-none">{user.fullName}</span>
                      <span className="text-[9px] font-bold text-brand-200 uppercase tracking-widest mt-1">
                        {user.role === 'EMPLOYER' ? 'Doanh nghiệp' : 'Ứng viên'}
                      </span>
                    </div>
                    <ChevronDown
                      size={14}
                      className={`text-white/60 transition-transform duration-300 ${menuOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  <AnimatePresence>
                    {menuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-3 w-56 bg-white rounded-[1.5rem] shadow-2xl shadow-slate-900/10 border border-slate-100 overflow-hidden z-50"
                      >
                        <div className="p-2">
                          {menuItems.map((item) => (
                            <Link
                              key={item.label}
                              to={item.path}
                              onClick={() => setMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-brand-50 hover:text-brand-600 rounded-2xl transition"
                            >
                              <item.icon size={16} />
                              <span className="flex-1">{item.label}</span>
                              {item.path === '/messages' && unreadChatCount > 0 && (
                                <span className="min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                                  {unreadChatCount > 9 ? '9+' : unreadChatCount}
                                </span>
                              )}
                            </Link>
                          ))}
                        </div>
                        <div className="border-t border-slate-100 p-2">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-2xl transition"
                          >
                            <LogOut size={16} />
                            Đăng xuất
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="px-5 py-2.5 text-white hover:text-brand-100 font-bold text-sm transition-all  tracking-tight">
                  Đăng nhập
                </Link>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link to="/register" className="bg-white text-brand-600 px-7 py-3 rounded-[1.25rem] font-bold text-sm shadow-xl hover:bg-brand-50 transition-all tracking-tight  block">
                    Gia nhập ngay
                  </Link>
                </motion.div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </nav>
  );
};

export default Navbar;


