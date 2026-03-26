import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { CheckCircle2, XCircle, Loader2, ArrowRight, Zap } from 'lucide-react';

const PaymentResult = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('loading'); // loading, success, failed
    const [jobId, setJobId] = useState(null);

    useEffect(() => {
        const verifyPayment = async () => {
            try {
                const params = Object.fromEntries(searchParams.entries());
                // For demo purposes, we will treat 'success' param as immediate success if set
                if (params.status === 'success') {
                    setStatus('success');
                    if (params.jobId) setJobId(params.jobId);
                    return;
                }
                const res = await api.get('/public/vnpay/callback', { params });
                
                if (res.data.status === 'SUCCESS') {
                    setStatus('success');
                    setJobId(res.data.jobId);
                } else {
                    setStatus('failed');
                }
            } catch (error) {
                console.error('Payment verification failed:', error);
                setStatus('failed');
            }
        };

        verifyPayment();
    }, [searchParams]);

    return (
        <div className="pt-40 pb-20 w-full flex flex-col items-center justify-center min-h-[80vh] px-4">
            <div className="w-full max-w-xl bg-white rounded-[4rem] border border-slate-100 shadow-2xl p-12 text-center animate-in fade-in zoom-in duration-500">
                {status === 'loading' && (
                    <div className="flex flex-col items-center">
                        <Loader2 className="animate-spin text-brand-600 mb-6" size={60} />
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">Đang xác thực giao dịch</h1>
                        <p className="text-slate-500 font-medium tracking-wide">Vui lòng không đóng trình duyệt...</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="flex flex-col items-center">
                        <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mb-8 border-4 border-emerald-100/50 shadow-lg shadow-emerald-100">
                            <CheckCircle2 size={48} />
                        </div>
                        <h1 className="text-4xl font-bold text-slate-900 mb-4 tracking-tighter">Thanh toán thành công!</h1>
                        <p className="text-slate-500 font-medium mb-10 text-lg leading-relaxed px-4">
                            Tin tuyển dụng của bạn đã được đẩy lên vị trí ưu tiên. Hãy chuẩn bị đón chờ những ứng viên tiềm năng nhất!
                        </p>

                        <div className="grid grid-cols-2 gap-4 w-full">
                            <Link 
                                to="/employer/jobs"
                                className="px-8 py-4 bg-slate-900 text-white rounded-3xl font-bold hover:bg-black transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2"
                            >
                                Quản lý tin
                            </Link>
                            <Link 
                                to={`/jobs/${jobId}`}
                                className="px-8 py-4 bg-brand-50 text-brand-600 rounded-3xl font-bold hover:bg-brand-600 hover:text-white transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                                Xem bài đăng <ArrowRight size={18} />
                            </Link>
                        </div>
                    </div>
                )}

                {status === 'failed' && (
                    <div className="flex flex-col items-center">
                        <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 mb-8 border-4 border-rose-100/50 shadow-lg shadow-rose-100">
                            <XCircle size={48} />
                        </div>
                        <h1 className="text-4xl font-bold text-slate-900 mb-4 tracking-tighter">Giao dịch thất bại</h1>
                        <p className="text-slate-500 font-medium mb-10 text-lg leading-relaxed px-4">
                            Có lỗi xảy ra trong quá trình thanh toán hoặc giao dịch đã bị hủy. Vui lòng thử lại sau.
                        </p>

                        <div className="flex flex-col gap-4 w-full">
                            <Link 
                                to="/employer/jobs"
                                className="px-8 py-4 bg-brand-600 text-white rounded-3xl font-bold hover:bg-slate-900 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2"
                            >
                                <Zap size={18} /> Thử lại ngay
                            </Link>
                            <button 
                                onClick={() => navigate('/employer/dashboard')}
                                className="px-8 py-4 text-slate-400 font-bold hover:text-slate-900 transition-colors"
                            >
                                Quay về Dashboard
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentResult;
