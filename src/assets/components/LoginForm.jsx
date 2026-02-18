
import { useAuth } from '../hooks/useAuth';
import { MdEmail, MdLock, MdLogin } from 'react-icons/md';

const LoginForm = () => {
    const { username, setUsername, password, setPassword, handleLogin, isLoading } = useAuth();

    return (
        <div className="w-full">
            <div className="mb-5 text-left">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-2">Welcome Back</h2>
                <p className="text-slate-400 font-bold text-[11px] uppercase tracking-wide">Enter credentials to access portal</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
                <div>
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Username / ID</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                            <MdEmail size={16} />
                        </div>
                        <input
                            type="text"
                            required
                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-900 font-bold outline-none focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-300 shadow-sm"
                            placeholder="Username..."
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Secure Password</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                            <MdLock size={16} />
                        </div>
                        <input
                            type="password"
                            required
                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-900 font-bold outline-none focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-300 shadow-sm"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                </div>

                <div className="pt-2">
                    <button
                        className="w-full h-14 bg-[#00144d] text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-blue-900/10 hover:bg-blue-900 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:pointer-events-none"
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>Authenticating...</span>
                            </>
                        ) : (
                            <>
                                <MdLogin size={18} />
                                <span>Authorize Access</span>
                            </>
                        )}
                    </button>

                    <button type="button" className="w-full mt-3 text-[9px] font-black text-slate-300 uppercase tracking-widest hover:text-blue-600 transition-colors">
                        Forgot Password?
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;
