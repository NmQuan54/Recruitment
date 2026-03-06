import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import {
  Type, AlignLeft, MapPin, DollarSign, Calendar,
  Briefcase, Loader2, ChevronLeft, Save, CheckCircle2
} from 'lucide-react';

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    salaryMax: '',
    deadline: '',
    categoryIds: [],
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.data);
      } catch (_) {}
    };
    const fetchJob = async () => {
      try {
        const res = await api.get(`/jobs/${id}`);
        const d = res.data;
        setForm({
          title: d.title || '',
          description: d.description || '',
          requirements: d.requirements || '',
          location: d.location || '',
          jobType: d.jobType || 'FULL_TIME',
          salaryMin: d.salaryMin || '',
          salaryMax: d.salaryMax || '',
          deadline: d.deadline ? (typeof d.deadline === 'string' ? d.deadline.substring(0, 10) : `${d.deadline[0]}-${String(d.deadline[1]).padStart(2, '0')}-${String(d.deadline[2]).padStart(2, '0')}`) : '',
          categoryIds: (d.categories || []).map(c => c.id),
        });
      } catch (err) {
        toast.error('Không thể tải thông tin tin tuyển dụng');
        navigate('/employer/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchCats();
    fetchJob();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSaved(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const dataToSubmit = {
      ...form,
      salaryMin: form.salaryMin || null,
      salaryMax: form.salaryMax || null
    };
    try {
      await api.put(`/employer/jobs/${id}`, dataToSubmit);
      setSaved(true);
      toast.success('Cập nhật tin tuyển dụng thành công!');
      setTimeout(() => navigate('/employer/dashboard'), 1200);
    } catch (err) {
      toast.error('Có lỗi xảy ra khi cập nhật tin');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-brand-600 mb-4" size={40} />
        <p className="font-bold text-slate-400">Đang tải thông tin...</p>
      </div>
    );
  }

  return (
    <div className="w-full px-4 pt-32 pb-16">
      <button
        onClick={() => navigate('/employer/dashboard')}
        className="flex items-center gap-2 text-slate-500 font-bold mb-8 hover:text-brand-600 transition group"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition" />
        Quay lại Dashboard
      </button>

      <div className="bg-white rounded-[3rem] shadow-2xl shadow-brand-100/30 p-8 md:p-12 border border-slate-50">
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl font-bold text-slate-900 mb-2 ">
            Chỉnh sửa tin tuyển dụng
          </h1>
          <p className="text-slate-500 font-medium tracking-tight">
            Cập nhật thông tin vị trí tuyển dụng của bạn
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            {}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider">
                Tiêu đề công việc <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Type className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="VD: Senior Java Developer"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-500 transition font-bold"
                  value={form.title}
                  onChange={handleChange}
                />
              </div>
            </div>

            {}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider">
                Loại hình
              </label>
              <div className="relative">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <select
                  name="jobType"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-500 transition font-bold appearance-none cursor-pointer"
                  value={form.jobType}
                  onChange={handleChange}
                >
                  <option value="FULL_TIME">Toàn thời gian</option>
                  <option value="PART_TIME">Bán thời gian</option>
                  <option value="REMOTE">Làm việc từ xa</option>
                  <option value="INTERN">Thực tập sinh</option>
                </select>
              </div>
            </div>
          </div>

          {}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider">
              Vị trí làm việc
            </label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                name="location"
                required
                placeholder="VD: Hà Nội, Quận 1 (TP.HCM)..."
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-500 transition font-bold"
                value={form.location}
                onChange={handleChange}
              />
            </div>
          </div>

          {}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider">
                Lương tối thiểu (VNĐ)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="number"
                  name="salaryMin"
                  placeholder="VD: 10000000"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-500 transition font-bold"
                  value={form.salaryMin}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider">
                Lương tối đa (VNĐ)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="number"
                  name="salaryMax"
                  placeholder="VD: 25000000"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-500 transition font-bold"
                  value={form.salaryMax}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider">
              Danh mục ngành nghề
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {categories.map((cat) => (
                <label
                  key={cat.id}
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl cursor-pointer hover:bg-brand-50 transition group border border-transparent hover:border-brand-200"
                >
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                    checked={form.categoryIds.includes(cat.id)}
                    onChange={(e) => {
                      const newIds = e.target.checked
                        ? [...form.categoryIds, cat.id]
                        : form.categoryIds.filter((id) => id !== cat.id);
                      setForm({ ...form, categoryIds: newIds });
                    }}
                  />
                  <span className="font-bold text-slate-700 group-hover:text-brand-600 transition text-sm">
                    {cat.name}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider">
              Hạn cuối ứng tuyển
            </label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="date"
                name="deadline"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-500 transition font-bold"
                value={form.deadline}
                onChange={handleChange}
              />
            </div>
          </div>

          {}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider">
              Mô tả công việc
            </label>
            <textarea
              name="description"
              required
              rows={6}
              className="w-full p-6 bg-slate-50 border-none rounded-3xl focus:ring-2 focus:ring-brand-500 transition font-medium resize-none"
              placeholder="Nội dung công việc, trách nhiệm..."
              value={form.description}
              onChange={handleChange}
            />
          </div>

          {}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider">
              Yêu cầu ứng viên
            </label>
            <textarea
              name="requirements"
              required
              rows={6}
              className="w-full p-6 bg-slate-50 border-none rounded-3xl focus:ring-2 focus:ring-brand-500 transition font-medium resize-none"
              placeholder="Kỹ năng, kinh nghiệm cần thiết..."
              value={form.requirements}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className={`w-full py-5 rounded-2xl font-bold text-xl shadow-2xl transition flex items-center justify-center gap-3
              ${saved
                ? 'bg-emerald-500 shadow-emerald-200 text-white'
                : 'bg-brand-600 shadow-brand-200 text-white hover:bg-slate-900'
              }`}
          >
            {saving ? (
              <Loader2 className="animate-spin" size={24} />
            ) : saved ? (
              <><CheckCircle2 size={24} /> Đã lưu!</>
            ) : (
              <><Save size={24} /> Lưu thay đổi</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditJob;


