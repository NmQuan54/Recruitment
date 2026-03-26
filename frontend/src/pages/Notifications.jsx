import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Bell, BellOff, CheckCheck, Loader2,
  Briefcase, CheckCircle2, XCircle, Clock, Calendar, MessageSquare, ChevronRight
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

const TYPE_CONFIG = {
  JOB_APPLIED:          { icon: Briefcase,     color: 'text-brand-600',   bg: 'bg-brand-50' },
  APPLICATION_STATUS:   { icon: CheckCircle2,  color: 'text-emerald-600', bg: 'bg-emerald-50' },
  INTERVIEW_SCHEDULED:  { icon: Calendar,      color: 'text-amber-600',   bg: 'bg-amber-50' },
  INTERVIEW_OPTIONS:    { icon: Calendar,      color: 'text-brand-600',   bg: 'bg-brand-50' },
  CHAT_MESSAGE:         { icon: MessageSquare, color: 'text-blue-600',    bg: 'bg-blue-50' },
  INTERVIEW_BOOKED:     { icon: CheckCircle2,  color: 'text-brand-600',   bg: 'bg-brand-50' },
  GENERAL:              { icon: Bell,          color: 'text-slate-600',   bg: 'bg-slate-50' },
};

const getTypeConfig = (type) => TYPE_CONFIG[type] || TYPE_CONFIG.GENERAL;

const formatTime = (dateStr) => {
  try {
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: vi });
  } catch {
    return '';
  }
};

const NotificationsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data || []);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (_) {}
  };

  const handleMarkAllRead = async () => {
    setMarkingAll(true);
    try {
      await api.put('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (_) {}
    setMarkingAll(false);
  };

  const handleNotificationClick = async (n) => {
    if (!n.read) {
      await handleMarkRead(n.id);
    }

    switch (n.type) {
      case 'JOB_APPLIED':
      case 'APPLICATION_STATUS':
      case 'INTERVIEW_SCHEDULED':
        navigate('/candidate/applied-jobs');
        break;
      case 'INTERVIEW_OPTIONS':
        navigate(`/candidate/applied-jobs?bookingId=${n.referenceId}`);
        break;
      case 'CHAT_MESSAGE':
        navigate('/messages');
        break;
      case 'INTERVIEW_BOOKED':
        navigate('/employer/applications');
        break;
      default:
        // Already on the notifications page or general notification
        break;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen pt-40 pb-32 bg-slate-50 relative overflow-hidden">
      {}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30"></div>
      
      {}
      <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-brand-200/20 rounded-full blur-[120px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-[10%] right-[-10%] w-[400px] h-[400px] bg-amber-100/30 rounded-full blur-[100px] -z-10"></div>

      <div className="max-w-[1200px] mx-auto px-4 relative z-10">
        {}
        <div className="mb-20">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="w-12 h-1 bg-brand-600 rounded-full"></div>
            <span className="text-brand-600 font-black text-xs uppercase tracking-[0.4em]">Hệ thống tín hiệu</span>
          </motion.div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[0.8] mb-6">
                Trung Tâm <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-600">Thông Báo</span>
              </h1>
              {unreadCount > 0 && (
                <p className="text-slate-500 font-bold text-xl flex items-center gap-3">
                  Bạn có <span className="px-4 py-1 bg-brand-600 text-white rounded-full text-lg shadow-lg shadow-brand-200">{unreadCount}</span> vận hội mới chưa khám phá
                </p>
              )}
            </motion.div>

            {unreadCount > 0 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleMarkAllRead}
                disabled={markingAll}
                className="group flex items-center gap-3 px-10 py-5 bg-slate-900 text-white font-black rounded-[2rem] hover:bg-brand-600 transition shadow-2xl shadow-slate-200 text-xs uppercase tracking-widest"
              >
                {markingAll ? <Loader2 size={18} className="animate-spin" /> : <CheckCheck size={18} className="group-hover:rotate-12 transition-transform" />}
                Đánh dấu tất cả đã đọc
              </motion.button>
            )}
          </div>
        </div>

        {}
        {loading ? (
          <div className="flex flex-col items-center py-48">
            <div className="relative">
              <div className="w-24 h-24 border-4 border-slate-200 border-t-brand-600 rounded-full animate-spin" />
              <div className="absolute inset-0 m-auto w-12 h-12 bg-brand-500/10 blur-xl animate-pulse rounded-full" />
            </div>
            <p className="mt-12 font-black text-slate-400 uppercase tracking-[0.5em] text-xs">Đang lắng nghe tín hiệu từ bầu trời...</p>
          </div>
        ) : notifications.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-40 bg-white/40 backdrop-blur-3xl rounded-[4rem] border border-white shadow-2xl px-6 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-200/20 blur-[80px] -z-10"></div>
            <div className="w-32 h-32 bg-white rounded-[3rem] mx-auto flex items-center justify-center mb-10 shadow-xl border border-slate-50 group-hover:rotate-12 transition-transform duration-700">
              <BellOff size={48} className="text-slate-200" />
            </div>
            <h3 className="text-4xl font-black text-slate-900 mb-6 tracking-tighter uppercase leading-none">Bầu trời tĩnh lặng</h3>
            <p className="text-slate-500 font-bold max-w-sm mx-auto leading-relaxed text-lg">Mọi thứ đang được chuẩn bị chu đáo. Chúng tôi sẽ báo tin tốt cho bạn sớm thôi.</p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {notifications.map((n, idx) => {
              const cfg = getTypeConfig(n.type);
              const Icon = cfg.icon;
              return (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => handleNotificationClick(n)}
                  className={`relative flex flex-col md:flex-row gap-8 p-10 rounded-[3.5rem] border transition-all cursor-pointer group
                    ${n.read
                      ? 'bg-white/40 border-slate-100 opacity-60 hover:opacity-100'
                      : 'bg-white border-brand-100 shadow-[0_30px_60px_-15px_rgba(37,99,235,0.08)] hover:border-brand-300 hover:shadow-brand-500/15'
                    }`}
                >
                  {}
                  {!n.read && (
                    <div className="absolute top-10 right-10 flex items-center gap-2">
                       <span className="w-2.5 h-2.5 bg-brand-600 rounded-full animate-ping" />
                       <span className="text-[10px] font-black text-brand-600 uppercase tracking-[0.2em]">Cực nóng</span>
                    </div>
                  )}

                  {}
                  <div className={`w-20 h-20 ${cfg.bg} ${cfg.color} rounded-[2.5rem] flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                    <Icon size={32} />
                  </div>

                  {}
                  <div className="flex-1 min-w-0 md:pr-12">
                     <div className="flex items-center gap-3 mb-3">
                        <span className={`text-[10px] font-black uppercase tracking-widest ${n.read ? 'text-slate-400' : 'text-brand-600'}`}>
                           {n.type?.replace('_', ' ') || 'SYSTEM'}
                        </span>
                        <span className="text-slate-200">•</span>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest flex items-center gap-1.5">
                           <Clock size={12} /> {formatTime(n.createdAt)}
                        </p>
                     </div>
                    
                    <p className={`text-2xl font-bold text-slate-900 mb-3 tracking-tight transition-colors group-hover:text-brand-600`}>
                      {n.title}
                    </p>
                    <p className="text-slate-500 font-bold leading-relaxed text-lg max-w-3xl">
                      {n.message}
                    </p>
                    
                    {!n.read && (
                       <div className="mt-8 flex items-center gap-2 text-brand-600 text-xs font-black uppercase tracking-[0.2em] transform translate-x-0 group-hover:translate-x-2 transition-transform">
                          Khám phá vận hội ngay <ChevronRight size={14} />
                       </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;

