/* 
 * Property of 0.tk
 * Info Modal Component
 */

import React from 'react';
import { X, HelpCircle, ArrowRight } from 'lucide-react';

interface InfoModalProps {
  title: string;
  description: string;
  recommendation?: string;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ title, description, recommendation, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0f172a] border border-purple-500/30 w-full max-w-md rounded-2xl p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 border-b border-gray-800 pb-4">
          <div className="p-2 bg-purple-500/10 rounded-full">
            <HelpCircle className="w-6 h-6 text-purple-500" />
          </div>
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <button 
            onClick={onClose}
            className="mr-auto text-gray-500 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-gray-400 mb-2">وش فايدة هذا الخيار؟</h4>
            <p className="text-gray-300 leading-relaxed text-sm bg-[#1e293b] p-3 rounded-lg border border-gray-700">
              {description}
            </p>
          </div>

          {recommendation && (
            <div>
              <h4 className="text-sm font-semibold text-purple-400 mb-2">نصيحة / الإعداد الموصى به:</h4>
              <p className="text-gray-300 text-sm flex items-start gap-2">
                <span className="text-purple-500 mt-1">●</span>
                {recommendation}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8">
          <button 
            onClick={onClose}
            className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <span>فهمت</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};