import React from 'react';
import { Link } from 'react-router-dom';
import { BriefcaseIcon, GithubIcon, TwitterIcon, LinkedinIcon, MailIcon } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative mt-20 pt-24 pb-12 w-full flex justify-center overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
      
      <div className="w-[90%] mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center group mb-8">
              <img src="/logo.png" alt="RecruitPro" className="h-10 w-auto object-contain" />
            </Link>
            <p className="text-slate-500 font-medium leading-relaxed">
              Kiến tạo tương lai sự nghiệp cho thế hệ mới thông qua kết nối thông minh và minh bạch.
            </p>
          </div>

          <div>
            <h4 className="text-slate-900 font-bold text-sm uppercase tracking-[0.2em] mb-8">Dành cho ứng viên</h4>
            <ul className="space-y-4">
              <li><Link to="/jobs" className="text-slate-500 hover:text-brand-600 font-bold transition-colors">Tìm kiếm việc làm</Link></li>
              <li><Link to="/candidate/dashboard" className="text-slate-500 hover:text-brand-600 font-bold transition-colors">Hồ sơ cá nhân</Link></li>
              <li><Link to="/candidate/dashboard" className="text-slate-500 hover:text-brand-600 font-bold transition-colors">Công việc đã ứng tuyển</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-900 font-bold text-sm uppercase tracking-[0.2em] mb-8">Dành cho doanh nghiệp</h4>
            <ul className="space-y-4">
              <li><Link to="/employer/dashboard" className="text-slate-500 hover:text-brand-600 font-bold transition-colors">Quản trị tuyển dụng</Link></li>
              <li><Link to="/employer/post-job" className="text-slate-500 hover:text-brand-600 font-bold transition-colors">Đăng tin tuyển dụng</Link></li>
              <li><Link to="/employer/dashboard" className="text-slate-500 hover:text-brand-600 font-bold transition-colors">Giải pháp nhân sự</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-900 font-bold text-sm uppercase tracking-[0.2em] mb-8">Liên hệ</h4>
            <div className="flex gap-4 mb-8">
              <a href="#" className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-brand-50 hover:text-brand-600 transition-all">
                <TwitterIcon size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-brand-50 hover:text-brand-600 transition-all">
                <LinkedinIcon size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-brand-50 hover:text-brand-600 transition-all">
                <MailIcon size={18} />
              </a>
            </div>
            <p className="text-slate-400 text-sm font-bold ">support@recruitpro.com</p>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-400 font-bold text-sm">
            &copy; {new Date().getFullYear()} RecruitPro System. Made with magic by Antigravity.
          </p>
          <div className="flex gap-8">
            <a href="#" className="text-slate-400 hover:text-slate-600 text-xs font-bold uppercase tracking-widest">Quy định bảo mật</a>
            <a href="#" className="text-slate-400 hover:text-slate-600 text-xs font-bold uppercase tracking-widest">Điều khoản sử dụng</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


