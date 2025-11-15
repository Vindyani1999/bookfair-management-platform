import { useState } from 'react';
import { X, LogOut, AlertTriangle } from 'lucide-react';

interface LogoutConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    userName?: string;
}

export default function LogoutConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    userName = 'User'
}: LogoutConfirmationModalProps) {
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleConfirmLogout = async () => {
        setIsLoggingOut(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        onConfirm();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 backdrop-blur-xs"
                onClick={!isLoggingOut ? onClose : undefined}
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
            />

            <div className="relative z-10 w-full max-w-md">
                <div
                    className="backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/30 animate-fade-in"
                    style={{
                        backgroundColor: 'rgba(218, 205, 201, 0.95)',
                    }}
                >
                    {!isLoggingOut && (
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-white hover:text-white/70 rounded-full p-1.5 transition-all duration-300 bg-gray-500! hover:bg-red-500/80!"
                            aria-label="Close modal"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}

                    <div className="flex items-center justify-center mb-6">
                        <div className="flex items-center justify-center w-16 h-16 bg-amber-50 rounded-full">
                            <AlertTriangle className="w-8 h-8 text-yellow-300" />
                        </div>
                    </div>

                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-slate-900 mb-3">
                            Are you sure you want to logout?
                        </h2>
                        <p className="text-slate-700 text-sm mb-2">
                            Hi <span className="font-semibold">{userName}</span>,
                        </p>
                        <p className="text-slate-600 text-sm">
                            You will be signed out of your account and redirected to the home page.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            disabled={isLoggingOut}
                            className="flex-1 px-6 py-3 bg-white/80! hover:bg-white! text-black rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border border-slate-300"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirmLogout}
                            disabled={isLoggingOut}
                            className="flex-1 px-6 py-3  bg-red-500/80! hover:bg-red-700! text-white rounded-lg font-semibold transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoggingOut ? (
                                <>
                                    <svg
                                        className="animate-spin h-5 w-5"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        />
                                    </svg>
                                    Logging out...
                                </>
                            ) : (
                                <>
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </>
                            )}
                        </button>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-300">
                        <p className="text-xs text-slate-600 text-center">
                            Your session data will be cleared from this device
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}