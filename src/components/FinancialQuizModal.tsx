import React from 'react';
import { X, HelpCircle } from 'lucide-react';

interface Props {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function FinancialQuizModal({ isOpen, onClose }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 relative shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 text-[#074504] font-black text-sm uppercase">
          <HelpCircle className="w-5 h-5 text-[#C0991B]" /> Financial Literacy Quiz
        </div>
        <p className="text-xs text-gray-600">
          Test your business budget and micro-credit management readiness.
        </p>
        <button onClick={onClose} className="w-full py-2.5 bg-[#074504] text-white text-xs font-bold rounded-xl">
          Start Quiz
        </button>
      </div>
    </div>
  );
}
