import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, loading, signup } = useAuth();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate('/shop', { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  const getPasswordStrength = (pwd) => {
    if (!pwd) return 0;
    let strength = 0;
    if (pwd.length >= 6) strength++;
    if (pwd.length >= 10) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(password);

  const getStrengthLabel = (strength) => {
    if (strength <= 1) return 'Weak';
    if (strength <= 3) return 'Fair';
    if (strength <= 4) return 'Good';
    return 'Strong';
  };

  const getStrengthColor = (strength) => {
    if (strength <= 1) return '#ef4444';
    if (strength <= 3) return '#f59e0b';
    if (strength <= 4) return '#10b981';
    return '#10b981';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (!termsAccepted) {
      setError('Please accept the terms and conditions');
      return;
    }

    setIsLoading(true);
    const result = await signup(name, email, password);
    setIsLoading(false);

    if (result.success) {
      navigate('/shop', { replace: true });
    } else {
      setError(result.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 max-w-[1100px] w-full min-h-[700px] bg-white rounded-xl shadow-lg overflow-hidden">
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
      <div className="grid grid-cols-1 md:grid-cols-2 max-w-[1100px] w-full min-h-[700px] bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white flex items-center justify-center p-16 relative overflow-hidden">
          <div className="relative z-10 max-w-[400px]">
            <div className="flex items-center gap-2.5 mb-10">
              <span className="w-10 h-10 bg-primary rounded-md flex items-center justify-center font-extrabold text-white text-lg">V</span>
              <span className="text-2xl font-bold tracking-tight">Virevo</span>
            </div>
            <h1 className="text-3xl font-bold mb-4 leading-tight">Join Virevo Today</h1>
            <p className="text-slate-400 text-sm leading-relaxed mb-8">Create an account and start exploring thousands of products at unbeatable prices.</p>
            <div className="flex flex-col gap-3.5">
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <span className="text-primary text-base">✦</span>
                <span>Personalized recommendations</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <span className="text-primary text-base">✦</span>
                <span>Exclusive member discounts</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <span className="text-primary text-base">✦</span>
                <span>Easy order tracking</span>
              </div>
            </div>
          </div>
          <div className="absolute -top-[50%] -right-[30%] w-[400px] h-[400px] bg-primary/30 rounded-full blur-3xl"></div>
        </div>

        <div className="flex items-center justify-center p-16 bg-white overflow-y-auto">
          <div className="w-full max-w-[380px]">
            <div className="mb-7">
              <h2 className="text-[26px] font-bold text-gray-800 mb-2">Create Account</h2>
              <p className="text-sm text-slate-500">Fill in your details to get started</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {error && <div className="bg-red-50 text-danger px-4 py-3 rounded-lg text-sm border border-red-200">{error}</div>}

              <div className="flex flex-col gap-1.5">
                <label htmlFor="name" className="text-xs font-medium text-gray-800">Full Name</label>
                <div className="relative flex items-center">
                  <User className="absolute left-3.5 text-slate-400 pointer-events-none" size={18} />
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-800 bg-white transition-all duration-200 focus:border-primary focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)] outline-none"
                    autoComplete="name"
                  />
                </div>
              </div>

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
                    placeholder="Create a password"
                    className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg text-sm text-gray-800 bg-white transition-all duration-200 focus:border-primary focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)] outline-none"
                    autoComplete="new-password"
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
                {password && (
                  <div className="flex items-center gap-2.5 mt-1.5">
                    <div className="flex gap-1 flex-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className="h-1 flex-1 rounded-sm transition-all duration-300"
                          style={{ background: level <= passwordStrength ? getStrengthColor(passwordStrength) : '#e2e8f0' }}
                        ></div>
                      ))}
                    </div>
                    <span className="text-xs font-semibold min-w-[40px] text-right" style={{ color: getStrengthColor(passwordStrength) }}>
                      {getStrengthLabel(passwordStrength)}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="confirmPassword" className="text-xs font-medium text-gray-800">Confirm Password</label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3.5 text-slate-400 pointer-events-none" size={18} />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg text-sm text-gray-800 bg-white transition-all duration-200 focus:border-primary focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)] outline-none"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 bg-transparent border-none text-slate-400 p-1 flex items-center justify-center transition-colors duration-200 hover:text-gray-800"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <label className="flex items-start gap-2 cursor-pointer text-sm text-slate-500 leading-relaxed">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="hidden"
                />
                <span className="w-4 h-4 border border-gray-200 rounded bg-white flex-shrink-0 relative mt-0.5 transition-all duration-200 checked:bg-primary checked:border-primary">
                  <svg className="w-3 h-3 text-white absolute top-[2px] left-[2px] hidden checkmark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </span>
                I agree to the <Link to="/terms" className="text-primary font-medium transition-colors duration-200 hover:text-primary-dark hover:underline">Terms & Conditions</Link> and <Link to="/privacy-policy" className="text-primary font-medium transition-colors duration-200 hover:text-primary-dark hover:underline">Privacy Policy</Link>
              </label>

              <button type="submit" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-white text-sm font-semibold rounded-lg border-none cursor-pointer transition-all duration-200 w-full hover:bg-primary-dark hover:-translate-y-0.5 hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed mt-1" disabled={isLoading}>
                {isLoading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <>
                    Create Account
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <p className="text-center mt-6 text-sm text-slate-500">
              Already have an account? <Link to="/login" className="text-primary font-semibold transition-colors duration-200 hover:text-primary-dark hover:underline">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
