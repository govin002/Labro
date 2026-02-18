
import LoginForm from './LoginForm';

const LoginPage = () => {
    return (
        <div className="min-h-screen bg-[#00144d] flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-400/20 rounded-full blur-[120px]"></div>

            <div className="w-full max-w-4xl z-10 scale-[0.9] md:scale-100 transition-transform">
                <div className="text-center mb-6">
                    <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter mb-1">
                        GOVINDA <span className="text-blue-400">PATHOLOGY</span>
                    </h1>
                    <div className="h-1 w-16 bg-blue-500 mx-auto rounded-full mb-3"></div>
                    <p className="text-blue-200 text-[10px] font-bold uppercase tracking-[0.3em]">Advanced Diagnostic Center</p>
                </div>

                <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden border border-white/10 flex flex-col md:row">
                    <div className="flex flex-col md:flex-row divide-x divide-slate-100">
                        {/* Form Section */}
                        <div className="flex-1 p-6 md:p-10">
                            <LoginForm />
                        </div>

                        {/* Right Info Section */}
                        <div className="hidden md:flex flex-1 bg-slate-50 items-center justify-center p-12 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-blue-600/5 group-hover:bg-blue-600/10 transition-colors"></div>
                            <div className="relative z-10 text-center">
                                <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-blue-600/30 rotate-3 group-hover:rotate-6 transition-transform">
                                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                    </svg>
                                </div>
                                <h4 className="text-xl font-black text-slate-800 mb-2 tracking-tight">Reliable Diagnostics</h4>
                                <p className="text-slate-500 text-[13px] leading-relaxed font-bold">
                                    Accurate Results with Cutting-Edge Technology for Better Healthcare.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <p className="text-center text-blue-300/50 text-[9px] font-bold uppercase mt-8 tracking-widest">
                    &copy; 2026 Govinda Pathology Lab.
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
