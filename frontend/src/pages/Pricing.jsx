import React from 'react';
import { Check, Zap, Crown, Rocket, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Pricing = () => {
  const plans = [
    {
      name: 'Khởi đầu',
      price: '0',
      description: 'Dành cho các doanh nghiệp mới bắt đầu tuyển dụng.',
      icon: <Zap className="text-blue-500" size={32} />,
      features: [
        'Đăng tối đa 3 tin tuyển dụng',
        'Hiển thị trong 15 ngày',
        'Quản lý ứng viên cơ bản',
        'Hỗ trợ qua email',
      ],
      buttonText: 'Bắt đầu ngay',
      popular: false,
      color: 'blue'
    },
    {
      name: 'Chuyên nghiệp',
      price: '990.000',
      description: 'Giải pháp tối ưu cho nhu cầu tuyển dụng thường xuyên.',
      icon: <Rocket className="text-brand-600" size={32} />,
      features: [
        'Đăng không giới hạn tin tuyển dụng',
        'Tin đăng được đẩy lên đầu trang',
        'Hiển thị nhãn "Gấp" nổi bật',
        'Tiếp cận kho 50.000+ ứng viên',
        'Hỗ trợ ưu tiên 24/7',
      ],
      buttonText: 'Nâng cấp ngay',
      popular: true,
      color: 'brand'
    },
    {
      name: 'Doanh nghiệp',
      price: '2.490.000',
      description: 'Xây dựng thương hiệu tuyển dụng chuyên nghiệp.',
      icon: <Crown className="text-amber-500" size={32} />,
      features: [
        'Tất cả tính năng bản Chuyên nghiệp',
        'Quảng cáo banner trang chủ',
        'Trang hồ sơ công ty VIP',
        'Phân tích & Báo cáo chuyên sâu',
        'Chuyên viên hỗ trợ riêng biệt',
      ],
      buttonText: 'Liên hệ tư vấn',
      popular: false,
      color: 'amber'
    }
  ];

  return (
    <div className="max-w-[90rem] mx-auto px-4 pt-32 pb-20 overflow-hidden">
      {/* Header */}
      <div className="text-center mb-20 max-w-none mx-auto animate-fade-in">
        <h2 className="text-brand-600 font-bold uppercase tracking-[0.3em] text-sm mb-4">Bảng giá dịch vụ</h2>
        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6  tracking-tight">
          Nâng tầm thương hiệu <br /> tuyển dụng của bạn
        </h1>
        <p className="text-slate-500 font-bold text-lg">
          Chọn gói dịch vụ phù hợp để tiếp cận những ứng viên tài năng nhất và tối ưu hóa quy trình tuyển dụng của doanh nghiệp.
        </p>
      </div>

      {/* Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        {/* Background purely for aesthetics */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-brand-50/30 blur-[120px] rounded-full -z-10"></div>
        
        {plans.map((plan, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative flex flex-col bg-white rounded-[3.5rem] p-10 shadow-2xl transition-all duration-500 border-2 ${
              plan.popular ? 'border-brand-600 scale-105 z-10' : 'border-transparent hover:border-slate-100'
            }`}
          >
            {plan.popular && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-600 text-white px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-xl shadow-brand-200">
                Phổ biến nhất
              </div>
            )}

            <div className={`w-16 h-16 rounded-3xl mb-8 flex items-center justify-center ${
              plan.color === 'blue' ? 'bg-blue-50' : plan.color === 'brand' ? 'bg-brand-50' : 'bg-amber-50'
            }`}>
              {plan.icon}
            </div>

            <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
              <span className="text-slate-400 font-bold text-sm">VNĐ / tháng</span>
            </div>
            <p className="text-slate-500 font-bold text-sm mb-10 leading-relaxed ">
              {plan.description}
            </p>

            <div className="space-y-5 mb-12 flex-grow">
              {plan.features.map((feature, fIndex) => (
                <div key={fIndex} className="flex gap-4">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                    plan.popular ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-400'
                  }`}>
                    <Check size={14} />
                  </div>
                  <span className="text-slate-600 font-bold text-sm">{feature}</span>
                </div>
              ))}
            </div>

            <button className={`w-full py-5 rounded-3xl font-bold text-lg flex items-center justify-center gap-3 transition-all active:scale-95 ${
              plan.popular 
              ? 'bg-brand-600 text-white shadow-2xl shadow-brand-200 hover:bg-brand-700' 
              : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}>
              {plan.buttonText}
              <ArrowRight size={20} />
            </button>
          </motion.div>
        ))}
      </div>

      {/* FAQ Link */}
      <p className="text-center mt-20 text-slate-400 font-bold ">
        Bạn có nhu cầu tuyển dụng lớn hơn? <button className="text-brand-600 underline">Liên hệ với chúng tôi</button> để nhận báo giá tùy chỉnh.
      </p>
    </div>
  );
};

export default Pricing;



