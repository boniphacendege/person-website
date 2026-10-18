import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  KeyRound,
  FileText,
  ChevronLeft,
  LogIn,
  UserPlus,
} from 'lucide-react';
import { AuthUser } from '../types';
import * as api from '../api';

export type AuthMode = 'login' | 'signup' | 'otp' | 'forgot' | 'reset_password' | 'terms' | 'privacy';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: AuthMode;
  onSuccess: (user: AuthUser, message: string) => void;
  language?: string;
  onShowToast?: (msg: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  onSuccess,
  language = 'English',
  onShowToast,
}) => {
  const isSwahili = language === 'Swahili';

  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [previousMode, setPreviousMode] = useState<AuthMode>('login');

  // Form inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // OTP inputs (6 individual digits)
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [otpSentCode, setOtpSentCode] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(60);
  const otpInputRefs = useRef<Array<HTMLInputElement | null>>([]);

  // States
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<string | null>(null);

  // Sync mode with initialMode when modal opens
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setErrorMessage(null);
      setSuccessInfo(null);
    }
  }, [isOpen, initialMode]);

  // Resend OTP countdown
  useEffect(() => {
    if ((mode === 'otp' || mode === 'reset_password') && resendCooldown > 0) {
      const timer = setInterval(() => {
        setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [mode, resendCooldown]);

  if (!isOpen) return null;

  // Password strength calculation
  const getPasswordStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
    return score; // 0 to 4
  };

  const pwdScore = getPasswordStrength(password);
  const strengthLabels = isSwahili
    ? ['Dhaifu sana', 'Dhaifu', 'Wastani', 'Nzuri', 'Imara sana']
    : ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = [
    'bg-rose-500',
    'bg-amber-500',
    'bg-yellow-500',
    'bg-emerald-500',
    'bg-[#ffd700]',
  ];

  // OTP Handlers
  const handleOtpChange = (index: number, val: string) => {
    const digit = val.slice(-1);
    if (digit && !/^\d+$/.test(digit)) return;

    const newDigits = [...otpDigits];
    newDigits[index] = digit;
    setOtpDigits(newDigits);

    // Auto focus next input
    if (digit && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtpDigits(digits);
      otpInputRefs.current[5]?.focus();
    }
  };

  const handleSwitchMode = (newMode: AuthMode) => {
    setErrorMessage(null);
    setSuccessInfo(null);
    setPreviousMode(mode);
    setMode(newMode);
  };

  // Sign in Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!email.trim()) {
      setErrorMessage(isSwahili ? 'Tafadhali weka anwani ya barua pepe.' : 'Please enter your email address.');
      return;
    }
    if (!password) {
      setErrorMessage(isSwahili ? 'Tafadhali weka nenosiri lako.' : 'Please enter your password.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.loginApi({
        email: email.trim(),
        password,
        rememberMe,
      });

      if (rememberMe) {
        localStorage.setItem('bn_auth_user', JSON.stringify(res.user));
        localStorage.setItem('bn_remember_me', 'true');
        if (res.token) localStorage.setItem('bn_token', res.token);
      } else {
        sessionStorage.setItem('bn_auth_user', JSON.stringify(res.user));
        localStorage.removeItem('bn_remember_me');
        if (res.token) sessionStorage.setItem('bn_token', res.token);
      }

      onSuccess(res.user, isSwahili ? `Karibu tena, ${res.user.name}!` : `Welcome back, ${res.user.name}!`);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || (isSwahili ? 'Imeshindwa kuingia.' : 'Login failed. Please check credentials.'));
    } finally {
      setIsLoading(false);
    }
  };

  // Sign Up Submit
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage(isSwahili ? 'Tafadhali weka jina lako kamili.' : 'Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage(isSwahili ? 'Tafadhali weka barua pepe halali.' : 'Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage(isSwahili ? 'Nenosiri lazima liwe na angalau herufi 6.' : 'Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage(isSwahili ? 'Nenosiri halilingani.' : 'Passwords do not match.');
      return;
    }
    if (!acceptTerms) {
      setErrorMessage(
        isSwahili
          ? 'Ni lazima ukubali Vigezo na Masharti pamoja na Sera ya Faragha.'
          : 'You must accept the Terms and Conditions and Privacy Policy.'
      );
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.registerApi({
        name: name.trim(),
        email: email.trim(),
        password,
        confirmPassword,
        acceptTerms,
        rememberMe,
      });

      setOtpSentCode(res.otpCode);
      setResendCooldown(60);
      setSuccessInfo(
        isSwahili
          ? `Nambari ya uthibitishaji ya OTP (tarakimu 6) imetumwa kwa ${email.trim()}`
          : `A 6-digit OTP verification code has been dispatched to ${email.trim()}`
      );
      setMode('otp');
    } catch (err: any) {
      setErrorMessage(err.message || (isSwahili ? 'Imeshindwa kusajili akaunti.' : 'Failed to register account.'));
    } finally {
      setIsLoading(false);
    }
  };

  // Verify OTP Submit
  const handleVerifyOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const code = otpDigits.join('');
    if (code.length < 6) {
      setErrorMessage(isSwahili ? 'Tafadhali weka tarakimu zote 6 za OTP.' : 'Please enter all 6 digits of the OTP.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.verifyOtpApi(email.trim(), code, rememberMe);

      if (rememberMe) {
        localStorage.setItem('bn_auth_user', JSON.stringify(res.user));
        localStorage.setItem('bn_remember_me', 'true');
        if (res.token) localStorage.setItem('bn_token', res.token);
      } else {
        sessionStorage.setItem('bn_auth_user', JSON.stringify(res.user));
        if (res.token) sessionStorage.setItem('bn_token', res.token);
      }

      onSuccess(res.user, isSwahili ? `Akaunti imethibitishwa! Karibu, ${res.user.name}.` : `Account verified! Welcome, ${res.user.name}.`);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || (isSwahili ? 'Nambari ya OTP si sahihi.' : 'Invalid OTP code. Try again.'));
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (resendCooldown > 0 || !email.trim()) return;
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await api.sendOtpApi(email.trim(), mode === 'forgot' || mode === 'reset_password' ? 'reset' : 'signup');
      setOtpSentCode(res.otpCode);
      setResendCooldown(60);
      setSuccessInfo(
        isSwahili
          ? `Nambari mpya ya OTP imetumwa kwa ${email.trim()}`
          : `A new OTP code has been sent to ${email.trim()}`
      );
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to resend OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  // Forgot Password Submit (Request OTP)
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!email.trim()) {
      setErrorMessage(isSwahili ? 'Tafadhali weka anwani yako ya barua pepe.' : 'Please enter your email address.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.sendOtpApi(email.trim(), 'reset');
      setOtpSentCode(res.otpCode);
      setResendCooldown(60);
      setSuccessInfo(
        isSwahili
          ? `Nambari ya kuweka upya nenosiri imetumwa kwa ${email.trim()}`
          : `Password reset OTP has been sent to ${email.trim()}`
      );
      setMode('reset_password');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to send reset code.');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset Password Submit
  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const code = otpDigits.join('');
    if (code.length < 6) {
      setErrorMessage(isSwahili ? 'Tafadhali weka tarakimu 6 za OTP.' : 'Please enter the 6-digit OTP code.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage(isSwahili ? 'Nenosiri jipya lazima liwe na herufi 6 au zaidi.' : 'New password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage(isSwahili ? 'Nenosiri halilingani.' : 'Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.resetPasswordApi({
        email: email.trim(),
        otp: code,
        newPassword: password,
      });

      localStorage.setItem('bn_auth_user', JSON.stringify(res.user));
      localStorage.setItem('bn_remember_me', 'true');
      if (res.token) localStorage.setItem('bn_token', res.token);

      onSuccess(res.user, isSwahili ? 'Nenosiri limebadilishwa kikamilifu!' : 'Password reset successfully! You are logged in.');
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to reset password.');
    } finally {
      setIsLoading(false);
    }
  };

  // Quick 1-Click Demo Login as Admin
  const handleDemoLogin = async () => {
    setEmail('boniphacejndege@gmail.com');
    setPassword('Password123!');
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await api.loginApi({
        email: 'boniphacejndege@gmail.com',
        password: 'Password123!',
        rememberMe: true,
      });

      localStorage.setItem('bn_auth_user', JSON.stringify(res.user));
      localStorage.setItem('bn_remember_me', 'true');
      if (res.token) localStorage.setItem('bn_token', res.token);

      onSuccess(res.user, isSwahili ? 'Umeingia kama Ev Dr. Boniphace J. Ndege (Msimamizi)!' : 'Signed in as Ev Dr. Boniphace J. Ndege (Admin)!');
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Demo sign in failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // Quick 1-Click Demo Login as Regular Member
  const handleDemoMemberLogin = async () => {
    setEmail('amani.test@example.com');
    setPassword('BrandNewPassword123!');
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await api.loginApi({
        email: 'amani.test@example.com',
        password: 'BrandNewPassword123!',
        rememberMe: true,
      });

      localStorage.setItem('bn_auth_user', JSON.stringify(res.user));
      localStorage.setItem('bn_remember_me', 'true');
      if (res.token) localStorage.setItem('bn_token', res.token);

      onSuccess(res.user, isSwahili ? 'Umeingia kama Amani Julius (Mwanachama / Member)!' : 'Signed in as Amani Julius (Member)!');
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Member demo sign in failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-white dark:bg-[#07190f] border border-emerald-950/15 dark:border-emerald-500/30 rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 max-h-[92vh] flex flex-col"
      >
        {/* Top gold accent line */}
        <div className="h-1 w-full bg-gradient-to-r from-emerald-600 via-[#ffd700] to-emerald-600" />

        {/* Modal Header */}
        <div className="p-5 sm:p-6 pb-3 flex items-start justify-between border-b border-emerald-950/10 dark:border-emerald-500/15">
          <div className="flex items-center gap-3">
            {(mode === 'terms' || mode === 'privacy' || mode === 'otp' || mode === 'forgot' || mode === 'reset_password') && (
              <button
                type="button"
                onClick={() => handleSwitchMode(previousMode || 'login')}
                className="p-1.5 rounded-xl border border-emerald-900/15 dark:border-emerald-500/25 hover:bg-emerald-500/10 text-slate-600 dark:text-emerald-200 transition-colors cursor-pointer"
                title="Go back"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}

            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#06331e] to-[#031d10] text-[#ffd700] border border-[#ffd700]/40 flex items-center justify-center font-black text-lg shadow-inner shrink-0">
              BN
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-emerald-50 font-editorial tracking-tight leading-snug">
                {mode === 'login' && (isSwahili ? 'Ingia Kwenye Akaunti' : 'Sign In to Your Account')}
                {mode === 'signup' && (isSwahili ? 'Fungua Akaunti Mpya' : 'Create Your Account')}
                {mode === 'otp' && (isSwahili ? 'Thibitisha Nambari ya OTP' : 'Verify One-Time Passcode')}
                {mode === 'forgot' && (isSwahili ? 'Umesahau Nenosiri?' : 'Forgot Password')}
                {mode === 'reset_password' && (isSwahili ? 'Weka Nenosiri Jipya' : 'Set New Password')}
                {mode === 'terms' && (isSwahili ? 'Vigezo na Masharti' : 'Terms & Conditions')}
                {mode === 'privacy' && (isSwahili ? 'Sera ya Faragha' : 'Privacy Policy')}
              </h2>
              <p className="text-xs text-slate-500 dark:text-emerald-300/70">
                {mode === 'login' && (isSwahili ? 'Fikia Global Shopping, vitabu na video zako.' : 'Access Global Shopping, books, and masterclasses.')}
                {mode === 'signup' && (isSwahili ? 'Jiunge na mfumo wa kidijitali wa Ev Dr. Boniphace J. Ndege.' : 'Join the Ev Dr. Boniphace J. Ndege creator ecosystem.')}
                {mode === 'otp' && (isSwahili ? 'Weka nambari ya siri ya tarakimu 6 uliyotumiwa.' : 'Enter the 6-digit code sent to your email.')}
                {mode === 'forgot' && (isSwahili ? 'Tutatuma OTP kwenye barua pepe yako.' : 'We will send a reset code to your registered email.')}
                {mode === 'reset_password' && (isSwahili ? 'Tengeneza nenosiri imara jipya.' : 'Create a strong, new secure password.')}
                {mode === 'terms' && (isSwahili ? 'Tafadhali soma makubaliano ya huduma.' : 'Please review our platform service agreement.')}
                {mode === 'privacy' && (isSwahili ? 'Jinsi tunavyolinda na kutumia data yako.' : 'How we safeguard and manage your data.')}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-emerald-950/40 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {/* Notifications / Errors */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-500/40 text-rose-700 dark:text-rose-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successInfo && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
              <span>{successInfo}</span>
            </div>
          )}

          {/* Test OTP Demo Banner */}
          {otpSentCode && (mode === 'otp' || mode === 'reset_password') && (
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-[#ffd700]/50 text-slate-800 dark:text-amber-100 text-xs flex items-center justify-between gap-2 shadow-xs">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-[#ffd700] shrink-0" />
                <span>
                  {isSwahili ? 'Nambari yako ya OTP (Demo):' : 'Your OTP verification code (Demo):'}{' '}
                  <strong className="font-mono text-sm tracking-widest text-[#ffd700] font-black">{otpSentCode}</strong>
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setOtpDigits(otpSentCode.split(''));
                  onShowToast?.(isSwahili ? 'OTP imejazwa kiotomatiki!' : 'OTP auto-filled!');
                }}
                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] cursor-pointer shrink-0"
              >
                {isSwahili ? 'Jaza kiotomatiki' : 'Auto-fill'}
              </button>
            </div>
          )}

          {/* ================= MODE: LOGIN ================= */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Quick Tab Switcher */}
              <div className="flex p-1 bg-slate-100 dark:bg-[#04120a] rounded-xl border border-emerald-950/10 dark:border-emerald-500/20 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => handleSwitchMode('login')}
                  className="flex-1 py-2 rounded-lg bg-white dark:bg-emerald-800 text-emerald-900 dark:text-[#ffd700] shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>{isSwahili ? 'Ingia' : 'Sign In'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSwitchMode('signup')}
                  className="flex-1 py-2 rounded-lg text-slate-500 dark:text-emerald-300 hover:text-slate-900 dark:hover:text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>{isSwahili ? 'Jisajili' : 'Create Account'}</span>
                </button>
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-emerald-200 mb-1.5">
                  {isSwahili ? 'Barua Pepe / Jina la Mtumiaji' : 'Email Address'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 dark:text-emerald-400/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="boniphacejndege@gmail.com"
                    className="w-full h-11 pl-10 pr-4 rounded-xl text-sm bg-slate-50 dark:bg-[#03150b] border border-emerald-950/10 dark:border-emerald-500/30 text-slate-900 dark:text-emerald-50 focus:outline-none focus:border-[#ffd700] focus:ring-1 focus:ring-[#ffd700] transition-all"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-emerald-200">
                    {isSwahili ? 'Nenosiri' : 'Password'}
                  </label>
                  <button
                    type="button"
                    onClick={() => handleSwitchMode('forgot')}
                    className="text-xs text-emerald-600 dark:text-[#ffd700] hover:underline font-semibold cursor-pointer"
                  >
                    {isSwahili ? 'Umesahau nenosiri?' : 'Forgot password?'}
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 dark:text-emerald-400/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-11 pl-10 pr-10 rounded-xl text-sm bg-slate-50 dark:bg-[#03150b] border border-emerald-950/10 dark:border-emerald-500/30 text-slate-900 dark:text-emerald-50 focus:outline-none focus:border-[#ffd700] focus:ring-1 focus:ring-[#ffd700] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-emerald-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 accent-emerald-600 cursor-pointer"
                  />
                  <span className="text-xs text-slate-600 dark:text-emerald-200 font-medium">
                    {isSwahili ? 'Nikumbuke kwenye kifaa hiki' : 'Remember me on this device'}
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-[#087a45] hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-sm shadow-lg shadow-emerald-950/20 border border-[#ffd700]/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>{isSwahili ? 'Ingia Sasa' : 'Sign In Now'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-200 dark:border-emerald-950/40" />
                <span className="shrink-0 px-3 text-[11px] text-slate-400 dark:text-emerald-400/60 font-medium uppercase tracking-wider">
                  {isSwahili ? 'Au Tumia Akaunti ya Majaribio' : 'Or Use Instant Demo Access'}
                </span>
                <div className="flex-grow border-t border-slate-200 dark:border-emerald-950/40" />
              </div>

              {/* 1-Click Instant Demo Login Buttons */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleDemoMemberLogin}
                  disabled={isLoading}
                  className="w-full h-11 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                >
                  <User className="w-4 h-4 text-emerald-200" />
                  <span>
                    {isSwahili ? 'Ingia kama Mwanachama / Member (Fungua Huduma Zote)' : '1-Click Sign In as Member (Unlock All Features)'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleDemoLogin}
                  disabled={isLoading}
                  className="w-full h-10 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#031d10] dark:hover:bg-[#062c19] text-slate-900 dark:text-emerald-100 border border-emerald-500/30 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#ffd700]" />
                  <span>
                    {isSwahili ? 'Ingia kama Msimamizi (Ev Dr. Boniphace J. Ndege - Admin)' : '1-Click Sign In as Admin (Ev Dr. Boniphace J. Ndege)'}
                  </span>
                </button>
              </div>
            </form>
          )}

          {/* ================= MODE: SIGNUP ================= */}
          {mode === 'signup' && (
            <form onSubmit={handleSignupSubmit} className="space-y-3.5">
              {/* Quick Tab Switcher */}
              <div className="flex p-1 bg-slate-100 dark:bg-[#04120a] rounded-xl border border-emerald-950/10 dark:border-emerald-500/20 text-xs font-bold mb-2">
                <button
                  type="button"
                  onClick={() => handleSwitchMode('login')}
                  className="flex-1 py-2 rounded-lg text-slate-500 dark:text-emerald-300 hover:text-slate-900 dark:hover:text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>{isSwahili ? 'Ingia' : 'Sign In'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSwitchMode('signup')}
                  className="flex-1 py-2 rounded-lg bg-white dark:bg-emerald-800 text-emerald-900 dark:text-[#ffd700] shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>{isSwahili ? 'Jisajili' : 'Create Account'}</span>
                </button>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-emerald-200 mb-1">
                  {isSwahili ? 'Jina Kamili' : 'Full Name'}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 dark:text-emerald-400/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ev Dr. Boniphace J. Ndege"
                    className="w-full h-10.5 pl-10 pr-4 rounded-xl text-sm bg-slate-50 dark:bg-[#03150b] border border-emerald-950/10 dark:border-emerald-500/30 text-slate-900 dark:text-emerald-50 focus:outline-none focus:border-[#ffd700] transition-all"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-emerald-200 mb-1">
                  {isSwahili ? 'Barua Pepe' : 'Email Address'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 dark:text-emerald-400/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full h-10.5 pl-10 pr-4 rounded-xl text-sm bg-slate-50 dark:bg-[#03150b] border border-emerald-950/10 dark:border-emerald-500/30 text-slate-900 dark:text-emerald-50 focus:outline-none focus:border-[#ffd700] transition-all"
                  />
                </div>
              </div>

              {/* Password with Strength Meter */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-emerald-200 mb-1">
                  {isSwahili ? 'Nenosiri' : 'Password'}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 dark:text-emerald-400/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-10.5 pl-10 pr-10 rounded-xl text-sm bg-slate-50 dark:bg-[#03150b] border border-emerald-950/10 dark:border-emerald-500/30 text-slate-900 dark:text-emerald-50 focus:outline-none focus:border-[#ffd700] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-emerald-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {password && (
                  <div className="mt-2 space-y-1">
                    <div className="flex gap-1 h-1 w-full bg-slate-200 dark:bg-emerald-950/60 rounded-full overflow-hidden">
                      {[1, 2, 3, 4].map((step) => (
                        <div
                          key={step}
                          className={`flex-1 transition-all duration-300 ${
                            pwdScore >= step ? strengthColors[pwdScore] : 'bg-transparent'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500 dark:text-emerald-300/70">
                      <span>{isSwahili ? 'Ubora wa nenosiri:' : 'Strength:'}</span>
                      <span className="font-bold text-slate-800 dark:text-emerald-100">
                        {strengthLabels[pwdScore]}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-emerald-200 mb-1">
                  {isSwahili ? 'Thibitisha Nenosiri' : 'Confirm Password'}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 dark:text-emerald-400/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-10.5 pl-10 pr-4 rounded-xl text-sm bg-slate-50 dark:bg-[#03150b] border border-emerald-950/10 dark:border-emerald-500/30 text-slate-900 dark:text-emerald-50 focus:outline-none focus:border-[#ffd700] transition-all"
                  />
                </div>
              </div>

              {/* Terms and Conditions & Privacy Policy Agreement Checkbox */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#04160c] border border-emerald-900/10 dark:border-emerald-500/20">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    required
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 accent-emerald-600 mt-0.5 cursor-pointer shrink-0"
                  />
                  <div className="text-xs text-slate-600 dark:text-emerald-200/90 leading-relaxed">
                    <span>{isSwahili ? 'Ninakubali ' : 'I agree to the '}</span>
                    <button
                      type="button"
                      onClick={() => handleSwitchMode('terms')}
                      className="text-emerald-600 dark:text-[#ffd700] font-bold hover:underline inline"
                    >
                      {isSwahili ? 'Vigezo na Masharti' : 'Terms & Conditions'}
                    </button>
                    <span>{isSwahili ? ' na ninakubali ' : ' and acknowledge the '}</span>
                    <button
                      type="button"
                      onClick={() => handleSwitchMode('privacy')}
                      className="text-emerald-600 dark:text-[#ffd700] font-bold hover:underline inline"
                    >
                      {isSwahili ? 'Sera ya Faragha' : 'Privacy Policy'}
                    </button>
                    <span>.</span>
                  </div>
                </label>
              </div>

              {/* Remember Me */}
              <label className="flex items-center gap-2 cursor-pointer select-none pt-0.5">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 accent-emerald-600 cursor-pointer"
                />
                <span className="text-xs text-slate-600 dark:text-emerald-200 font-medium">
                  {isSwahili ? 'Nikumbuke kwenye kifaa hiki' : 'Remember me on this device'}
                </span>
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-sm shadow-lg shadow-emerald-950/20 border border-[#ffd700]/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>{isSwahili ? 'Endelea na OTP' : 'Continue to OTP Verification'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* ================= MODE: OTP VERIFICATION ================= */}
          {mode === 'otp' && (
            <form onSubmit={handleVerifyOtpSubmit} className="space-y-5 text-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-[#ffd700] flex items-center justify-center mx-auto shadow-inner">
                <ShieldCheck className="w-7 h-7" />
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-emerald-50">
                  {isSwahili ? 'Weka Nambari ya OTP' : 'Enter 6-Digit Code'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-emerald-300/70 mt-1 max-w-xs mx-auto">
                  {isSwahili
                    ? `Tumetuma tarakimu 6 za usalama kwa barua pepe yako:`
                    : 'We sent a 6-digit one-time authentication code to:'}{' '}
                  <strong className="text-slate-800 dark:text-emerald-100 font-semibold">{email || 'your email'}</strong>
                </p>
              </div>

              {/* 6 Digit Input Boxes */}
              <div className="flex justify-center gap-2 sm:gap-3 py-2" onPaste={handleOtpPaste}>
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => {
                      otpInputRefs.current[idx] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-black font-mono rounded-xl bg-slate-50 dark:bg-[#03150b] border-2 border-emerald-950/15 dark:border-emerald-500/30 text-slate-900 dark:text-[#ffd700] focus:border-[#ffd700] focus:bg-white dark:focus:bg-[#042011] focus:outline-none transition-all shadow-inner"
                  />
                ))}
              </div>

              {/* Resend Timer & Button */}
              <div className="text-xs text-slate-500 dark:text-emerald-300/70">
                {resendCooldown > 0 ? (
                  <span>
                    {isSwahili ? 'Unaweza kutuma tena OTP baada ya' : 'Resend code available in'}{' '}
                    <strong className="text-emerald-600 dark:text-[#ffd700] font-mono">{resendCooldown}s</strong>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={isLoading}
                    className="text-emerald-600 dark:text-[#ffd700] font-bold hover:underline cursor-pointer"
                  >
                    {isSwahili ? 'Tuma tena nambari ya OTP' : 'Resend OTP Code'}
                  </button>
                )}
              </div>

              {/* Verify Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-[#087a45] hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-sm shadow-lg shadow-emerald-950/20 border border-[#ffd700]/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isSwahili ? 'Kamilisha Uthibitishaji' : 'Verify & Sign In'}</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* ================= MODE: FORGOT PASSWORD ================= */}
          {mode === 'forgot' && (
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div className="text-center pb-2">
                <div className="w-12 h-12 rounded-2xl bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] flex items-center justify-center mx-auto mb-2">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-emerald-50">
                  {isSwahili ? 'Weka Barua Pepe Yako' : 'Reset Your Password'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-emerald-300/70 mt-1 max-w-xs mx-auto">
                  {isSwahili
                    ? 'Weka barua pepe uliyojiandikisha nayo ili kupokea nambari ya OTP ya kubadilisha nenosiri.'
                    : 'Enter your registered email address and we will dispatch a verification OTP to verify your identity.'}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-emerald-200 mb-1">
                  {isSwahili ? 'Barua Pepe' : 'Email Address'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 dark:text-emerald-400/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full h-11 pl-10 pr-4 rounded-xl text-sm bg-slate-50 dark:bg-[#03150b] border border-emerald-950/10 dark:border-emerald-500/30 text-slate-900 dark:text-emerald-50 focus:outline-none focus:border-[#ffd700] transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>{isSwahili ? 'Tuma Nambari ya OTP' : 'Send Reset Code'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* ================= MODE: RESET PASSWORD ================= */}
          {mode === 'reset_password' && (
            <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
              <div className="text-center pb-1">
                <h3 className="text-sm font-bold text-slate-900 dark:text-emerald-50">
                  {isSwahili ? 'Weka Nenosiri Jipya' : 'Set New Password'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-emerald-300/70 mt-0.5">
                  {isSwahili ? 'Weka OTP na utengeneze nenosiri imara' : 'Enter the OTP received and define your new password'}
                </p>
              </div>

              {/* 6 Digit Input Boxes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-emerald-200 mb-1.5 text-center">
                  {isSwahili ? 'Nambari ya OTP (Tarakimu 6)' : '6-Digit OTP Code'}
                </label>
                <div className="flex justify-center gap-2" onPaste={handleOtpPaste}>
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => {
                        otpInputRefs.current[idx] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      className="w-10 h-12 text-center text-lg font-bold font-mono rounded-lg bg-slate-50 dark:bg-[#03150b] border border-emerald-950/15 dark:border-emerald-500/30 text-slate-900 dark:text-[#ffd700] focus:border-[#ffd700] focus:outline-none transition-all"
                    />
                  ))}
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-emerald-200 mb-1">
                  {isSwahili ? 'Nenosiri Jipya' : 'New Password'}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 dark:text-emerald-400/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-10.5 pl-10 pr-10 rounded-xl text-sm bg-slate-50 dark:bg-[#03150b] border border-emerald-950/10 dark:border-emerald-500/30 text-slate-900 dark:text-emerald-50 focus:outline-none focus:border-[#ffd700] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-emerald-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-emerald-200 mb-1">
                  {isSwahili ? 'Thibitisha Nenosiri Jipya' : 'Confirm New Password'}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 dark:text-emerald-400/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-10.5 pl-10 pr-4 rounded-xl text-sm bg-slate-50 dark:bg-[#03150b] border border-emerald-950/10 dark:border-emerald-500/30 text-slate-900 dark:text-emerald-50 focus:outline-none focus:border-[#ffd700] transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isSwahili ? 'Hifadhi Nenosiri na Uingie' : 'Save Password & Sign In'}</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* ================= MODE: TERMS AND CONDITIONS ================= */}
          {mode === 'terms' && (
            <div className="space-y-4 text-xs leading-relaxed text-slate-700 dark:text-emerald-100/90">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#04160c] border border-emerald-900/10 dark:border-emerald-500/20 max-h-72 overflow-y-auto space-y-3 font-sans pr-3">
                <h4 className="font-bold text-sm text-slate-900 dark:text-[#ffd700]">
                  1. {isSwahili ? 'Utangulizi na Makubaliano' : 'Acceptance of Terms'}
                </h4>
                <p>
                  {isSwahili
                    ? 'Kwa kufungua akaunti na kutumia huduma za Ev Dr. Boniphace J. Ndege (ikiwemo Global Shopping, Creator Studio, maduka na mabaraza ya kidijitali), unakubaliana kikamilifu kufuata masharti haya na sheria zote za Tanzania na kimataifa zinazosimamia miamala ya kielektroniki.'
                    : 'By registering an account and accessing services provided by Ev Dr. Boniphace J. Ndege (including Global Shopping marketplace, Creator Studio, publications, and digital masterclasses), you unconditionally accept and agree to abide by these Terms of Service.'}
                </p>

                <h4 className="font-bold text-sm text-slate-900 dark:text-[#ffd700]">
                  2. {isSwahili ? 'Global Shopping na Uuzaji wa Bidhaa' : 'Global Shopping & Commerce'}
                </h4>
                <p>
                  {isSwahili
                    ? 'Miamala yote ya bidhaa halisi na za kidijitali inalindwa kwa mfumo salama wa uthibitishaji. Wauzaji wote wanawajibika kuelezea hali sahihi ya bidhaa (Brand New, Refurbished, au Like New) na kuhakikisha wateja wanapokea stakabadhi rasmi.'
                    : 'All commercial transactions for physical and digital assets across Global Shopping are executed through authenticated channels. Sellers are accountable for accurate descriptions, condition labeling, and prompt order fulfillment.'}
                </p>

                <h4 className="font-bold text-sm text-slate-900 dark:text-[#ffd700]">
                  3. {isSwahili ? 'Haki Miliki na Maudhui ya Ev Dr. Boniphace J. Ndege' : 'Intellectual Property'}
                </h4>
                <p>
                  {isSwahili
                    ? 'Vitabu, video za mafunzo, sauti, makala za blogu na alama za nembo (BN) ni mali ya Ev Dr. Boniphace J. Ndege au wenye leseni husika. Hairuhusiwi kunakili au kusambaza maudhui kinyume cha sheria bila kibali cha maandishi.'
                    : 'All literature, books, masterclass video streams, audio recordings, and the BN brand identity are protected proprietary intellectual property of Ev Dr. Boniphace J. Ndege. Reproduction or redistribution without written authorization is strictly prohibited.'}
                </p>

                <h4 className="font-bold text-sm text-slate-900 dark:text-[#ffd700]">
                  4. {isSwahili ? 'Ulinzi wa Akaunti na Usalama wa OTP' : 'Account Security & One-Time Passcodes'}
                </h4>
                <p>
                  {isSwahili
                    ? 'Mtumiaji anawajibika kulinda nambari zake za siri (OTP) na nenosiri lake. Mfumo hautawahi kukuuliza kutoa nambari yako ya siri kwa njia ya simu au ujumbe usio rasmi.'
                    : 'You are solely responsible for keeping your login credentials, passwords, and 6-digit OTP codes confidential. Our system never solicits passcodes over unauthenticated external channels.'}
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setAcceptTerms(true);
                    handleSwitchMode(previousMode === 'signup' ? 'signup' : 'login');
                    onShowToast?.(isSwahili ? 'Vigezo na Masharti yamekubaliwa!' : 'Terms accepted!');
                  }}
                  className="flex-1 h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isSwahili ? 'Kubali na Uendelee' : 'Accept & Continue'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSwitchMode(previousMode === 'signup' ? 'signup' : 'login')}
                  className="px-4 h-11 rounded-xl border border-slate-300 dark:border-emerald-500/30 text-slate-700 dark:text-emerald-100 font-bold text-xs hover:bg-slate-100 dark:hover:bg-emerald-950/40 transition-colors cursor-pointer"
                >
                  {isSwahili ? 'Rudi' : 'Back'}
                </button>
              </div>
            </div>
          )}

          {/* ================= MODE: PRIVACY POLICY ================= */}
          {mode === 'privacy' && (
            <div className="space-y-4 text-xs leading-relaxed text-slate-700 dark:text-emerald-100/90">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#04160c] border border-emerald-900/10 dark:border-emerald-500/20 max-h-72 overflow-y-auto space-y-3 font-sans pr-3">
                <h4 className="font-bold text-sm text-slate-900 dark:text-[#ffd700]">
                  1. {isSwahili ? 'Taarifa Tunazokusanya' : 'Information We Collect'}
                </h4>
                <p>
                  {isSwahili
                    ? 'Tunakusanya taarifa za msingi unazotoa wakati wa kusajili akaunti (jina, anwani ya barua pepe), historia ya ununuzi kwenye Global Shopping, na mapendekezo ya lugha na mandhari.'
                    : 'We collect essential profile data provided upon registration (such as name and email), transaction histories on Global Shopping, and client preferences (dark mode, language).'}
                </p>

                <h4 className="font-bold text-sm text-slate-900 dark:text-[#ffd700]">
                  2. {isSwahili ? 'Hifadhi ya Nje ya Mtandao (Cache API & Service Workers)' : 'Offline Data Storage (Cache API)'}
                </h4>
                <p>
                  {isSwahili
                    ? 'Ili kukuwezesha kusoma makala za blogu na sampuli za vitabu bila mtandao (offline), programu hii hutumia Cache API ya kivinjari chako kuhifadhi nakala salama za maudhui ya usomaji pekee.'
                    : 'To provide seamless offline reading for blog publications and book previews without active network connectivity, our application utilizes modern browser Cache API and Service Worker standards.'}
                </p>

                <h4 className="font-bold text-sm text-slate-900 dark:text-[#ffd700]">
                  3. {isSwahili ? 'Ulinzi wa Data na Faragha' : 'Data Protection & Encryption'}
                </h4>
                <p>
                  {isSwahili
                    ? 'Hatuuzi wala kugawa taarifa zako binafsi kwa mashirika ya matangazo. Data zote zinalindwa kwa viwango vya juu vya usalama (encryption in transit).'
                    : 'We do not sell or monetize personal customer records to third-party ad brokers. All transmission of authenticated requests is encrypted using modern protocols.'}
                </p>

                <h4 className="font-bold text-sm text-slate-900 dark:text-[#ffd700]">
                  4. {isSwahili ? 'Mawasiliano na Haki Zako' : 'Your Rights & Contact'}
                </h4>
                <p>
                  {isSwahili
                    ? 'Una haki ya kubadilisha taarifa zako, kupakua data yako, au kuomba kufutwa kwa akaunti yako wakati wowote kupitia boniphacejndege@gmail.com.'
                    : 'You maintain full rights to access, update, or request deletion of your account credentials and stored data anytime by reaching out to boniphacejndege@gmail.com.'}
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleSwitchMode(previousMode === 'signup' ? 'signup' : 'login')}
                  className="flex-1 h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isSwahili ? 'Nimeelewa' : 'Understood'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Note */}
        <div className="p-4 px-6 bg-slate-50 dark:bg-[#03150b] border-t border-emerald-950/10 dark:border-emerald-500/15 flex items-center justify-between text-[11px] text-slate-500 dark:text-emerald-300/70">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-[#ffd700]" />
            <span>{isSwahili ? 'Uthibitishaji Salama wa OTP & SSL' : '256-Bit SSL & OTP Protection'}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleSwitchMode('terms')}
              className="hover:text-emerald-600 dark:hover:text-[#ffd700] hover:underline cursor-pointer"
            >
              {isSwahili ? 'Vigezo' : 'Terms'}
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => handleSwitchMode('privacy')}
              className="hover:text-emerald-600 dark:hover:text-[#ffd700] hover:underline cursor-pointer"
            >
              {isSwahili ? 'Faragha' : 'Privacy'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
