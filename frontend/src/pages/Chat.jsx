import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useSearchParams } from 'react-router-dom';
import { 
  Send, 
  Search, 
  User, 
  Building, 
  MessageSquare,
  Loader2,
  ChevronLeft,
  MoreVertical,
  Briefcase,
  MessageCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const Chat = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState({});
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);
  const initializedRef = useRef(false);
  const lastMessageCountRef = useRef(0);

  // Fetch rooms
  const fetchRooms = async () => {
    try {
      const res = await api.get('/chat/rooms');
      setRooms(res.data);
      return res.data;
    } catch (error) {
      console.error('Error fetching rooms:', error);
      return [];
    }
  };

  // Fetch unread counts
  const fetchUnreadCounts = async () => {
    try {
      const res = await api.get('/chat/rooms/unread-counts');
      setUnreadCounts(res.data);
    } catch (_) {}
  };

  useEffect(() => {
    const init = async () => {
      const fetchedRooms = await fetchRooms();
      await fetchUnreadCounts();
      setLoading(false);

      // If candidateId param — employer clicked message icon
      const candidateIdParam = searchParams.get('candidateId');
      if (candidateIdParam && user?.role === 'EMPLOYER' && !initializedRef.current) {
        initializedRef.current = true;
        // Try to find existing room first
        const existing = fetchedRooms.find(
          r => r.candidate?.id === parseInt(candidateIdParam)
        );
        if (existing) {
          handleOpenRoom(existing);
        } else {
          // Create room with a greeting message — need employer's first job id
          // We'll just navigate to messages with a "new chat" prompt
          try {
            // Get employer's first active job
            const jobsRes = await api.get('/employer/jobs');
            const jobs = jobsRes.data;
            if (jobs && jobs.length > 0) {
              const room = await api.post('/chat/rooms', {
                employerId: user.id,
                candidateId: parseInt(candidateIdParam),
                jobId: jobs[0].id
              });
              const updatedRooms = await fetchRooms();
              const newRoom = updatedRooms.find(r => r.id === room.data.id);
              if (newRoom) handleOpenRoom(newRoom);
            }
          } catch (err) {
            console.error('Could not create chat room:', err);
          }
        }
      }
    };
    init();

    const interval = setInterval(async () => {
      await fetchRooms();
      await fetchUnreadCounts();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeRoom) {
      const fetchMessages = async () => {
        try {
          const res = await api.get(`/chat/rooms/${activeRoom.id}/messages`);
          const newMessages = res.data;
          // Only scroll if new messages arrived
          if (newMessages.length > lastMessageCountRef.current) {
            setMessages(newMessages);
            lastMessageCountRef.current = newMessages.length;
            scrollToBottom();
          } else {
            setMessages(newMessages);
          }
        } catch (_) {}
      };
      fetchMessages();
      // Mark as read when opening
      api.post(`/chat/rooms/${activeRoom.id}/read`).then(() => {
        setUnreadCounts(prev => ({ ...prev, [activeRoom.id]: 0 }));
      }).catch(() => {});

      const interval = setInterval(async () => {
        const res = await api.get(`/chat/rooms/${activeRoom.id}/messages`).catch(() => null);
        if (res) {
          const newMessages = res.data;
          if (newMessages.length > lastMessageCountRef.current) {
            setMessages(newMessages);
            lastMessageCountRef.current = newMessages.length;
            scrollToBottom();
          } else {
            setMessages(newMessages);
          }
          // Mark as read
          api.post(`/chat/rooms/${activeRoom.id}/read`).then(() => {
            setUnreadCounts(prev => ({ ...prev, [activeRoom.id]: 0 }));
          }).catch(() => {});
        }
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [activeRoom]);

  const handleOpenRoom = (room) => {
    setActiveRoom(room);
    lastMessageCountRef.current = 0; // Reset counter when switching rooms
    // Mark as read immediately
    api.post(`/chat/rooms/${room.id}/read`).then(() => {
      setUnreadCounts(prev => ({ ...prev, [room.id]: 0 }));
    }).catch(() => {});
  };

  const scrollToBottom = (behavior = 'smooth') => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: behavior
      });
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!content.trim() || sending) return;

    setSending(true);
    try {
      const res = await api.post(`/chat/rooms/${activeRoom.id}/messages`, { content });
      setMessages(prev => [...prev, res.data]);
      setContent('');
      scrollToBottom();
      // Refresh rooms to update lastMessage
      fetchRooms();
    } catch (_) {
    } finally {
      setSending(false);
    }
  };

  const getOtherUser = (room) => {
    return user.role === 'EMPLOYER' ? room.candidate : room.employer;
  };

  // Total unread across all rooms
  const totalUnread = Object.values(unreadCounts).reduce((sum, c) => sum + (c || 0), 0);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="animate-spin text-brand-600" size={40} />
    </div>
  );

  return (
    <div className="w-full px-4 pt-32 pb-10 h-[calc(100vh-80px)]">
      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-brand-100/50 border border-slate-100 overflow-hidden flex h-full">
        
        {/* Sidebar: Rooms */}
        <div className={`w-full md:w-80 lg:w-96 border-r border-slate-100 flex flex-col ${activeRoom ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-6 border-b border-slate-50">
            <h2 className="text-2xl font-bold text-slate-900  flex items-center gap-3">
              <div className="relative">
                <MessageSquare className="text-brand-600" />
                {totalUnread > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {totalUnread > 9 ? '9+' : totalUnread}
                  </span>
                )}
              </div>
              Tin nhắn
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {rooms.length > 0 ? rooms.map(room => {
              const other = getOtherUser(room);
              const isActive = activeRoom?.id === room.id;
              const unread = unreadCounts[room.id] || 0;
              return (
                <button 
                  key={room.id}
                  onClick={() => handleOpenRoom(room)}
                  className={`w-full p-4 rounded-2xl flex items-center gap-4 transition text-left
                    ${isActive ? 'bg-brand-600 text-white shadow-lg shadow-brand-200' : 'hover:bg-slate-50 text-slate-900'}
                  `}
                >
                  <div className="relative shrink-0">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold
                      ${isActive ? 'bg-white/20' : 'bg-brand-50 text-brand-600'}
                    `}>
                      {other?.fullName?.charAt(0) || '?'}
                    </div>
                    {/* Unread badge */}
                    {unread > 0 && !isActive && (
                      <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-lg shadow-red-200">
                        {unread > 9 ? '9+' : unread}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <p className={`font-bold truncate text-sm ${unread > 0 && !isActive ? 'text-slate-900' : ''}`}>
                        {other?.fullName || 'Người dùng'}
                      </p>
                      <span className={`text-[9px] ${isActive ? 'text-white/60' : 'text-slate-400'}`}>
                        {room.lastContentAt && format(new Date(room.lastContentAt), 'HH:mm')}
                      </span>
                    </div>
                    <p className={`text-[11px] font-bold truncate ${
                      isActive ? 'text-white/70' : unread > 0 ? 'text-slate-700 font-bold' : 'text-slate-400'
                    }`}>
                      {room.lastMessage || 'Bắt đầu cuộc trò chuyện...'}
                    </p>
                    <p className={`text-[9px] mt-1 font-bold uppercase tracking-widest ${isActive ? 'text-brand-200' : 'text-brand-500'}`}>
                       {room.job?.title}
                    </p>
                  </div>
                </button>
              );
            }) : (
              <div className="text-center py-20 text-slate-400  font-bold">Chưa có hội thoại nào</div>
            )}
          </div>
        </div>

        {/* Main Content: Messages */}
        <div className={`flex-1 flex flex-col ${!activeRoom ? 'hidden md:flex items-center justify-center bg-slate-50/30' : 'flex'}`}>
          {activeRoom ? (
            <>
              {/* Chat Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button onClick={() => setActiveRoom(null)} className="md:hidden text-slate-400">
                    <ChevronLeft size={24} />
                  </button>
                  <div className="w-10 h-10 bg-brand-50 text-brand-600 rounded-xl flex items-center justify-center font-bold">
                     {getOtherUser(activeRoom)?.fullName?.charAt(0) || '?'}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 leading-tight">{getOtherUser(activeRoom)?.fullName}</h3>
                    <p className="text-[10px] font-bold text-brand-600 uppercase tracking-widest flex items-center gap-1">
                      <Briefcase size={10} /> {activeRoom.job?.title}
                    </p>
                  </div>
                </div>
                <button className="text-slate-300 hover:text-slate-600"><MoreVertical /></button>
              </div>

              {/* Messages Area */}
              <div 
                ref={containerRef}
                className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/20"
              >
                {messages.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <MessageCircle className="text-brand-400" size={32} />
                    </div>
                    <p className="text-slate-400 font-bold text-sm">Hãy bắt đầu cuộc trò chuyện!</p>
                  </div>
                )}
                {messages.map((msg, i) => {
                  const isMine = msg.sender.id === user.id;
                  return (
                    <div key={i} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] space-y-1`}>
                        <div className={`p-4 rounded-[1.5rem] font-bold text-sm shadow-sm
                          ${isMine ? 'bg-brand-600 text-white rounded-br-none' : 'bg-white text-slate-700 border border-slate-100 rounded-bl-none'}
                        `}>
                          {msg.content}
                        </div>
                        <p className={`text-[9px] font-bold uppercase tracking-tighter opacity-40 px-2 ${isMine ? 'text-right' : 'text-left'}`}>
                          {format(new Date(msg.sentAt), 'HH:mm • dd/MM')}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-6">
                <form onSubmit={handleSendMessage} className="relative">
                  <input 
                    type="text" 
                    className="w-full pl-6 pr-16 py-5 bg-slate-50 border-none rounded-[2rem] font-bold text-slate-900 focus:ring-2 focus:ring-brand-500/10 placeholder:text-slate-300"
                    placeholder="Nhập nội dung tin nhắn..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                  <button 
                    type="submit"
                    disabled={!content.trim() || sending}
                    className="absolute right-3 top-3 w-12 h-12 bg-brand-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-brand-200 hover:bg-slate-900 transition disabled:opacity-50"
                  >
                    {sending ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                  </button>
                </form>
              </div>
            </>
          ) : (
             <div className="text-center">
                <div className="w-20 h-20 bg-brand-50 text-brand-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                   <MessageSquare size={40} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 ">Hộp thư trao đổi</h3>
                <p className="text-slate-400 font-bold max-w-xs mx-auto mt-2">Chọn một hội thoại bên trái để bắt đầu trao đổi với đối tác</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;


