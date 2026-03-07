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
  ClipboardList,
  FileText
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
    if (user) {
      setPersonalInfo({
        fullName: user.fullName || '',
        phone: user.phone || '',
        avatarUrl: user.avatarUrl || ''
      });
    }
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, resumesRes] = await Promise.all([
          api.get('/candidate/profile'),
          api.get('/resumes')
        ]);
        
        setProfile({
          ...profileRes.data,
          title: profileRes.data.title || '',
          summary: profileRes.data.summary || '',
          phoneNumber: profileRes.data.phoneNumber || '',
          address: profileRes.data.address || '',
          skills: profileRes.data.skills || '',
          experiences: profileRes.data.experiences || [],
          educations: profileRes.data.educations || []
        });
        
        setResumes(resumesRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        if (error.response && error.response.data) {
          console.error('Detailed error from backend:', error.response.data);
        }
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
      
      const uploadRes = await api.post('/upload/resume', formData);

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
      // Clean up data: convert empty strings to null for dates
      const cleanedProfile = {
        ...profile,
        experiences: profile.experiences.map(exp => ({
          ...exp,
          startDate: exp.startDate || null,
          endDate: exp.endDate || null
        })),
        educations: profile.educations.map(edu => ({
          ...edu,
          startDate: edu.startDate || null,
          endDate: edu.endDate || null,
          gpa: edu.gpa ? parseFloat(edu.gpa) : null
        }))
      };

      await Promise.all([
        api.put('/candidate/profile', cleanedProfile),
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
      const res = await api.post('/upload/logo', formData);
      setPersonalInfo(prev => ({ ...prev, avatarUrl: res.data.url }));
      toast.success('Tải ảnh đại diện thành công!');
    } catch (error) {
      console.error('Avatar upload error:', error.response?.data || error);
      toast.error(error.response?.data?.error || 'Lỗi khi tải ảnh lên');
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
        gpa: '',
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
          <p className="text-slate-500 font-bold">Cập nhật thông tin chi tiết về kinh nghiệm và học vấn của bạn</p>
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
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Kỹ năng (Cách nhau bằng dấu phẩy)</label>
                    <input 
                      type="text" 
                      className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-brand-500/20 font-bold text-slate-900"
                      value={profile.skills || ''}
                      onChange={(e) => setProfile({...profile, skills: e.target.value})}
                      placeholder="VD: Java, React, SQL, Project Management"
                    />
                 </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-2 block">CV đính kèm (PDF/Image)</label>
                    <div className="flex flex-col gap-3">
                       <label className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 hover:border-brand-300 hover:bg-brand-50 transition cursor-pointer flex items-center justify-center gap-2 group">
                          {uploading ? (
                             <Loader2 size={18} className="animate-spin text-brand-600" />
                          ) : (
                             <Plus size={18} className="text-slate-400 group-hover:text-brand-600" />
                          )}
                          <span className="text-sm font-bold text-slate-500 group-hover:text-brand-600">
                             {profile.resumeUrl ? 'Thay đổi CV' : 'Tải CV lên'}
                          </span>
                          <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={handleResumeUpload} />
                       </label>
                       {profile.resumeUrl && (
                          <a 
                            href={profile.resumeUrl} 
                            target="_blank" 
                            rel="noreferrer"
                            className="text-[10px] font-bold text-brand-600 uppercase tracking-widest flex items-center gap-2 ml-2 hover:underline"
                          >
                             <FileText size={14} /> Xem CV hiện tại
                          </a>
                       )}
                    </div>
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

           {}
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
                          <div className="md:col-span-2">
                             <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Điểm trung bình (GPA)</label>
                             <input 
                               type="text" 
                               className="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold"
                               value={edu.gpa || ''}
                               onChange={(e) => updateEducation(idx, 'gpa', e.target.value)}
                               placeholder="VD: 3.8/4.0 hoặc 8.5/10"
                             />
                          </div>
                       </div>
                    </div>
                 ))}
                 {profile.educations.length === 0 && (
                   <p className="text-center py-10 text-slate-400 font-bold ">Chưa có thông tin học vấn nào được thêm</p>
                 )}
              </div>
           </section>
        </div>
      </div>
    </div>
  );
};

export default ResumeEditor;


