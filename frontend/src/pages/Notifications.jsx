import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Bell, BellOff, CheckCheck, Loader2,
  Briefcase, CheckCircle2, XCircle, Clock, Calendar
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

const TYPE_CONFIG = {
  JOB_APPLIED:          { icon: Briefcase,     color: 'text-brand-600',   bg: 'bg-brand-50' },
  APPLICATION_STATUS:   { icon: CheckCircle2,  color: 'text-emerald-600', bg: 'bg-emerald-50' },
  INTERVIEW_SCHEDULED:  { icon: Calendar,      color: 'text-amber-600',   bg: 'bg-amber-50' },
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

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="w-full px-4 pt-32 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Thông báo</h1>
          {unreadCount > 0 && (
            <p className="text-slate-500 font-bold mt-1">
              Bạn có <span className="text-brand-600 font-bold">{unreadCount}</span> thông báo chưa đọc
            </p>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            disabled={markingAll}
            className="flex items-center gap-2 px-5 py-2.5 bg-brand-50 text-brand-600 font-bold rounded-2xl hover:bg-brand-100 transition text-sm"
          >
            {markingAll ? <Loader2 size={16} className="animate-spin" /> : <CheckCheck size={16} />}
            Đánh dấu tất cả đã đọc
          </button>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center py-32">
          <Loader2 className="animate-spin text-brand-600 mb-4" size={40} />
          <p className="font-bold text-slate-400">Đang tải thông báo...</p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-32 bg-white rounded-[3rem] border border-slate-100 shadow-sm">
          <div className="w-24 h-24 bg-slate-100 rounded-[2rem] mx-auto flex items-center justify-center mb-6">
            <BellOff size={40} className="text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Chưa có thông báo nào</h3>
          <p className="text-slate-400 font-medium">Bạn sẽ nhận thông báo khi có cập nhật về hồ sơ ứng tuyển.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => {
            const cfg = getTypeConfig(n.type);
            const Icon = cfg.icon;
            return (
              <div
                key={n.id}
                onClick={() => !n.read && handleMarkRead(n.id)}
                className={`relative flex gap-5 p-6 rounded-[2rem] border transition-all cursor-pointer group
                  ${n.read
                    ? 'bg-white border-slate-100 opacity-70 hover:opacity-100'
                    : 'bg-white border-brand-100 shadow-md shadow-brand-50 hover:shadow-lg hover:shadow-brand-100'
                  }`}
              >
                {/* Unread indicator */}
                {!n.read && (
                  <span className="absolute top-5 right-5 w-2.5 h-2.5 bg-brand-500 rounded-full" />
                )}

                {/* Icon */}
                <div className={`w-12 h-12 ${cfg.bg} ${cfg.color} rounded-2xl flex items-center justify-center shrink-0 mt-0.5`}>
                  <Icon size={22} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className={`font-bold text-slate-900 mb-1 ${!n.read ? 'text-brand-900' : ''}`}>
                    {n.title}
                  </p>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed line-clamp-2">
                    {n.message}
                  </p>
                  <p className="text-xs text-slate-400 font-bold mt-2 uppercase tracking-widest">
                    {formatTime(n.createdAt)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;

