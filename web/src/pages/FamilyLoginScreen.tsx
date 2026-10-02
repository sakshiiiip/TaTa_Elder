import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Lock, Mail, Phone, Eye, EyeOff, ShieldCheck, ArrowRight, UserCheck, Sparkles } from 'lucide-react';

interface FamilyLoginScreenProps {
  onLoginSuccess?: (role: 'FAMILY' | 'PARENT') => void;
}

export const FamilyLoginScreen: React.FC<FamilyLoginScreenProps> = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [role, setRole] = useState<'FAMILY' | 'PARENT'>('FAMILY');
  const [identifier, setIdentifier] = useState('rahul.sharma@example.com');
  const [password, setPassword] = useState('Sahaay@123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const completeLogin = (targetRole: 'FAMILY' | 'PARENT') => {
    if (onLoginSuccess) {
      onLoginSuccess(targetRole);
    }
    if (targetRole === 'FAMILY') {
      navigate('/family/overview');
    } else {
      navigate('/parent');
    }
  };

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!identifier.trim()) {
      setErrorMsg('Please enter your mobile number or email');
      return;
    }
    if (!password.trim()) {
      setErrorMsg('Please enter your password');
      return;
    }

    setErrorMsg(null);
    completeLogin(role);
  };

  const handleFillDemo = () => {
    setRole('FAMILY');
    setIdentifier('rahul.sharma@example.com');
    setPassword('Sahaay@123');
    setToastMsg('Demo credentials filled: Rahul Sharma (Son, Pune)');
    setTimeout(() => {
      setToastMsg(null);
      completeLogin('FAMILY');
    }, 600);
  };

  const handleFillParentDemo = () => {
    setRole('PARENT');
    setIdentifier('ashutosh.pandey@example.com');
    setPassword('Sahaay@123');
    setToastMsg('Demo credentials filled: Ashutosh Pandey (Parent, Mumbai)');
    setTimeout(() => {
      setToastMsg(null);
      completeLogin('PARENT');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-apple-canvas flex flex-col justify-center items-center px-4 py-8 sm:px-6 lg:px-8 font-sans animate-fade-in selection:bg-blue-100 selection:text-apple-blue">
      {/* Brand Icon */}
      <div className="w-full max-w-md text-center mb-6">
        <div className="w-16 h-16 rounded-3xl bg-apple-blue text-white mx-auto flex items-center justify-center shadow-apple-md shadow-blue-500/20 mb-3.5">
          <Heart className="w-8 h-8 fill-white" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-apple-text-primary tracking-tight">
          Welcome to Sahaay
        </h1>
        <p className="text-sm sm:text-base text-apple-text-secondary mt-1 font-medium">
          Stay connected with your loved ones.
        </p>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-apple-lg border border-apple-border p-6 sm:p-8 space-y-6">
        {toastMsg && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-900 text-xs font-semibold flex items-center gap-2 animate-fade-in">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Role Selector: Family Member vs Parent */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-apple-text-muted mb-2 block">
            Login as
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => {
                setRole('FAMILY');
                setIdentifier('rahul.sharma@example.com');
              }}
              className={`p-3 rounded-2xl border flex flex-col items-center justify-center text-center gap-1.5 transition-all cursor-pointer ${
                role === 'FAMILY'
                  ? 'border-apple-blue bg-blue-50 text-apple-blue font-bold shadow-sm ring-1 ring-apple-blue/20'
                  : 'border-apple-border bg-white text-apple-text-secondary hover:bg-gray-50'
              }`}
            >
              <span className="text-base">👨‍👩‍👧</span>
              <span className="text-xs sm:text-sm font-bold">Family Member</span>
              <span className="text-[10px] opacity-75">Child / Guardian</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setRole('PARENT');
                setIdentifier('ashutosh.pandey@example.com');
              }}
              className={`p-3 rounded-2xl border flex flex-col items-center justify-center text-center gap-1.5 transition-all cursor-pointer ${
                role === 'PARENT'
                  ? 'border-apple-blue bg-blue-50 text-apple-blue font-bold shadow-sm ring-1 ring-apple-blue/20'
                  : 'border-apple-border bg-white text-apple-text-secondary hover:bg-gray-50'
              }`}
            >
              <span className="text-base">👴</span>
              <span className="text-xs sm:text-sm font-bold">Parent</span>
              <span className="text-[10px] opacity-75">Senior User</span>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-apple-text-secondary mb-1.5 block">
              Mobile Number / Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-apple-text-muted">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="name@example.com or +91 98765 12345"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-apple-border rounded-2xl text-sm text-apple-text-primary outline-none focus:ring-2 focus:ring-apple-blue transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-apple-text-secondary block">
                Password
              </label>
              <button
                type="button"
                onClick={() => setToastMsg('Password reset link sent to demo registered email.')}
                className="text-xs text-apple-blue font-semibold hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-apple-text-muted">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-apple-border rounded-2xl text-sm text-apple-text-primary outline-none focus:ring-2 focus:ring-apple-blue transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-apple-text-muted hover:text-apple-text-primary"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {errorMsg && (
            <p className="text-xs text-red-600 font-semibold">{errorMsg}</p>
          )}

          <button
            type="submit"
            className="w-full py-3.5 bg-apple-blue hover:bg-apple-blue-dark text-white font-extrabold text-base rounded-2xl shadow-md shadow-blue-500/15 transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
          >
            <span>Login</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setToastMsg('Family Account creation portal will be opened for registration.')}
            className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-apple-text-primary font-bold text-xs sm:text-sm rounded-2xl transition-colors cursor-pointer"
          >
            Create Family Account
          </button>
        </form>

        {/* Demo Account Box */}
        <div className="pt-2 border-t border-apple-border">
          <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-2xl">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-extrabold text-apple-blue flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Demo Account
              </span>
              <span className="text-[11px] font-semibold text-apple-text-muted">1-Tap Testing</span>
            </div>
            <p className="text-xs text-apple-text-secondary leading-relaxed mb-2.5">
              Email: <code className="font-mono font-bold text-apple-text-primary">rahul.sharma@example.com</code><br />
              Password: <code className="font-mono font-bold text-apple-text-primary">Sahaay@123</code>
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleFillDemo}
                className="flex-1 py-2 bg-apple-blue text-white rounded-xl text-xs font-bold hover:bg-apple-blue-dark transition-colors shadow-sm cursor-pointer"
              >
                Login as Rahul (Child)
              </button>
              <button
                type="button"
                onClick={handleFillParentDemo}
                className="py-2 px-3 bg-white border border-apple-border text-apple-text-primary rounded-xl text-xs font-bold hover:bg-gray-100 transition-colors shadow-sm cursor-pointer"
              >
                My Sahaay (Parent)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer reassurance */}
      <div className="mt-6 text-center text-xs text-apple-text-muted">
        <span>Sahaay Senior Care Network • Bandra West, Mumbai & Pune Support</span>
      </div>
    </div>
  );
};
