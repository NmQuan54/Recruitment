import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
  Zap, 
  Plus, 
  Trash2, 
  Edit, 
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const AdminPromotionPackages = () => {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingPkg, setEditingPkg] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        days: 7,
        amount: 50000,
        description: '',
        active: true
    });

    const fetchPackages = async () => {
        try {
            const res = await api.get('/admin/promotion-packages');
            setPackages(res.data);
        } catch (error) {
            toast.error('Không thể tải danh sách gói');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPackages();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingPkg) {
                await api.put(`/admin/promotion-packages/${editingPkg.id}`, formData);
                toast.success('Cập nhật thành công');
            } else {
                await api.post('/admin/promotion-packages', formData);
                toast.success('Thêm gói thành công');
            }
            setShowModal(false);
            setEditingPkg(null);
            setFormData({ name: '', days: 7, amount: 50000, description: '', active: true });
            fetchPackages();
        } catch (error) {
            toast.error('Lỗi khi lưu dữ liệu');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Xóa gói này?')) {
            try {
                await api.delete(`/admin/promotion-packages/${id}`);
                toast.success('Đã xóa');
                fetchPackages();
            } catch (error) {
                toast.error('Lỗi khi xóa');
            }
        }
    };

    const handleEdit = (pkg) => {
        setEditingPkg(pkg);
        setFormData({
            name: pkg.name,
            days: pkg.days,
            amount: pkg.amount,
            description: pkg.description || '',
            active: pkg.active
        });
        setShowModal(true);
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <Loader2 className="animate-spin text-brand-600" size={40} />
        </div>
    );

    return (
        <div className="w-full px-4 pt-32 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                <div>
                    <h1 className="text-4xl font-bold text-slate-900 mb-2 font-display">Quản lý Gói Quảng cáo</h1>
                    <p className="text-slate-500 font-bold">Thiết lập linh hoạt các gói đẩy tin tuyển dụng cho Nhà tuyển dụng.</p>
                </div>
                <button 
                    onClick={() => {
                        setEditingPkg(null);
                        setFormData({ name: '', days: 7, amount: 50000, description: '', active: true });
                        setShowModal(true);
                    }}
                    className="btn-premium px-8 py-4 rounded-3xl flex items-center gap-2 shadow-2xl"
                >
                    <Plus size={20} /> Tạo gói mới
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {packages.map((pkg) => (
                    <div 
                        key={pkg.id} 
                        className={`group bg-white rounded-[3rem] border-2 p-10 transition-all hover:shadow-2xl hover:shadow-brand-100 flex flex-col relative overflow-hidden ${
                            pkg.active ? 'border-slate-50' : 'border-slate-100 bg-slate-50/50 grayscale'
                        }`}
                    >
                        <div className="flex justify-between items-start mb-8">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${pkg.active ? 'bg-brand-50 text-brand-600' : 'bg-slate-200 text-slate-400'}`}>
                                <Zap size={28} />
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleEdit(pkg)} className="p-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-brand-600 hover:text-white transition">
                                    <Edit size={16} />
                                </button>
                                <button onClick={() => handleDelete(pkg)} className="p-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-rose-500 hover:text-white transition">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>

                        <h3 className="text-2xl font-bold text-slate-900 mb-2">{pkg.name}</h3>
                        <p className="text-slate-500 font-medium mb-8 flex-grow">{pkg.description || 'Không có mô tả'}</p>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-slate-50 p-4 rounded-3xl">
                                <div className="text-[10px] uppercase font-bold text-slate-400 mb-1 flex items-center gap-1">
                                    <Clock size={12} /> Thời gian
                                </div>
                                <div className="text-lg font-bold text-brand-600">{pkg.days} Ngày</div>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-3xl">
                                <div className="text-[10px] uppercase font-bold text-slate-400 mb-1 flex items-center gap-1">
                                    <DollarSign size={12} /> Giá tiền
                                </div>
                                <div className="text-lg font-bold text-slate-900">{pkg.amount.toLocaleString()} đ</div>
                            </div>
                        </div>

                        <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl w-fit text-[10px] font-black uppercase tracking-[0.1em] ${pkg.active ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-200 text-slate-500'}`}>
                            {pkg.active ? <><CheckCircle2 size={12} /> Đang Kích Hoạt</> : <><XCircle size={12} /> Tạm Ngừng</>}
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-start justify-center p-4 overflow-y-auto pt-20 pb-20">
                    <div className="bg-white rounded-[3rem] w-full max-w-xl p-10 animate-in fade-in zoom-in duration-300 shadow-2xl relative mt-auto mb-auto">
                        <h2 className="text-3xl font-bold text-slate-900 mb-8">{editingPkg ? 'Chỉnh sửa gói' : 'Tạo gói quảng cáo'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Tên gói</label>
                                <input 
                                    type="text"
                                    required
                                    className="w-full px-6 py-4 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-brand-500 transition font-bold"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Số ngày</label>
                                    <input 
                                        type="number"
                                        required
                                        className="w-full px-6 py-4 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-brand-500 transition font-bold"
                                        value={formData.days}
                                        onChange={(e) => setFormData({...formData, days: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Số tiền (VNĐ)</label>
                                    <input 
                                        type="number"
                                        required
                                        className="w-full px-6 py-4 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-brand-500 transition font-bold"
                                        value={formData.amount}
                                        onChange={(e) => setFormData({...formData, amount: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Mô tả</label>
                                <textarea 
                                    className="w-full px-6 py-4 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-brand-500 transition font-bold resize-none h-32"
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                />
                            </div>
                            <div className="flex items-center gap-3 bg-slate-50 p-6 rounded-3xl">
                                <input 
                                    type="checkbox"
                                    id="active"
                                    className="w-5 h-5 rounded-lg border-slate-200 text-brand-600 focus:ring-brand-500"
                                    checked={formData.active}
                                    onChange={(e) => setFormData({...formData, active: e.target.checked})}
                                />
                                <label htmlFor="active" className="text-slate-900 font-bold uppercase text-[11px] tracking-widest">Kích hoạt gói ngay</label>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button 
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-bold hover:bg-slate-200 transition"
                                >
                                    Hủy
                                </button>
                                <button 
                                    type="submit"
                                    className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-brand-600 transition shadow-xl"
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

export default AdminPromotionPackages;
