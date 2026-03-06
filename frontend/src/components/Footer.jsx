import React from 'react';
import { Link } from 'react-router-dom';
import { BriefcaseIcon, GithubIcon, TwitterIcon, LinkedinIcon, MailIcon } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative mt-20 pt-32 pb-12 w-full bg-slate-950 overflow-hidden">
      {}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-fuchsia-600/30 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 blur-[100px] rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[700px] h-[700px] bg-emerald-500/20 blur-[140px] rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-500 to-transparent opacity-20"></div>
      </div>
      
      <div className="w-[90%] mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center group mb-10">
              <div className="relative p-1 rounded-2xl bg-gradient-to-tr from-brand-500 via-fuchsia-500 to-amber-400">
                <div className="bg-white px-4 py-2 rounded-xl">
                  <img src="/logo.png" alt="RecruitPro" className="h-8 w-auto object-contain" />
                </div>
              </div>
            </Link>
            <p className="text-slate-300 font-bold leading-relaxed mb-10 opacity-90 text-xl tracking-tight">
              Nơi khơi nguồn <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-pink-400 to-rose-400 font-black text-3xl ml-1">Đam mê</span>, <br />
              Chạm tới <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-emerald-400 to-teal-400 font-black text-3xl ml-1">Thành công</span>.
            </p>
            <div className="flex gap-4">
              {[
                { Icon: TwitterIcon, color: 'hover:bg-blue-400' },
                { Icon: LinkedinIcon, color: 'hover:bg-blue-700' },
                { Icon: GithubIcon, color: 'hover:bg-slate-800' }
              ].map((item, idx) => (
                <a key={idx} href="#" className={`w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 ${item.color} hover:text-white hover:-translate-y-2 transition-all duration-500 shadow-lg hover:shadow-white/5`}>
                  <item.Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 font-black text-sm uppercase tracking-[0.4em] mb-12 flex items-center gap-3">
              <span className="w-8 h-[2px] bg-gradient-to-r from-fuchsia-500 to-transparent"></span> Candidate
            </h4>
            <ul className="space-y-6">
              {[
                { label: 'Tìm việc nhanh', path: '/jobs', color: 'bg-fuchsia-500' },
                { label: 'Hồ sơ cá nhân', path: '/candidate/dashboard', color: 'bg-brand-500' },
                { label: 'Việc làm ưu tú', path: '/jobs', color: 'bg-amber-500' }
              ].map((link, idx) => (
                <li key={idx}>
                  <Link to={link.path} className="text-slate-300 hover:text-white font-bold text-lg transition-all flex items-center gap-3 group">
                    <span className={`w-2.5 h-2.5 rounded-full ${link.color} shadow-[0_0_15px_rgba(0,0,0,0.5)] group-hover:scale-150 transition-transform`}></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 font-black text-sm uppercase tracking-[0.4em] mb-12 flex items-center gap-3">
              <span className="w-8 h-[2px] bg-gradient-to-r from-emerald-500 to-transparent"></span> Employer
            </h4>
            <ul className="space-y-6">
               {[
                { label: 'Đăng tin tuyển dụng', path: '/employer/post-job', color: 'bg-emerald-500' },
                { label: 'Bảng điều khiển', path: '/employer/dashboard', color: 'bg-blue-500' },
                { label: 'Quản lý ứng viên', path: '/employer/applications', color: 'bg-teal-500' }
              ].map((link, idx) => (
                <li key={idx}>
                  <Link to={link.path} className="text-slate-300 hover:text-white font-bold text-lg transition-all flex items-center gap-3 group">
                    <span className={`w-2.5 h-2.5 rounded-full ${link.color} shadow-[0_0_15px_rgba(0,0,0,0.5)] group-hover:scale-150 transition-transform`}></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 font-black text-sm uppercase tracking-[0.4em] mb-12 flex items-center gap-3">
              <span className="w-8 h-[2px] bg-gradient-to-r from-amber-500 to-transparent"></span> Contact
            </h4>
            <div className="relative p-[1px] rounded-3xl bg-gradient-to-br from-white/20 via-transparent to-white/5 mb-8">
              <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl p-8 border border-white/5">
                <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-4 opacity-70">Email Support</p>
                <p className="text-transparent bg-clip-text bg-gradient-to-r from-white via-brand-300 to-fuchsia-300 font-black text-xl flex items-center gap-3">
                  <MailIcon size={24} className="text-brand-400" />
                  support@recruit.com
                </p>
              </div>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] leading-relaxed">
              Duy Tân, Cầu Giấy, Hà Nội <br />
              Viet Nam &copy; 2026
            </p>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-slate-400 font-bold text-sm tracking-[0.1em]">
            Developed with <span className="animate-pulse text-red-500">✦</span> and <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-brand-500 font-black">Magic</span> by Antigravity
          </p>
          <div className="flex gap-12">
            {['Privacy', 'Terms', 'Support'].map((text, idx) => (
               <a key={idx} href="#" className="text-slate-400 hover:text-white text-xs font-black uppercase tracking-[0.3em] transition-all hover:tracking-[0.5em]">
                {text}
               </a>
            ))}
          </div>
        </div>
      </div>
      
      {}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-fuchsia-500 to-transparent opacity-50 blur-sm"></div>
    </footer>
  );
};

export default Footer;


