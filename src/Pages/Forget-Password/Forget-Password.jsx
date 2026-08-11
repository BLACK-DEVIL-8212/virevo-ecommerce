import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight } from 'lucide-react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebase';

function ForgetPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setIsSubmitted(true);
    } catch (err) {
      let message = 'Failed to send reset email. Please try again.';
      if (err.code === 'auth/user-not-found') {
        message = 'No account found with this email address.';
      } else if (err.code === 'auth/invalid-email') {
        message = 'Invalid email address.';
      }
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-[420px] bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="flex items-center justify-center gap-2.5 pt-8">
          <span className="w-9 h-9 bg-primary rounded-md flex items-center justify-center font-extrabold text-white text-lg">V</span>
          <span className="text-xl font-bold tracking-tight">Virevo</span>
        </div>

        <div className="p-8">
          {!isSubmitted ? (
            <>
              <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Forgot Password?</h2>
              <p className="text-sm text-slate-500 text-center leading-relaxed mb-7">
                No worries! Enter your email address and we'll send you a link to reset your password.
              </p>

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

                <button type="submit" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-white text-sm font-semibold rounded-lg border-none cursor-pointer transition-all duration-200 w-full hover:bg-primary-dark hover:-translate-y-0.5 hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed mt-1" disabled={isLoading}>
                  {isLoading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  ) : (
                    <>
                      Send Reset Link
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-2">
              <div className="w-16 h-16 bg-emerald-50 text-success rounded-full flex items-center justify-center mx-auto mb-5">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-3">Check Your Email</h2>
              <p className="text-sm text-slate-500 leading-relaxed mb-2">
                We've sent a password reset link to <strong className="text-gray-800">{email}</strong>. Please check your inbox and follow the instructions to reset your password.
              </p>
              <p className="text-xs text-slate-400">Didn't receive the email? Check your spam folder or try again.</p>
            </div>
          )}

          <div className="mt-8 text-center">
            <Link to="/login" className="inline-flex items-center gap-1.5 text-sm text-slate-500 font-medium transition-colors duration-200 hover:text-primary">
              <ArrowRight size={16} style={{ transform: 'rotate(180deg)' }} />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgetPassword;
