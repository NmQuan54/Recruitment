import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
    ShieldCheck,
    CreditCard,
    Landmark,
    ChevronRight,
    Check,
    Lock,
    AtSign,
    Smartphone,
    Info,
    ArrowLeft,
    Clock,
    AlertCircle,
    Zap
} from 'lucide-react';

const VnpaySimulator = () => {
    const [searchParams] = useSearchParams();
    const amount = searchParams.get('amount') || '0';
    const orderInfo = searchParams.get('orderInfo') || 'Thanh toán quảng cáo tin tuyển dụng';
    const txnRef = searchParams.get('txnRef');
    const [paymentTime] = useState(new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }));

    // UI States: select, login, otp, processing
    const [step, setStep] = useState('select');
    const [loading, setLoading] = useState(false);
    const [otp, setOtp] = useState('');
    const [countdown, setCountdown] = useState(120);

    // Mock Card Data
    const [cardInfo, setCardInfo] = useState({
        number: '970419',
        name: 'NGUYEN VAN A',
        date: '07/15'
    });

    useEffect(() => {
        let timer;
        if (step === 'otp' && countdown > 0) {
            timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
        }
        return () => clearInterval(timer);
    }, [step, countdown]);

    const handleNextStep = (next) => {
        setLoading(true);
        setTimeout(() => {
            setStep(next);
            setLoading(false);
        }, 1200);
    };

    const finalizePayment = (code) => {
        setLoading(true);
        setTimeout(() => {
            const callbackUrl = `http://localhost:8088/api/public/vnpay/callback?vnp_ResponseCode=${code}&vnp_TxnRef=${txnRef}`;
            window.location.href = callbackUrl;
        }, 2000);
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    return (
        <div className="min-h-screen bg-[#f1f2f5] font-sans antialiased text-slate-700 pb-20">
            {/* VNPAY Header Mockup */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
                <div className="max-w-6xl mx-auto px-4 lg:px-10 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img
                            src='data:image/png;base64,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'
                            alt='VNPay'
                            className="h-10 w-auto object-contain"
                        />
                        <div className="hidden sm:block h-6 w-px bg-slate-200 mx-2"></div>
                        <span className="hidden sm:block font-extrabold text-[#005baa] text-[10px] tracking-widest uppercase italic">Cổng thanh toán</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex items-center gap-2 text-emerald-500 font-bold text-xs bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                            <ShieldCheck size={16} />
                            <span>THANH TOÁN AN TOÀN TUYỆT ĐỐI</span>
                        </div>
                        <select className="bg-slate-50 border-none text-[10px] font-bold uppercase tracking-wider text-slate-500 rounded-lg px-2">
                            <option>Tiếng Việt</option>
                            <option>English</option>
                        </select>
                    </div>
                </div>
            </div>

            <main className="max-w-5xl mx-auto px-4 py-8 grid lg:grid-cols-3 gap-8">

                {/* Left Panel: Order Overview (VNPAY Style) */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 border border-white">
                        <div className="bg-[#005baa] p-8 text-white text-center">
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80 mb-2">Số tiền thanh toán</p>
                            <h3 className="text-4xl font-black">{Number(amount).toLocaleString()} <span className="text-sm font-bold opacity-80">VND</span></h3>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="flex justify-between items-start gap-4">
                                <div className="flex-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-tighter">Mã đơn hàng</p>
                                    <p className="font-bold text-slate-800 text-sm tracking-tight break-all">VNP-{txnRef}</p>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-tighter">Thời gian thanh toán</p>
                                    <p className="font-black text-rose-500 text-sm flex items-center justify-end gap-1">
                                        <Clock size={14} /> {paymentTime}
                                    </p>
                                </div>
                            </div>

                            <div className="h-px bg-slate-100"></div>

                            {/* Service Status Row */}
                            <div className="flex items-center justify-between">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Trạng thái</p>
                                <div className="flex items-center gap-1.5 text-[9px] font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                                    <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></div>
                                    CHỜ THANH TOÁN
                                </div>
                            </div>

                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-tighter">Gói dịch vụ đã chọn</p>
                                <div className="bg-blue-50/50 rounded-2xl p-5 border border-blue-100/50 flex items-start gap-4">
                                    <div className="bg-white p-2.5 rounded-xl shadow-sm border border-blue-100 text-[#005baa]">
                                        <Zap size={20} className="fill-current" />
                                    </div>
                                    <div>
                                        <p className="font-black text-slate-700 text-xs uppercase leading-snug">{orderInfo}</p>
                                        <p className="text-[9px] text-[#005baa] font-bold mt-1 tracking-wider uppercase">Dịch vụ đẩy tin ưu tiên</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                                <ShieldCheck className="text-emerald-500" size={24} />
                                <p className="text-[10px] text-emerald-700 font-bold uppercase leading-tight tracking-tighter">Giao dịch được mã hóa và bảo mật 256-bit</p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => window.history.back()}
                        className="w-full mt-6 py-4 flex items-center justify-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-900 transition-all rounded-2xl border border-transparent hover:border-slate-200"
                    >
                        <ArrowLeft size={14} /> Quay lại trang tuyển dụng
                    </button>
                </div>

                {/* Right Panel: Payment Flow Steps */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200 overflow-hidden relative min-h-[500px]">

                        {/* Progress Stepper */}
                        {step !== 'select' && (
                            <div className="bg-slate-50 px-10 py-6 border-b border-slate-100 flex items-center gap-4">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step === 'login' ? 'bg-[#005baa] text-white shadow-lg shadow-blue-200' : 'bg-emerald-500 text-white'}`}>
                                    {step === 'otp' ? <Check size={14} /> : '1'}
                                </div>
                                <div className="h-px w-8 bg-slate-200"></div>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step === 'otp' ? 'bg-[#005baa] text-white shadow-lg shadow-blue-200' : 'bg-white text-slate-300 border border-slate-200'}`}>
                                    2
                                </div>
                                <span className="ml-auto text-[10px] font-black uppercase text-slate-400 tracking-widest">Bước tiếp theo: {step === 'login' ? 'Xác thực OTP' : 'Hoàn tất'}</span>
                            </div>
                        )}

                        <div className="p-10">
                            {/* Loading Overlay */}
                            {loading && (
                                <div className="absolute inset-0 bg-white group-hover:bg-white/80 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center">
                                    <div className="w-16 h-16 border-4 border-[#005baa]/10 border-t-[#005baa] rounded-full animate-spin mb-6"></div>
                                    <p className="font-black text-[#005baa] text-xs uppercase tracking-[0.3em] animate-pulse">Đang xử lý kết nối...</p>
                                </div>
                            )}

                            {/* STEP 1: SELECT METHOD */}
                            {step === 'select' && (
                                <div className="animate-in fade-in slide-in-from-bottom-5 duration-500">
                                    <h2 className="text-2xl font-black text-slate-900 mb-2">Chọn phương thức thanh toán</h2>
                                    <p className="text-slate-400 text-sm font-medium mb-10 tracking-tight leading-relaxed">Vui lòng chọn ngân hàng hoặc ví điện tử bạn muốn sử dụng để thanh toán đơn hàng này.</p>

                                    <div className="space-y-4">
                                        <button
                                            onClick={() => handleNextStep('login')}
                                            className="w-full flex items-center justify-between p-6 rounded-3xl border-2 border-slate-100 hover:border-[#005baa] hover:bg-blue-50/10 transition-all group active:scale-[0.98]"
                                        >
                                            <div className="flex items-center gap-5">
                                                <div className="w-16 h-16 bg-blue-50 text-[#005baa] rounded-2xl flex items-center justify-center group-hover:bg-[#005baa] group-hover:text-white transition-all shadow-sm">
                                                    <Landmark size={32} />
                                                </div>
                                                <div className="text-left">
                                                    <p className="font-bold text-slate-800 text-lg">Thẻ ATM và tài khoản ngân hàng</p>
                                                    <p className="text-xs text-slate-400 font-medium">Hỗ trợ các ngân hàng nội địa tại Việt Nam</p>
                                                </div>
                                            </div>
                                            <ChevronRight className="text-slate-300 group-hover:text-[#005baa] translate-x-0 group-hover:translate-x-1 transition-all" />
                                        </button>

                                        <div className="grid grid-cols-2 gap-4">
                                            <button className="flex flex-col items-center gap-3 p-6 rounded-3xl border-2 border-slate-50 opacity-50 grayscale cursor-not-allowed">
                                                <Smartphone size={32} className="text-slate-400" />
                                                <p className="text-xs font-bold text-slate-400">Ứng dụng Mobile</p>
                                            </button>
                                            <button className="flex flex-col items-center gap-3 p-6 rounded-3xl border-2 border-slate-50 opacity-50 grayscale cursor-not-allowed">
                                                <CreditCard size={32} className="text-slate-400" />
                                                <p className="text-xs font-bold text-slate-400">Thẻ Quốc tế</p>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mt-12 p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                        <div className="flex gap-4">
                                            <Info className="text-slate-400 shrink-0" size={20} />
                                            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                                                Giao dịch thanh toán được thực hiện qua cổng VNPAY. Bạn đồng ý với các <span className="text-[#005baa] underline cursor-pointer">điều khoản sử dụng</span> dịch vụ khi tiếp tục.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* STEP 2: LOGIN / CARD INFO */}
                            {step === 'login' && (
                                <div className="animate-in fade-in slide-in-from-right-10 duration-500">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-14 h-14 bg-[#005baa] rounded-2xl flex items-center justify-center text-white font-black text-xs shadow-lg shadow-blue-200">NCB</div>
                                        <div>
                                            <h2 className="text-xl font-black text-slate-900 leading-tight tracking-tight uppercase">Ngân hàng NCB</h2>
                                            <p className="text-xs text-emerald-500 font-bold flex items-center gap-1">
                                                <AtSign size={12} /> Cổng thanh toán quốc gia
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Số thẻ / Tài khoản (Test: 970419)</label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={cardInfo.number}
                                                    onChange={(e) => setCardInfo({ ...cardInfo, number: e.target.value })}
                                                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 pl-12 font-bold text-slate-700 focus:border-[#005baa] focus:ring-0 transition-all outline-none"
                                                    placeholder="9704 1988 **** ****"
                                                />
                                                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Tên chủ thẻ (Không dấu)</label>
                                                <input
                                                    type="text"
                                                    value={cardInfo.name}
                                                    onChange={(e) => setCardInfo({ ...cardInfo, name: e.target.value.toUpperCase() })}
                                                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-black text-slate-700 focus:border-[#005baa] focus:ring-0 transition-all outline-none tracking-wider"
                                                    placeholder="NGUYEN VAN A"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Ngày phát hành (MM/YY)</label>
                                                <input
                                                    type="text"
                                                    value={cardInfo.date}
                                                    onChange={(e) => setCardInfo({ ...cardInfo, date: e.target.value })}
                                                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-black text-slate-700 focus:border-[#005baa] focus:ring-0 transition-all outline-none"
                                                    placeholder="07/15"
                                                />
                                            </div>
                                        </div>

                                        <div className="pt-6">
                                            <button
                                                onClick={() => handleNextStep('otp')}
                                                className="w-full bg-[#005baa] hover:bg-black text-white font-black py-5 rounded-[1.5rem] shadow-xl shadow-blue-200 transition-all active:scale-[0.98] uppercase tracking-[0.2em] text-sm"
                                            >
                                                Xác nhận thông tin thẻ
                                            </button>
                                            <button
                                                onClick={() => setStep('select')}
                                                className="w-full mt-4 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-slate-900 transition-colors"
                                            >
                                                Chọn ngân hàng khác
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* STEP 3: OTP VERIFICATION */}
                            {step === 'otp' && (
                                <div className="text-center animate-in zoom-in-95 duration-500">
                                    <div className="w-20 h-20 bg-blue-50 text-[#005baa] rounded-[2rem] flex items-center justify-center mx-auto mb-6 border-b-4 border-blue-100">
                                        <Lock size={36} />
                                    </div>
                                    <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Xác thực giao dịch (OTP)</h2>
                                    <p className="text-slate-400 text-sm font-medium mb-10 tracking-tight leading-relaxed max-w-sm mx-auto">
                                        Một mã xác thực (OTP) đã được gửi đến số điện thoại đăng ký. Vui lòng nhập mã để hoàn tất.
                                    </p>

                                    <div className="max-w-xs mx-auto mb-10">
                                        <div className="flex justify-between items-center mb-4 px-2">
                                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none">Mã OTP (123456)</span>
                                            <span className="text-xs font-black text-rose-500 leading-none">{formatTime(countdown)}</span>
                                        </div>
                                        <input
                                            type="text"
                                            maxLength={6}
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl p-6 text-center text-3xl font-black tracking-[0.5em] text-[#005baa] focus:border-[#005baa] transition-all outline-none"
                                            placeholder="******"
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <button
                                            onClick={() => finalizePayment('00')}
                                            className="w-full bg-emerald-500 hover:bg-black text-white font-black py-5 rounded-[1.5rem] shadow-xl shadow-emerald-200 transition-all active:scale-[0.98] uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-2"
                                        >
                                            Hoàn tất thanh toán <ChevronRight size={18} />
                                        </button>
                                        <div className="flex grid-cols-2 gap-4">
                                            <button
                                                onClick={() => finalizePayment('24')}
                                                className="flex-1 bg-white border-2 border-slate-100 py-4 rounded-2xl text-slate-400 text-xs font-bold uppercase tracking-widest hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all"
                                            >
                                                Hủy giao dịch
                                            </button>
                                            <button
                                                disabled={countdown > 0}
                                                className={`flex-1 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all ${countdown > 0 ? 'bg-slate-50 text-slate-200 cursor-not-allowed' : 'bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white'}`}
                                            >
                                                Gửi lại OTP
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mt-12 flex items-center justify-center gap-2 text-emerald-500 font-bold text-[10px]">
                                        <ShieldCheck size={14} />
                                        <span>GIAO DỊCH CHỈ CÓ HIỆU LỰC TRONG MÔI TRƯỜNG THỬ NGHIỆM</span>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>

                    <div className="mt-10 flex flex-wrap justify-between items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">
                        <div className="flex items-center gap-4">
                            <span className="hover:text-slate-600 cursor-pointer">Chính sách bảo mật</span>
                            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                            <span className="hover:text-slate-600 cursor-pointer">Hướng dẫn thanh toán</span>
                        </div>
                        <p>© 2026 VNPAY GATEWAY SIMULATOR</p>
                    </div>
                </div>
            </main>

            {/* Custom Styles for Input placeholder transition */}
            <style dangerouslySetInnerHTML={{
                __html: `
                input::placeholder {
                    letter-spacing: normal;
                    font-weight: 600;
                    font-size: 14px;
                    opacity: 0.3;
                }
            `}} />
        </div>
    );
};

export default VnpaySimulator;
