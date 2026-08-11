import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loading, login } = useAuth();

  const redirect = location.state?.from?.pathname || '/shop';

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate(redirect, { replace: true });
    }
  }, [isAuthenticated, loading, navigate, redirect]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);

    if (result.success) {
      navigate(redirect, { replace: true });
    } else {
      setError(result.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 max-w-[1100px] w-full min-h-[600px] bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white flex items-center justify-center p-16 relative overflow-hidden">
            <div className="relative z-10 max-w-[400px]">
              <div className="flex items-center gap-2.5 mb-10">
                <span className="w-10 h-10 bg-primary rounded-md flex items-center justify-center font-extrabold text-white text-lg">V</span>
                <span className="text-2xl font-bold tracking-tight">Virevo</span>
              </div>
            </div>
            <div className="absolute -top-[50%] -right-[30%] w-[400px] h-[400px] bg-primary/30 rounded-full blur-3xl"></div>
          </div>
          <div className="flex items-center justify-center p-16 bg-white">
            <div className="w-full max-w-[380px]">
              <div className="w-10 h-10 border-2 border-primary-light border-t-primary rounded-full animate-spin mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 max-w-[1100px] w-full min-h-[600px] bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white flex items-center justify-center p-16 relative overflow-hidden">
          <div className="relative z-10 max-w-[400px]">
            <div className="flex items-center gap-2.5 mb-10">
              <span className="w-10 h-10 bg-primary rounded-md flex items-center justify-center font-extrabold text-white text-lg">V</span>
              <span className="text-2xl font-bold tracking-tight">Virevo</span>
            </div>
            <h1 className="text-3xl font-bold mb-4 leading-tight">Welcome Back</h1>
            <p className="text-slate-400 text-sm leading-relaxed mb-8">Sign in to continue your shopping journey and discover amazing deals.</p>
            <div className="flex flex-col gap-3.5">
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <span className="text-primary text-base">✦</span>
                <span>Exclusive member deals</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <span className="text-primary text-base">✦</span>
                <span>Fast & secure checkout</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <span className="text-primary text-base">✦</span>
                <span>Track your orders easily</span>
              </div>
            </div>
          </div>
          <div className="absolute -top-[50%] -right-[30%] w-[400px] h-[400px] bg-primary/30 rounded-full blur-3xl"></div>
        </div>

        <div className="flex items-center justify-center p-16 bg-white">
          <div className="w-full max-w-[380px]">
            <div className="mb-8">
              <h2 className="text-[26px] font-bold text-gray-800 mb-2">Sign In</h2>
              <p className="text-sm text-slate-500">Enter your credentials to access your account</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {error && <div className="bg-red-50 text-danger px-4 py-3 rounded-lg text-sm border border-red-200">{error}</div>}

              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-xs font-medium text-gray-800">Email Address</label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3.5 text-slate-400 pointer-events-none" size={18} />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-800 bg-white transition-all duration-200 focus:border-primary focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)] outline-none"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="password" className="text-xs font-medium text-gray-800">Password</label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3.5 text-slate-400 pointer-events-none" size={18} />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg text-sm text-gray-800 bg-white transition-all duration-200 focus:border-primary focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)] outline-none"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 bg-transparent border-none text-slate-400 p-1 flex items-center justify-center transition-colors duration-200 hover:text-gray-800"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer text-slate-500 select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="hidden"
                  />
                  <span className="w-4 h-4 border border-gray-200 rounded bg-white flex-shrink-0 relative transition-all duration-200 checked:bg-primary checked:border-primary">
                    <svg className="w-3 h-3 text-white absolute top-[2px] left-[2px] hidden checkmark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </span>
                  Remember me
                </label>
                <Link to="/forgot-password" className="text-primary font-medium transition-colors duration-200 hover:text-primary-dark">Forgot password?</Link>
              </div>

              <button type="submit" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-white text-sm font-semibold rounded-lg border-none cursor-pointer transition-all duration-200 w-full hover:bg-primary-dark hover:-translate-y-0.5 hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed" disabled={isLoading}>
                {isLoading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <p className="text-center mt-6 text-sm text-slate-500">
              Don't have an account? <Link to="/signup" className="text-primary font-semibold transition-colors duration-200 hover:text-primary-dark hover:underline">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
