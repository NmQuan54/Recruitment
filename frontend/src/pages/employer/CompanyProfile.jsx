import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import {
  Building2, Globe, MapPin, Users, Briefcase, FileText,
  Loader2, ChevronLeft, Camera, Save, CheckCircle2
} from 'lucide-react';

const industries = [
  'Công nghệ thông tin',
  'Tài chính / Ngân hàng',
  'Y tế / Dược phẩm',
  'Giáo dục / Đào tạo',
  'Sản xuất / Công nghiệp',
  'Bán lẻ / Thương mại',
  'Truyền thông / Marketing',
  'Bất động sản / Xây dựng',
  'Logistics / Vận tải',
  'Nhà hàng / Khách sạn',
  'Khác',
];

const CompanyProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    logoUrl: '',
    website: '',
    address: '',
    industry: '',
    companySize: '',
  });

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await api.get('/employer/company');
        const d = res.data;
        setForm({
          name: d.name || '',
          description: d.description || '',
          logoUrl: d.logoUrl || '',
          website: d.website || '',
          address: d.address || '',
          industry: d.industry || '',
          companySize: d.companySize || '',
        });
      } catch (err) {
        toast.error('Không thể tải thông tin công ty');
      } finally {
        setLoading(false);
      }
    };
    fetchCompany();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSaved(false);
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.post('/upload/logo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setForm((prev) => ({ ...prev, logoUrl: res.data.url }));
      toast.success('Tải logo thành công!');
    } catch (err) {
      toast.error('Không thể tải logo lên');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/employer/company', form);
      setSaved(true);
      toast.success('Cập nhật thông tin công ty thành công!');
    } catch (err) {
      toast.error('Có lỗi xảy ra khi lưu thông tin');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-brand-600 mb-4" size={40} />
        <p className="font-bold text-slate-400">Đang tải thông tin công ty...</p>
      </div>
    );
  }

  return (
    <div className="w-full px-4 pt-32 pb-16">
      {}
      <button
        onClick={() => navigate('/employer/dashboard')}
        className="flex items-center gap-2 text-slate-500 font-bold mb-8 hover:text-brand-600 transition group"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition" />
        Quay lại Dashboard
      </button>

      <div className="bg-white rounded-[3rem] shadow-2xl shadow-brand-100/30 p-8 md:p-12 border border-slate-50">
        {}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-8 mb-12 pb-10 border-b border-slate-100">
          {}
          <div className="relative group">
            <div className="w-28 h-28 rounded-[2rem] bg-slate-100 border-4 border-white shadow-xl overflow-hidden flex items-center justify-center">
              {form.logoUrl ? (
                <img
                  src={form.logoUrl}
                  alt="Logo công ty"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Building2 size={48} className="text-slate-300" />
              )}
            </div>
            <label
              htmlFor="logo-upload"
              className="absolute -bottom-2 -right-2 w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center cursor-pointer shadow-lg hover:bg-slate-900 transition"
              title="Tải logo lên"
            >
              {uploading ? (
                <Loader2 size={16} className="text-white animate-spin" />
              ) : (
                <Camera size={16} className="text-white" />
              )}
            </label>
            <input
              id="logo-upload"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={handleLogoUpload}
            />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-1 ">
              Hồ sơ công ty
            </h1>
            <p className="text-slate-500 font-medium">
              Thông tin này sẽ hiển thị trên tất cả tin tuyển dụng của bạn
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider ml-1">
                Tên công ty <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="VD: Tech Corp Vietnam"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-500 transition font-bold"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider ml-1">
                Ngành nghề
              </label>
              <div className="relative">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <select
                  name="industry"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-500 transition font-bold appearance-none cursor-pointer"
                  value={form.industry}
                  onChange={handleChange}
                >
                  <option value="">-- Chọn ngành --</option>
                  {industries.map((ind) => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Website + Địa chỉ */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider ml-1">
                Website
              </label>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="url"
                  name="website"
                  placeholder="https://company.com"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-500 transition font-bold"
                  value={form.website}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider ml-1">
                Quy mô nhân sự
              </label>
              <div className="relative">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <select
                  name="companySize"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-500 transition font-bold appearance-none cursor-pointer"
                  value={form.companySize}
                  onChange={handleChange}
                >
                  <option value="">-- Chọn quy mô --</option>
                  <option value="1">1 – 10 nhân viên</option>
                  <option value="25">11 – 50 nhân viên</option>
                  <option value="150">51 – 200 nhân viên</option>
                  <option value="500">201 – 1,000 nhân viên</option>
                  <option value="5000">1,000+ nhân viên</option>
                </select>
              </div>
            </div>
          </div>

          {}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-wider ml-1">
              Địa chỉ văn phòng
            </label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                name="address"
                placeholder="VD: 123 Nguyễn Huệ, Quận 1, TP.HCM"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-500 transition font-bold"
                value={form.address}
                onChange={handleChange}
              />
            </div>
          </div>

          {}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-wider ml-1 flex items-center gap-2">
              <FileText size={16} /> Giới thiệu công ty
            </label>
            <textarea
              name="description"
              rows={6}
              placeholder="Mô tả văn hóa, sứ mệnh và những điểm đặc biệt của công ty bạn..."
              className="w-full p-6 bg-slate-50 border-none rounded-3xl focus:ring-2 focus:ring-brand-500 transition font-medium resize-none"
              value={form.description}
              onChange={handleChange}
            />
          </div>

          {}
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
              <><CheckCircle2 size={24} /> Đã lưu thành công!</>
            ) : (
              <><Save size={24} /> Lưu thông tin công ty</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompanyProfile;


