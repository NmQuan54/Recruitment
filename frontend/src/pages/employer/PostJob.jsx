import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { 
  PlusCircle, 
  Type, 
  AlignLeft, 
  MapPin, 
  DollarSign, 
  Calendar,
  Briefcase,
  Loader2,
  ChevronLeft
} from 'lucide-react';

const PostJob = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    location: '',
    jobType: 'FULL_TIME',
    salaryMin: '',
    salaryMax: '',
    deadline: '',
    categoryIds: []
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.data);
      } catch (_) {}
    };
    fetchCats();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const dataToSubmit = {
      ...formData,
      salaryMin: formData.salaryMin || null,
      salaryMax: formData.salaryMax || null
    };
    try {
      await api.post('/employer/jobs', dataToSubmit);
      toast.success('Đăng tin tuyển dụng thành công!');
      navigate('/employer/dashboard');
    } catch (error) {
      toast.error('Có lỗi xảy ra khi đăng tin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full px-4 pt-32 pb-12">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 font-bold mb-8 hover:text-brand-600 transition group"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition" /> Quay lại Dashboard
      </button>

      <div className="bg-white rounded-[3rem] shadow-2xl shadow-brand-100 p-8 md:p-12 border border-slate-50">
        <div className="mb-10 text-center md:text-left">
           <h1 className="text-3xl font-bold text-slate-900 mb-2 ">Đăng tin tuyển dụng</h1>
           <p className="text-slate-500 font-medium tracking-tight">Thu hút những ứng viên tài năng nhất cho công ty của bạn</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
           <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                 <label className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider">Tiêu đề công việc</label>
                 <div className="relative">
                    <Type className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                      type="text"
                      required
                      placeholder="VD: Senior Java Developer"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-500 transition font-bold"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                 </div>
              </div>
              
              <div className="space-y-2">
                 <label className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider">Loại hình</label>
                 <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <select
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-500 transition font-bold appearance-none cursor-pointer"
                      value={formData.jobType}
                      onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
                    >
                      <option value="FULL_TIME">Toàn thời gian</option>
                      <option value="PART_TIME">Bán thời gian</option>
                      <option value="REMOTE">Làm việc từ xa</option>
                      <option value="INTERN">Thực tập sinh</option>
                    </select>
                 </div>
              </div>
           </div>

           <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider">Vị trí làm việc</label>
              <div className="relative">
                 <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                 <input
                   type="text"
                   required
                   placeholder="VD: Hà Nội, Quận 1 (TP.HCM)..."
                   className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-500 transition font-bold"
                   value={formData.location}
                   onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                 />
              </div>
           </div>

           <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                 <label className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider text-brand-600">Lương tối thiểu (VNĐ)</label>
                 <div className="relative group">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors" size={20} />
                    <input
                      type="number"
                      required
                      placeholder="VD: 10000000"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-brand-500 focus:bg-white transition-all font-bold text-lg"
                      value={formData.salaryMin}
                      onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })}
                    />
                 </div>
                 {formData.salaryMin && (
                    <div className="ml-2 text-brand-600 font-black text-sm animate-in fade-in slide-in-from-left-2 transition-all">
                       ≈ {(() => {
                          const v = parseFloat(formData.salaryMin);
                          if (v >= 1e9) return (v / 1e9).toLocaleString('vi-VN', { maximumFractionDigits: 2 }) + ' Tỷ VNĐ';
                          if (v >= 1e6) return (v / 1e6).toLocaleString('vi-VN', { maximumFractionDigits: 1 }) + ' Triệu VNĐ';
                          return v.toLocaleString('vi-VN') + ' VNĐ';
                       })()}
                    </div>
                 )}
              </div>
              <div className="space-y-4">
                 <label className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider text-brand-600">Lương tối đa (VNĐ)</label>
                 <div className="relative group">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors" size={20} />
                    <input
                      type="number"
                      required
                      placeholder="VD: 25000000"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-brand-500 focus:bg-white transition-all font-bold text-lg"
                      value={formData.salaryMax}
                      onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value })}
                    />
                 </div>
                 {formData.salaryMax && (
                    <div className="ml-2 text-brand-600 font-black text-sm animate-in fade-in slide-in-from-left-2 transition-all">
                       ≈ {(() => {
                          const v = parseFloat(formData.salaryMax);
                          if (v >= 1e9) return (v / 1e9).toLocaleString('vi-VN', { maximumFractionDigits: 2 }) + ' Tỷ VNĐ';
                          if (v >= 1e6) return (v / 1e6).toLocaleString('vi-VN', { maximumFractionDigits: 1 }) + ' Triệu VNĐ';
                          return v.toLocaleString('vi-VN') + ' VNĐ';
                       })()}
                    </div>
                 )}
              </div>
           </div>

            <div className="space-y-4">
               <label className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider">Danh mục ngành nghề</label>
               <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {categories.map(cat => (
                    <label key={cat.id} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl cursor-pointer hover:bg-brand-50 transition group border border-transparent hover:border-brand-200">
                      <input
                        type="checkbox"
                        className="w-5 h-5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                        checked={formData.categoryIds.includes(cat.id)}
                        onChange={(e) => {
                          const newIds = e.target.checked
                            ? [...formData.categoryIds, cat.id]
                            : formData.categoryIds.filter(id => id !== cat.id);
                          setFormData({ ...formData, categoryIds: newIds });
                        }}
                      />
                      <span className="font-bold text-slate-700 group-hover:text-brand-600 transition text-sm">{cat.name}</span>
                    </label>
                  ))}
               </div>
            </div>

           <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider">Hạn cuối ứng tuyển</label>
              <div className="relative">
                 <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                 <input
                   type="date"
                   required
                   className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-500 transition font-bold"
                   value={formData.deadline}
                   onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                 />
              </div>
           </div>

           <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider">Mô tả công việc</label>
              <textarea
                required
                className="w-full p-6 bg-slate-50 border-none rounded-3xl h-48 focus:ring-2 focus:ring-brand-500 transition font-medium"
                placeholder="Nội dung công việc, trách nhiệm..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              ></textarea>
           </div>

           <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider">Yêu cầu ứng viên</label>
              <textarea
                required
                className="w-full p-6 bg-slate-50 border-none rounded-3xl h-48 focus:ring-2 focus:ring-brand-500 transition font-medium"
                placeholder="Kỹ năng, kinh nghiệm cần thiết..."
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
              ></textarea>
           </div>

           <button
             type="submit"
             disabled={loading}
             className="w-full py-5 bg-brand-600 text-white rounded-2xl font-bold text-xl shadow-2xl shadow-brand-200 hover:bg-slate-900 transition flex items-center justify-center gap-2"
           >
             {loading ? <Loader2 className="animate-spin h-6 w-6" /> : <><PlusCircle size={24} /> Xác nhận đăng bài</>}
           </button>
        </form>
      </div>
    </div>
  );
};

export default PostJob;


