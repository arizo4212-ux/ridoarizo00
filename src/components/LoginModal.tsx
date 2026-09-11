import React from 'react';
import { X } from 'lucide-react';
import { LoginFormView } from './LoginFormView';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onOpenDbConfig?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess,
  onOpenDbConfig 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl my-auto">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-20 p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/90 border border-slate-700 hover:bg-slate-700 transition-colors shadow-lg"
          title="Tutup Form Login"
        >
          <X className="w-5 h-5" />
        </button>

        <LoginFormView
          onSuccessLogin={() => {
            onSuccess();
            onClose();
          }}
          onOpenDbConfig={() => {
            if (onOpenDbConfig) {
              onOpenDbConfig();
            }
          }}
          isStandalonePage={false}
        />
      </div>
    </div>
  );
};
