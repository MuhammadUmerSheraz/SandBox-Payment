'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function PaymentProcessingContent() {
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const method = searchParams.get('method') || 'credit-card';
  const amount = searchParams.get('amount') || '0';
  const redirectUrl = searchParams.get('redirect_url') || '';

  const steps = [
    'Validating payment details...',
    'Connecting to bank...',
    'Processing transaction...',
    'Verifying payment...',
    'Finalizing transaction...'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          // Redirect to dynamic URL after processing
          setTimeout(() => {
            window.location.href = redirectUrl;
          }, 1000);
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= steps.length - 1) {
          clearInterval(stepInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 800);

    return () => {
      clearInterval(interval);
      clearInterval(stepInterval);
    };
  }, [redirectUrl, steps.length]);

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
          <p className="text-gray-600">Processing Your Payment</p>
          <div className="mt-2 text-sm text-gray-500">
            Amount: <span className="font-semibold text-gray-900">AED {amount}</span>
          </div>
        </div>

        {/* Processing Animation */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-4 relative">
            <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
            <div 
              className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"
              style={{ animationDuration: '1s' }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <p className="text-sm text-gray-600 mb-2">{progress}% Complete</p>
        </div>

        {/* Current Step */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-blue-600 rounded-full mr-3 animate-pulse"></div>
            <p className="text-gray-700 font-medium">{steps[currentStep]}</p>
          </div>
        </div>

        {/* Processing Steps */}
        <div className="space-y-3 mb-6">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                index <= currentStep ? 'bg-green-100' : 'bg-gray-100'
              }`}>
                {index < currentStep ? (
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : index === currentStep ? (
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                ) : (
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                )}
              </div>
              <p className={`text-sm ${
                index <= currentStep ? 'text-gray-700' : 'text-gray-400'
              }`}>
                {step}
              </p>
            </div>
          ))}
        </div>

        {/* Security Notice */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-green-600 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm text-green-800 font-medium">Secure Processing</p>
              <p className="text-xs text-green-700 mt-1">Your payment is being processed securely through our encrypted payment gateway</p>
            </div>
          </div>
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentProcessingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>}>
      <PaymentProcessingContent />
    </Suspense>
  );
}
