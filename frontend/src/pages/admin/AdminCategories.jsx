import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
  ListFilter, 
  Plus, 
  Trash2, 
  Loader2,
  Tag,
  AlignLeft,
  Search,
  Edit,
  X
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCat, setEditingCat] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '', description: '' });
  const [showEditModal, setShowEditModal] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/admin/categories');
      setCategories(res.data);
    } catch (error) {
      toast.error('Không thể tải danh sách danh mục');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/categories', newCategory);
      toast.success('Đã thêm danh mục mới');
      setNewCategory({ name: '', description: '' });
      fetchCategories();
    } catch (_) {
      toast.error('Có lỗi xảy ra');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Xác nhận xóa danh mục này?')) return;
    try {
      await api.delete(`/admin/categories/${id}`);
      toast.success('Đã xóa danh mục');
      fetchCategories();
    } catch (_) {
      toast.error('Có lỗi xảy ra hoặc danh mục đang có việc làm');
    }
  };

  const handleOpenEdit = (cat) => {
    setEditingCat(cat);
    setEditFormData({ name: cat.name, description: cat.description || '' });
    setShowEditModal(true);
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/admin/categories/${editingCat.id}`, editFormData);
      toast.success('Cập nhật thành công');
      setShowEditModal(false);
      fetchCategories();
    } catch (_) {
      toast.error('Có lỗi xảy ra khi cập nhật');
    }
  };

  const filteredCategories = categories.filter(c => 
    c.name?.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-4xl font-bold text-slate-900  mb-2">Quản lý Danh mục</h1>
          <p className="text-slate-500 font-bold">Cấu hình các ngành nghề và phân loại công việc trên hệ thống.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        {}
        <div className="lg:col-span-1">
          <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl sticky top-32 overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
             <h2 className="text-2xl font-bold  mb-8 flex items-center gap-3 relative z-10">
               <Plus className="text-brand-500" /> Thêm danh mục
             </h2>
             <form onSubmit={handleAddCategory} className="space-y-6 relative z-10">
                <div>
                   <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1 mb-2 block ">Tên danh mục</label>
                   <input 
                     required
                     type="text" 
                     className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl font-bold placeholder:text-white/20 focus:bg-white/10 transition"
                     value={newCategory.name}
                     onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                     placeholder="VD: CNTT / Phần mềm"
                   />
                </div>
                <div>
                   <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1 mb-2 block ">Mô tả chi tiết</label>
                   <textarea 
                     className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl font-bold placeholder:text-white/20 h-40 focus:bg-white/10 transition"
                     value={newCategory.description}
                     onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                     placeholder="Mô tả ngắn gọn về ngành này..."
                   ></textarea>
                </div>
                <button type="submit" className="w-full py-5 bg-brand-600 hover:bg-white hover:text-brand-600 rounded-2xl font-bold transition  shadow-xl shadow-brand-500/20 active:scale-95">
                   Xác nhận thêm mới
                </button>
             </form>
          </div>
        </div>

        {}
        <div className="lg:col-span-2 space-y-6">
           <div className="relative mb-8">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="Tìm danh mục nhanh..."
                className="w-full pl-16 pr-8 py-5 bg-white border border-slate-100 rounded-[2rem] font-bold text-slate-900 shadow-sm focus:ring-2 focus:ring-brand-500 transition"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>

           <div className="grid sm:grid-cols-2 gap-4">
              {filteredCategories.map(cat => (
                 <div key={cat.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-brand-500/5 transition-all group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button 
                         onClick={() => handleDeleteCategory(cat.id)}
                         className="p-2.5 text-rose-500 bg-rose-50 rounded-xl hover:bg-rose-500 hover:text-white transition"
                       >
                          <Trash2 size={16} />
                       </button>
                    </div>
                    <div className="w-12 h-12 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                       <Tag size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2 truncate">{cat.name}</h3>
                    <p className="text-xs font-bold text-slate-400 leading-relaxed  line-clamp-2">
                       {cat.description || 'Chưa có mô tả chi tiết cho danh mục này.'}
                    </p>
                    <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                       <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest ">ID: #{cat.id}</span>
                       <button 
                         onClick={() => handleOpenEdit(cat)}
                         className="text-[10px] font-bold text-brand-500 hover:text-brand-700 uppercase cursor-pointer"
                       >
                         Xem chi tiết
                       </button>
                    </div>
                 </div>
              ))}
           </div>
        </div>
      </div>

      {showEditModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-4 no-scrollbar">
          <div className="bg-white rounded-[2.5rem] w-full max-w-xl p-10 animate-in fade-in zoom-in duration-300 relative shadow-2xl">
            <button 
              onClick={() => setShowEditModal(false)}
              className="absolute top-8 right-8 p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition"
            >
              <X size={24} />
            </button>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Chỉnh sửa danh mục</h2>
            <p className="text-slate-500 font-medium mb-8">Cập nhật thông tin ngành nghề cho hệ thống.</p>
            
            <form onSubmit={handleUpdateCategory} className="space-y-6">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2 ml-1">Tên ngành nghề</label>
                <input 
                  required
                  type="text" 
                  className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-900 focus:border-brand-500 transition-all outline-none"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2 ml-1">Mô tả chi tiết</label>
                <textarea 
                  className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-900 h-40 focus:border-brand-500 transition-all outline-none resize-none"
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                ></textarea>
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-bold hover:bg-slate-200 transition"
                >
                  Hủy
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-4 bg-brand-600 text-white rounded-2xl font-bold hover:bg-slate-900 transition shadow-xl shadow-brand-200"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;


