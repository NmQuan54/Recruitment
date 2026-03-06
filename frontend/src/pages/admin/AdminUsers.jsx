import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
  Users, 
  Search, 
  ShieldCheck, 
  ShieldAlert, 
  Trash2, 
  Loader2,
  Lock,
  Unlock,
  Mail,
  MoreVertical
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch (error) {
      toast.error('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await api.post(`/admin/users/${id}/status?active=${!currentStatus}`);
      toast.success('Cập nhật trạng thái thành công');
      fetchUsers();
    } catch (_) {
      toast.error('Không thể thay đổi trạng thái');
    }
  };

  const filteredUsers = users.filter(u => 
    u.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-4xl font-bold text-slate-900  mb-2">Quản lý Người dùng</h1>
          <p className="text-slate-500 font-bold">Quản trị viên có thể kiểm soát trạng thái và quyền hạn của tất cả tài khoản.</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text"
            placeholder="Tìm theo tên hoặc email..."
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
                <th className="px-8 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Người dùng</th>
                <th className="px-8 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Vai trò</th>
                <th className="px-8 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Trạng thái</th>
                <th className="px-8 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-slate-50/30 transition group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-brand-50 text-brand-600 rounded-xl flex items-center justify-center font-bold text-lg">
                        {user.fullName?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{user.fullName}</p>
                        <p className="text-xs font-bold text-slate-400  flex items-center gap-1">
                           <Mail size={12} /> {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-center">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest  border
                        ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700 border-purple-200' : 
                          user.role === 'EMPLOYER' ? 'bg-blue-100 text-blue-700 border-blue-200' : 
                          'bg-emerald-100 text-emerald-700 border-emerald-200'}
                      `}>
                        {user.role}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-center">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest  border
                        ${user.active ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}
                      `}>
                        {user.active ? 'Hoạt động' : 'Đã khóa'}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleToggleStatus(user.id, user.active)}
                        className={`p-2.5 rounded-xl transition ${user.active ? 'text-rose-500 bg-rose-50 hover:bg-rose-500 hover:text-white' : 'text-emerald-500 bg-emerald-50 hover:bg-emerald-500 hover:text-white'}`}
                        title={user.active ? 'Khóa tài khoản' : 'Mở khóa'}
                      >
                        {user.active ? <Lock size={18} /> : <Unlock size={18} />}
                      </button>
                      <button className="p-2.5 text-slate-300 hover:text-slate-600 transition">
                         <MoreVertical size={18} />
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

export default AdminUsers;


