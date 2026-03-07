import React, { useState, useRef, useEffect } from 'react';
import { createWorker } from 'tesseract.js';
import api from '../services/api';
import JobCard from '../components/JobCard';
import { 
  Upload, 
  Loader2, 
  Sparkles, 
  FileText, 
  X, 
  CheckCircle2, 
  Zap,
  ArrowRight,
  BrainCircuit,
  Lightbulb,
  Search,
  Scan,
  Cpu,
  Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AIScanner = () => {
  // --- UI & Detection States ---
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [scanStatus, setScanStatus] = useState('Chờ tải file...');
  const [results, setResults] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  // --- Handlers ---
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResults([]);
      setKeywords([]);
      setError(null);
      setScanStatus('Sẵn sàng quét');
    }
  };

  /**
   * Keyword Extraction Logic
   * Maps common job terms found in OCR text to searchable keywords.
   */
  const extractKeywords = (text) => {
    const commonSkills = [
      // IT & Tech
      'React', 'Javascript', 'JS', 'Java', 'Spring', 'SpringBoot', 'Python', 'Node', 'SQL', 
      'Fullstack', 'Frontend', 'Backend', 'Web', 'Mobile', 'Android', 'iOS', 'Flutter', 'React Native',
      'PHP', 'Laravel', 'C++', 'C#', 'Net', 'Swift', 'DevOps', 'AWS', 'Cloud', 'Docker',
      
      // Creative & Design
      'UI/UX', 'Figma', 'Photoshop', 'Adobe', 'Illustrator', 'Designer', 'Design', '2D', '3D',
      
      // Business & Marketing
      'Marketing', 'Digital Marketing', 'SEO', 'Content', 'Copywriter', 'Account', 'Manager',
      'Sales', 'Kinh doanh', 'Bán hàng', 'Tư vấn', 'Chăm sóc khách hàng', 'Customer Service',
      
      // Professional Services
      'HR', 'Nhân sự', 'Tuyển dụng', 'Recruitment', 'Accountant', 'Kế toán', 'Kiểm toán',
      'Finance', 'Tài chính', 'Luật', 'Legal', 'Translator', 'Thông dịch', 'Biên dịch'
    ];
    
    const found = [];
    const normalizedText = text.toLowerCase();
    
    commonSkills.forEach(skill => {
      // Relaxed regex: handle noisy OCR text without strict word boundaries
      const escapedSkill = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // If the skill is short (e.g. JS, PHP), we still want some boundaries, but for longer ones we are more lenient
      const regex = skill.length <= 3 
        ? new RegExp(`\\b${escapedSkill}\\b`, 'i')
        : new RegExp(`${escapedSkill}`, 'i');
      
      if (regex.test(normalizedText)) {
        found.push(skill);
      }
    });

    // Fallback search if no specific skills found
    if (found.length === 0) {
      const topWords = ['Developer', 'Designer', 'Marketing', 'Sales', 'Manager', 'Tester', 'Fullstack'];
      topWords.forEach(w => {
        if (normalizedText.includes(w.toLowerCase())) found.push(w);
      });
    }

    return [...new Set(found)].slice(0, 5);
  };

  /**
   * OCR & Matching Execution
   */
  const startScan = async () => {
    if (!image) return;
    setScanning(true);
    setProgress(0);
    setError(null);
    setScanStatus('Khởi tạo AI Engine...');

    try {
      // Initialize Tesseract Worker
      const worker = await createWorker('vie+eng', 1, {
        logger: m => {
          if (m.status === 'recognizing text') {
            setProgress(parseInt(m.progress * 100));
            setScanStatus(`Đang đọc dữ liệu CV: ${parseInt(m.progress * 100)}%`);
          }
        }
      });

      // Perform Recognition
      setScanStatus('Đang truy vết ký tự quang học...');
      const { data: { text } } = await worker.recognize(image);
      await worker.terminate();

      // Analyze Results
      setScanStatus('Đang bóc tách kỹ năng...');
      const extracted = extractKeywords(text);
      setKeywords(extracted);

      if (extracted.length === 0) {
        throw new Error('Hệ thống không tìm thấy từ khóa kỹ năng nào khả dụng. Hãy chắc chắn ảnh CV của bạn sáng sủa và rõ chữ.');
      }

      // Query Backend for Real Job Matches
      setScanStatus('Đang đối soát kho dữ liệu...');
      
      let matchedJobs = [];
      const primaryKeyword = extracted.slice(0, 2).join(' ');

      // Step 1: Specific Match
      const resPrimary = await api.get('/jobs', { params: { keyword: primaryKeyword, size: 9 } });
      matchedJobs = resPrimary.data.content || [];

      // Step 2: Fallback to individual keywords if specific match is empty
      if (matchedJobs.length === 0) {
        setScanStatus('Mở rộng phạm vi tìm kiếm...');
        for (const kw of extracted) {
          try {
            const res = await api.get('/jobs', { params: { keyword: kw, size: 5 } });
            const foundJobs = res.data.content || [];
            // Merge and deduplicate
            foundJobs.forEach(job => {
              if (!matchedJobs.find(mj => mj.id === job.id)) {
                matchedJobs.push(job);
              }
            });
            if (matchedJobs.length >= 6) break;
          } catch (_) {}
        }
      }
      
      setResults(matchedJobs);
      setScanStatus('Đối soát hoàn tất!');
      
      if (matchedJobs.length === 0) {
        setError('Hệ thống đã nhận diện được kỹ năng nhưng đáng tiếc là hiện chưa có tin tuyển dụng nào tương ứng trên website.');
      }

    } catch (err) {
      console.error('AI Scan Error:', err);
      setError(err.message || 'Lỗi hệ thống khi phân tích mã nguồn. Vui lòng thử lại.');
    } finally {
      setScanning(false);
    }
  };

  const clear = () => {
    setImage(null);
    setPreview(null);
    setResults([]);
    setKeywords([]);
    setError(null);
    setProgress(0);
    setScanStatus('Sẵn sàng quét mới');
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 bg-[#f8fafc] relative overflow-hidden">
      {/* Background Decor - Crystal Blue Theme */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-brand-200/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-sky-200/20 blur-[120px] rounded-full" />
        <div className="absolute top-[10%] right-[10%] w-64 h-64 bg-indigo-100/30 blur-[150px] rounded-full" />
      </div>

      <div className="max-w-[85rem] mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-flex items-center gap-3 px-6 py-2.5 bg-white border border-brand-100 rounded-[2rem] shadow-sm mb-8"
          >
            <div className="bg-brand-600 p-2 rounded-xl scale-90">
              <Sparkles className="text-white" size={18} />
            </div>
            <span className="text-[11px] font-black text-brand-700 uppercase tracking-widest leading-none">Smart Matching System</span>
          </motion.div>
          <h1 className="text-6xl font-black text-slate-900 mb-6 tracking-tighter leading-tight">
            Quét CV. <span className="text-gradient">Kết Nối.</span> Phát Triển.
          </h1>
          <p className="text-slate-400 font-bold text-lg max-w-2xl mx-auto leading-relaxed">
            Công nghệ AI thông minh tự động đọc hiểu năng lực từ CV của bạn và đối soát với hàng ngàn tin tuyển dụng trên website để đưa ra gợi ý tốt nhất.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left Side: Scanner Portal */}
          <motion.div
            layout
            className="w-full lg:w-[450px] bg-white rounded-[3.5rem] border border-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] p-8 relative overflow-hidden shrink-0"
          >
            {!preview ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="aspect-[3/4] border-4 border-dashed border-slate-50 rounded-[2.5rem] flex flex-col items-center justify-center gap-8 cursor-pointer hover:border-brand-200 hover:bg-brand-50/20 transition-all group overflow-hidden relative"
              >
                 <div className="absolute inset-0 bg-gradient-to-br from-brand-50/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-24 h-24 bg-brand-50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner relative z-10">
                  <Upload className="text-brand-300 group-hover:text-brand-600" size={40} />
                </div>
                <div className="text-center relative z-10 p-4">
                  <p className="text-xl font-black text-slate-900 mb-2">Tải CV của bạn lên</p>
                  <p className="text-slate-400 font-bold text-xs tracking-widest uppercase mb-6">Định dạng hình ảnh rõ nét</p>
                  <div className="inline-flex items-center gap-2 px-6 py-2 bg-slate-100/50 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <Scan size={14} /> Tự động nhận diện
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="relative rounded-[2.5rem] overflow-hidden border-4 border-slate-50 shadow-2xl group flex justify-center bg-slate-900 min-h-[400px]">
                  <img src={preview} alt="CV Preview" className="w-full h-auto object-contain" />
                  
                  {/* Scanning Animation Overlays */}
                  <AnimatePresence>
                    {scanning && (
                      <>
                        <motion.div 
                          initial={{ top: '0%' }}
                          animate={{ top: '100%' }}
                          transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                          className="absolute left-0 right-0 h-1.5 bg-brand-400/80 shadow-[0_0_30px_rgba(37,99,235,1)] z-20 backdrop-blur-sm"
                        />
                        <motion.div 
                          initial={{ top: '0%', opacity: 0 }}
                          animate={{ top: '100%', opacity: [0, 1, 0] }}
                          transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', delay: 0.2 }}
                          className="absolute left-0 right-0 h-20 bg-gradient-to-b from-brand-400/20 to-transparent z-10"
                        />
                        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
                          {Array.from({ length: 8 }).map((_, i) => (
                            <motion.div
                              key={i}
                              initial={{ y: -20, x: Math.random() * 100 + '%', opacity: 0 }}
                              animate={{ y: '100%', opacity: [0, 1, 0] }}
                              transition={{ duration: Math.random() * 2 + 1, repeat: Infinity, delay: Math.random() * 2 }}
                              className="absolute w-px h-16 bg-brand-300/20"
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </AnimatePresence>

                  {!scanning && (
                    <button 
                      onClick={clear}
                      className="absolute top-6 right-6 p-4 bg-white/20 backdrop-blur-md text-white rounded-2xl hover:bg-black transition-colors border border-white/20"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>

                <div className="bg-slate-50 rounded-[1.5rem] p-6 border border-slate-100">
                   <div className="flex items-center gap-3 mb-2">
                     <Cpu className="text-brand-600" size={20} />
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AI Scanner Status</span>
                   </div>
                   <p className="text-slate-900 font-black text-sm">{scanStatus}</p>
                </div>

                {!scanning && results.length === 0 && (
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={startScan}
                    className="w-full py-6 bg-brand-600 text-white rounded-[2rem] font-black text-xl shadow-[0_30px_60px_rgba(37,99,235,0.3)] flex items-center justify-center gap-4 group"
                  >
                    Bắt đầu đối soát AI
                    <Target size={22} className="group-hover:rotate-45 transition-transform" />
                  </motion.button>
                )}
              </div>
            )}
            <input 
              type="file" 
              className="hidden" 
              ref={fileInputRef} 
              accept="image/*" 
              onChange={handleFileChange}
            />
          </motion.div>

          {/* Right Side: Results Insight Area */}
          <div className="flex-grow space-y-8">
            <AnimatePresence mode="wait">
              {results.length > 0 ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Analytic Result Card */}
                  <div className="bg-white border-2 border-emerald-50 p-10 rounded-[3.5rem] relative overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] mb-10">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/5 blur-[100px] rounded-full" />
                    <div className="flex flex-col md:flex-row items-center gap-10">
                      <div className="w-32 h-32 bg-emerald-500 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl relative">
                        <CheckCircle2 size={56} />
                        <motion.div 
                          animate={{ scale: [1, 1.2, 1] }} 
                          transition={{ repeat: Infinity, duration: 2 }} 
                          className="absolute -top-2 -right-2 w-8 h-8 bg-white text-emerald-500 rounded-full flex items-center justify-center shadow-lg"
                        >
                          <Zap size={16} />
                        </motion.div>
                      </div>
                      <div className="text-center md:text-left">
                        <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Đã tìm thấy việc làm tương ứng!</h3>
                        <p className="text-slate-400 font-bold text-lg mb-6">AI đã nhận diện được các kỹ năng chủ chốt từ hồ sơ của bạn:</p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-3">
                          {keywords.map((kw, i) => (
                            <motion.span 
                               key={i} 
                               initial={{ scale: 0 }} 
                               animate={{ scale: 1 }} 
                               transition={{ delay: 0.3 + (i * 0.1) }}
                               className="px-5 py-2.5 bg-emerald-50 text-emerald-600 rounded-2xl text-xs font-black uppercase tracking-widest border border-emerald-100 shadow-sm flex items-center gap-2"
                            >
                              <Lightbulb size={14} className="text-emerald-400" />
                              {kw}
                            </motion.span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* List of Matched Jobs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {results.map((job, idx) => (
                      <motion.div
                        key={job.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                      >
                         <JobCard job={job} />
                      </motion.div>
                    ))}
                  </div>

                  <div className="text-center mt-12">
                    <button 
                      onClick={() => navigate('/jobs')}
                      className="inline-flex items-center gap-3 px-10 py-5 bg-white border border-slate-100 text-slate-500 rounded-[2.5rem] font-bold text-sm tracking-widest uppercase hover:bg-slate-950 hover:text-white hover:border-slate-950 transition-all shadow-xl shadow-slate-200/20 group"
                    >
                      Khám phá thêm việc làm khác
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              ) : error ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-16 text-center bg-white border border-red-50 rounded-[3.5rem] shadow-xl"
                >
                  <div className="w-24 h-24 bg-red-50 rounded-full mx-auto flex items-center justify-center mb-8">
                    <X className="text-red-400" size={40} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Cắt nghĩa không thành công</h3>
                  <p className="text-slate-400 font-bold text-lg mb-8 max-w-md mx-auto">{error}</p>
                  <button onClick={clear} className="px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-colors">Thử lại hồ sơ khác</button>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-full min-h-[500px] text-center p-16 border-4 border-dashed border-slate-100 rounded-[3.5rem] bg-white gap-10"
                >
                  <div className="relative">
                    <div className="w-32 h-32 bg-slate-50 rounded-[2.5rem] flex items-center justify-center animate-pulse">
                      <FileText className="text-slate-100" size={64} />
                    </div>
                     <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center border border-slate-50 shadow-lg">
                       <Search className="text-slate-200" size={24} />
                     </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">Bảng kết quả đối soát</h3>
                    <p className="text-slate-400 font-bold text-lg max-w-sm mx-auto leading-relaxed">
                      Các cơ hội nghề nghiệp tương xứng hiện có trên website sẽ được liệt kê tại đây sau khi bạn quét CV.
                    </p>
                  </div>
                  <div className="flex flex-col gap-4 w-full max-w-xs px-10">
                    <div className="h-2 bg-slate-50 rounded-full w-full" />
                    <div className="h-2 bg-slate-50 rounded-full w-[80%] mx-auto" />
                    <div className="h-2 bg-slate-50 rounded-full w-[60%] mx-auto" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIScanner;
