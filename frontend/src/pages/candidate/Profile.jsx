import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { 
  User, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  PenTool, 
  Save, 
  Loader2,
  FileText,
  CheckCircle2
} from 'lucide-react';

const CandidateProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    title: '',
    summary: '',
    skills: '',
    experience: '',
    education: '',
    resumeUrl: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/candidate/profile');
        if (response.data) setProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/candidate/profile', profile);
      toast.success('Hồ sơ đã được cập nhật!');
    } catch (error) {
      toast.error('Lỗi khi cập nhật hồ sơ');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <Loader2 className="animate-spin text-brand-600 mb-4" size={40} />
      <p className="font-bold text-slate-400">Đang tải hồ sơ cá nhân...</p>
    </div>
  );

  return (
    <div className="w-full px-4 pt-32 pb-12">
      <div className="mb-12 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
           <h1 className="text-3xl font-bold text-slate-900 mb-2 ">Thông tin cá nhân</h1>
           <p className="text-slate-500 font-medium">Hoàn thiện hồ sơ để thu hút nhà tuyển dụng</p>
        </div>
        <div className="px-6 py-3 bg-emerald-50 text-emerald-600 rounded-2xl font-bold text-sm flex items-center gap-2 border border-emerald-100">
           <CheckCircle2 size={18} /> Tài khoản đã xác thực
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="bg-white rounded-[3rem] shadow-2xl shadow-brand-100 p-8 md:p-12 border border-slate-50 space-y-8">
           <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                 <label className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider  flex items-center gap-2">
                    <User size={16} className="text-brand-600" /> Tên hiển thị
                 </label>
                 <input
                   type="text"
                   disabled
                   className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-400 cursor-not-allowed"
                   value={user?.fullName || ''}
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider  flex items-center gap-2">
                    <Briefcase size={16} className="text-brand-600" /> Vị trí hiện tại
                 </label>
                 <input
                   type="text"
                   placeholder="VD: Senior Frontend Developer"
                   className="w-full px-6 py-4 bg-slate-100 border-none rounded-2xl focus:ring-2 focus:ring-brand-500 transition font-bold text-slate-900"
                   value={profile.title || ''}
                   onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                 />
              </div>
           </div>

           <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider ">Giới thiệu bản thân</label>
              <textarea
                className="w-full p-6 bg-slate-100 border-none rounded-3xl h-32 focus:ring-2 focus:ring-brand-500 transition font-medium"
                placeholder="Tóm tắt ngắn gọn về kinh nghiệm và định hướng của bạn..."
                value={profile.summary || ''}
                onChange={(e) => setProfile({ ...profile, summary: e.target.value })}
              ></textarea>
           </div>

           <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider  flex items-center gap-2">
                 <PenTool size={16} className="text-brand-600" /> Kỹ năng chuyên môn
              </label>
              <textarea
                className="w-full p-6 bg-slate-100 border-none rounded-3xl h-24 focus:ring-2 focus:ring-brand-500 transition font-medium"
                placeholder="VD: ReactJS, Java, SQL, Figma..."
                value={profile.skills || ''}
                onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
              ></textarea>
           </div>

           <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider  flex items-center gap-2">
                 <Briefcase size={16} className="text-brand-600" /> Kinh nghiệm làm việc
              </label>
              <textarea
                className="w-full p-6 bg-slate-100 border-none rounded-3xl h-48 focus:ring-2 focus:ring-brand-500 transition font-medium"
                placeholder="Mô tả các dự án và công ty bạn đã từng làm..."
                value={profile.experience || ''}
                onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
              ></textarea>
           </div>

           <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider  flex items-center gap-2">
                 <GraduationCap size={16} className="text-brand-600" /> Học vấn / Bằng cấp
              </label>
              <textarea
                className="w-full p-6 bg-slate-100 border-none rounded-3xl h-32 focus:ring-2 focus:ring-brand-500 transition font-medium"
                placeholder="Trường đại học, các chứng chỉ chuyên ngành..."
                value={profile.education || ''}
                onChange={(e) => setProfile({ ...profile, education: e.target.value })}
              ></textarea>
           </div>

           <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider  flex items-center gap-2">
                 <FileText size={16} className="text-brand-600" /> Đường dẫn CV (Link Google Drive/Dropbox)
              </label>
              <input
                type="text"
                className="w-full px-6 py-4 bg-slate-100 border-none rounded-2xl focus:ring-2 focus:ring-brand-500 transition font-bold"
                placeholder="https://drive.google.com/..."
                value={profile.resumeUrl || ''}
                onChange={(e) => setProfile({ ...profile, resumeUrl: e.target.value })}
              />
           </div>
        </div>

        <div className="flex justify-center md:justify-end">
           <button
             type="submit"
             disabled={saving}
             className="bg-brand-600 text-white px-12 py-5 rounded-2xl font-bold text-xl shadow-2xl shadow-brand-200 hover:bg-slate-900 transition flex items-center gap-2 group"
           >
             {saving ? <Loader2 className="animate-spin h-6 w-6" /> : <><Save size={24} className="group-hover:scale-110 transition" /> Lưu thay đổi</>}
           </button>
        </div>
      </form>
    </div>
  );
};

export default CandidateProfile;


