import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { 
  Briefcase, 
  GraduationCap, 
  Plus, 
  Trash2, 
  Save, 
  Loader2,
  Calendar,
  Building,
  MapPin,
  ClipboardList
} from 'lucide-react';

const ResumeEditor = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    title: '',
    summary: '',
    phoneNumber: '',
    address: '',
    experiences: [],
    educations: []
  });

  const [uploading, setUploading] = useState(false);
  const [resumes, setResumes] = useState([]);
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeName, setResumeName] = useState('');
  const [uploadingResume, setUploadingResume] = useState(false);
  const [personalInfo, setPersonalInfo] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    avatarUrl: user?.avatarUrl || ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, resumesRes] = await Promise.all([
          api.get('/candidate/profile'),
          api.get('/resumes')
        ]);
        
        setProfile({
          ...profileRes.data,
          experiences: profileRes.data.experiences || [],
          educations: profileRes.data.educations || []
        });
        
        setResumes(resumesRes.data || []);
      } catch (error) {
        toast.error('Không thể tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleResumeUpload = async () => {
    if (!resumeFile || !resumeName) {
      toast.error('Vui lòng nhập tên CV và chọn file');
      return;
    }

    setUploadingResume(true);
    try {
      const formData = new FormData();
      formData.append('file', resumeFile);
      
      const uploadRes = await api.post('/upload/resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      await api.post('/resumes', {
        name: resumeName,
        resumeUrl: uploadRes.data.url
      });

      const resumesRes = await api.get('/resumes');
      setResumes(resumesRes.data);
      setResumeFile(null);
      setResumeName('');
      toast.success('Tải CV lên thành công!');
    } catch (error) {
      toast.error('Lỗi khi tải CV lên');
    } finally {
      setUploadingResume(false);
    }
  };

  const deleteResume = async (id) => {
    try {
      await api.delete(`/resumes/${id}`);
      setResumes(resumes.filter(r => r.id !== id));
      toast.success('Đã xóa CV');
    } catch (error) {
      toast.error('Lỗi khi xóa CV');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await Promise.all([
        api.put('/candidate/profile', profile),
        api.put('/user/profile', {
          fullName: personalInfo.fullName,
          phone: personalInfo.phone,
          avatarUrl: personalInfo.avatarUrl
        })
      ]);
      updateUser({
        fullName: personalInfo.fullName,
        phone: personalInfo.phone,
        avatarUrl: personalInfo.avatarUrl
      });
      toast.success('Đã cập nhật hồ sơ trực tuyến thành công!');
    } catch (error) {
      toast.error('Có lỗi xảy ra khi lưu');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.post('/upload/logo', formData, { // Assuming employer logo upload endpoint works for avatars too as it's just an image
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setPersonalInfo(prev => ({ ...prev, avatarUrl: res.data.url }));
      toast.success('Tải ảnh đại diện thành công!');
    } catch (error) {
      toast.error('Lỗi khi tải ảnh lên');
    } finally {
      setUploading(false);
    }
  };

  const addExperience = () => {
    setProfile({
      ...profile,
      experiences: [...profile.experiences, {
        companyName: '',
        position: '',
        startDate: '',
        endDate: '',
        isCurrent: false,
        description: ''
      }]
    });
  };

  const addEducation = () => {
    setProfile({
      ...profile,
      educations: [...profile.educations, {
        institution: '',
        degree: '',
        major: '',
        startDate: '',
        endDate: '',
        description: ''
      }]
    });
  };

  const updateExperience = (index, field, value) => {
    const newExps = [...profile.experiences];
    newExps[index][field] = value;
    setProfile({ ...profile, experiences: newExps });
  };

  const updateEducation = (index, field, value) => {
    const newEdus = [...profile.educations];
    newEdus[index][field] = value;
    setProfile({ ...profile, educations: newEdus });
  };

  const removeExperience = (index) => {
    setProfile({
      ...profile,
      experiences: profile.experiences.filter((_, i) => i !== index)
    });
  };

  const removeEducation = (index) => {
    setProfile({
      ...profile,
      educations: profile.educations.filter((_, i) => i !== index)
    });
  };

  if (loading) return <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-brand-600" size={40} /></div>;

  return (
    <div className="w-full px-4 pt-32 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2 tracking-tight">Hồ sơ chuyên nghiệp</h1>
          <p className="text-slate-500 font-bold">Xây dựng hồ sơ trực tuyến để thu hút nhà tuyển dụng</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="btn-premium flex items-center gap-2 px-10 py-5 rounded-[2rem] shadow-xl shadow-brand-200"
        >
          {saving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
          Lưu hồ sơ
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Left Column: Basic Info */}
        <div className="lg:col-span-1 space-y-8">
           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
               <div className="flex flex-col items-center mb-8">
                  <div className="relative group">
                     <div className="w-32 h-32 rounded-full bg-slate-100 border-4 border-white shadow-xl overflow-hidden flex items-center justify-center">
                        {personalInfo.avatarUrl ? (
                           <img src={personalInfo.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                           <span className="text-4xl font-bold text-slate-300">{personalInfo.fullName.charAt(0)}</span>
                        )}
                     </div>
                     <label className="absolute bottom-0 right-0 w-10 h-10 bg-brand-600 rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-slate-900 transition border-4 border-white">
                        {uploading ? <Loader2 size={16} className="text-white animate-spin" /> : <Plus size={20} className="text-white" />}
                        <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                     </label>
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-slate-900 ">{personalInfo.fullName}</h3>
                  <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">{user?.email}</p>
               </div>

               <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-900 ">
                <ClipboardList className="text-brand-600" size={18} /> Thông tin chung
              </h3>
              <div className="space-y-6">
                 <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Họ và tên</label>
                    <input 
                      type="text" 
                      className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-brand-500/20 font-bold text-slate-900"
                      value={personalInfo.fullName}
                      onChange={(e) => setPersonalInfo({...personalInfo, fullName: e.target.value})}
                    />
                 </div>
                 <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Vị trí mong muốn</label>
                    <input 
                      type="text" 
                      className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-brand-500/20 font-bold text-slate-900"
                      value={profile.title}
                      onChange={(e) => setProfile({...profile, title: e.target.value})}
                      placeholder="VD: Senior Frontend Developer"
                    />
                 </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Số điện thoại</label>
                    <input 
                      type="text" 
                      className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-brand-500/20 font-bold text-slate-900"
                      value={personalInfo.phone}
                      onChange={(e) => setPersonalInfo({...personalInfo, phone: e.target.value})}
                    />
                 </div>
                 <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Địa chỉ</label>
                    <input 
                      type="text" 
                      className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-brand-500/20 font-bold text-slate-900"
                      value={profile.address}
                      onChange={(e) => setProfile({...profile, address: e.target.value})}
                    />
                 </div>
                 <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Giới thiệu bản thân</label>
                    <textarea 
                      className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-brand-500/20 font-bold text-slate-900 h-32"
                      value={profile.summary}
                      onChange={(e) => setProfile({...profile, summary: e.target.value})}
                    ></textarea>
                 </div>
              </div>
           </div>
        </div>

        {/* Right Column: Experience and Education */}
        <div className="lg:col-span-2 space-y-10">
           {/* Work Experience */}
           <section>
              <div className="flex items-center justify-between mb-6 px-4">
                 <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                   <Briefcase className="text-brand-600" /> Kinh nghiệm làm việc
                 </h2>
                 <button 
                  onClick={addExperience}
                  className="w-10 h-10 bg-brand-50 text-brand-600 rounded-xl flex items-center justify-center hover:bg-brand-600 hover:text-white transition"
                 >
                   <Plus size={20} />
                 </button>
              </div>

              <div className="space-y-6">
                 {profile.experiences.map((exp, idx) => (
                    <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative group">
                       <button 
                        onClick={() => removeExperience(idx)}
                        className="absolute top-8 right-8 text-slate-300 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
                       >
                         <Trash2 size={18} />
                       </button>
                       <div className="grid md:grid-cols-2 gap-6">
                          <div className="md:col-span-2 flex flex-col md:flex-row gap-6">
                             <div className="flex-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Tên công ty</label>
                                <input 
                                  type="text" 
                                  className="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold"
                                  value={exp.companyName}
                                  onChange={(e) => updateExperience(idx, 'companyName', e.target.value)}
                                />
                             </div>
                             <div className="flex-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Vị trí</label>
                                <input 
                                  type="text" 
                                  className="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold"
                                  value={exp.position}
                                  onChange={(e) => updateExperience(idx, 'position', e.target.value)}
                                />
                             </div>
                          </div>
                          <div>
                             <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Ngày bắt đầu</label>
                             <input 
                               type="date" 
                               className="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold"
                               value={exp.startDate}
                               onChange={(e) => updateExperience(idx, 'startDate', e.target.value)}
                             />
                          </div>
                          <div>
                             <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Ngày kết thúc</label>
                             <input 
                               type="date" 
                               disabled={exp.isCurrent}
                               className="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold disabled:opacity-50"
                               value={exp.endDate}
                               onChange={(e) => updateExperience(idx, 'endDate', e.target.value)}
                             />
                          </div>
                          <div className="md:col-span-2 flex items-center gap-2">
                             <input 
                                type="checkbox" 
                                id={`current-${idx}`}
                                className="w-5 h-5 rounded-lg border-slate-200 text-brand-600 focus:ring-brand-500"
                                checked={exp.isCurrent}
                                onChange={(e) => updateExperience(idx, 'isCurrent', e.target.checked)}
                             />
                             <label htmlFor={`current-${idx}`} className="text-sm font-bold text-slate-600 cursor-pointer ">Tôi đang làm việc tại đây</label>
                          </div>
                          <div className="md:col-span-2">
                             <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Mô tả công việc</label>
                             <textarea 
                               className="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold h-24"
                               value={exp.description}
                               onChange={(e) => updateExperience(idx, 'description', e.target.value)}
                             ></textarea>
                          </div>
                       </div>
                    </div>
                 ))}
                 {profile.experiences.length === 0 && (
                   <p className="text-center py-10 text-slate-400 font-bold ">Chưa có kinh nghiệm làm việc nào được thêm</p>
                 )}
              </div>
           </section>

           {/* Education */}
           <section>
              <div className="flex items-center justify-between mb-6 px-4">
                 <h2 className="text-2xl font-bold text-slate-900  flex items-center gap-3">
                   <GraduationCap className="text-brand-600" /> Học vấn
                 </h2>
                 <button 
                  onClick={addEducation}
                  className="w-10 h-10 bg-brand-50 text-brand-600 rounded-xl flex items-center justify-center hover:bg-brand-600 hover:text-white transition"
                 >
                   <Plus size={20} />
                 </button>
              </div>

              <div className="space-y-6">
                 {profile.educations.map((edu, idx) => (
                    <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative group">
                       <button 
                        onClick={() => removeEducation(idx)}
                        className="absolute top-8 right-8 text-slate-300 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
                       >
                         <Trash2 size={18} />
                       </button>
                       <div className="grid md:grid-cols-2 gap-6">
                          <div className="md:col-span-2 flex flex-col md:flex-row gap-6">
                             <div className="flex-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Tên trường</label>
                                <input 
                                  type="text" 
                                  className="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold"
                                  value={edu.institution}
                                  onChange={(e) => updateEducation(idx, 'institution', e.target.value)}
                                />
                             </div>
                             <div className="flex-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Bằng cấp</label>
                                <input 
                                  type="text" 
                                  className="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold"
                                  value={edu.degree}
                                  onChange={(e) => updateEducation(idx, 'degree', e.target.value)}
                                />
                             </div>
                          </div>
                          <div>
                             <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Ngành học</label>
                             <input 
                               type="text" 
                               className="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold"
                               value={edu.major}
                               onChange={(e) => updateEducation(idx, 'major', e.target.value)}
                             />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Từ năm</label>
                                <input 
                                  type="text" 
                                  className="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold"
                                  value={edu.startDate}
                                  onChange={(e) => updateEducation(idx, 'startDate', e.target.value)}
                                  placeholder="VD: 2018"
                                />
                             </div>
                             <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Đến năm</label>
                                <input 
                                  type="text" 
                                  className="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold"
                                  value={edu.endDate}
                                  onChange={(e) => updateEducation(idx, 'endDate', e.target.value)}
                                  placeholder="VD: 2022"
                                />
                             </div>
                          </div>
                       </div>
                    </div>
                 ))}
                 {profile.educations.length === 0 && (
                   <p className="text-center py-10 text-slate-400 font-bold ">Chưa có thông tin học vấn nào được thêm</p>
                 )}
              </div>
           </section>

           {/* CV Upload & Management */}
           <section>
              <div className="flex items-center justify-between mb-6 px-4">
                 <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                   <Save className="text-brand-600" /> Danh sách CV (Files)
                 </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-10">
                 {/* Upload form */}
                 <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-6">Tải CV mới lên</h3>
                    <div className="space-y-4">
                       <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Tên hiển thị CV</label>
                          <input 
                            type="text" 
                            className="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold placeholder:font-medium"
                            placeholder="VD: CV Kỹ sư Frontend (Vietnamese)"
                            value={resumeName}
                            onChange={(e) => setResumeName(e.target.value)}
                          />
                       </div>
                       <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Chọn File CV (PDF/Image)</label>
                          <input 
                            type="file" 
                            className="w-full p-3 bg-slate-50 rounded-2xl border-none font-bold text-sm"
                            onChange={(e) => setResumeFile(e.target.files[0])}
                          />
                       </div>
                       <button 
                         onClick={handleResumeUpload}
                         disabled={uploadingResume}
                         className="w-full py-4 bg-brand-600 text-white rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-slate-900 transition flex items-center justify-center gap-2"
                       >
                         {uploadingResume ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
                         Tải lên hệ thống
                       </button>
                    </div>
                 </div>

                 {/* List of resumes */}
                 <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-50 rounded-full blur-3xl -mr-16 -mt-16"></div>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-6 relative z-10">CV đã lưu ({resumes.length})</h3>
                    
                    <div className="space-y-3 relative z-10 overflow-y-auto max-h-[16rem] pr-2 custom-scrollbar">
                       {resumes.map((r) => (
                          <div key={r.id} className="flex items-center justify-between p-5 bg-slate-50/50 rounded-2xl hover:bg-brand-50 border border-transparent hover:border-brand-100 transition group">
                             <div className="flex-1 min-w-0 pr-4">
                                <p className="text-slate-900 font-bold text-sm truncate mb-1 uppercase tracking-tight">{r.name}</p>
                                <a 
                                  href={r.resumeUrl} 
                                  target="_blank" 
                                  rel="noreferrer"
                                  className="text-[10px] font-bold text-brand-600 uppercase tracking-[0.2em] hover:text-slate-900 transition flex items-center gap-2"
                                >
                                  Xem chi tiết
                                </a>
                             </div>
                             <button 
                               onClick={() => deleteResume(r.id)}
                               className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition hover:bg-red-500 hover:text-white shadow-sm"
                             >
                               <Trash2 size={16} />
                             </button>
                          </div>
                       ))}
                       {resumes.length === 0 && (
                          <div className="py-10 text-center">
                             <p className="text-slate-300 text-xs font-bold">Chưa có CV nào được tải lên</p>
                          </div>
                       )}
                    </div>
                 </div>
              </div>
           </section>
        </div>
      </div>
    </div>
  );
};

export default ResumeEditor;


