import { AlertTriangle } from 'lucide-react';

interface ConfirmationModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    isDangerous?: boolean;
    isLoading?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export function ConfirmationModal({
    isOpen,
    title,
    message,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    isDangerous = false,
    isLoading = false,
    onConfirm,
    onCancel,
}: ConfirmationModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-[#1c1c2e] rounded-xl shadow-xl max-w-md w-full border border-[#2d2d42] overflow-hidden scale-100 animate-in zoom-in-95 duration-200">
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-2">
                        {isDangerous && <AlertTriangle className="w-6 h-6 text-red-500" />}
                        <h3 className="text-xl font-bold text-white">{title}</h3>
                    </div>
                    <p className="text-gray-400">
                        {message}
                    </p>
                </div>

                <div className="p-4 bg-[#13131f] border-t border-[#2d2d42] flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        disabled={isLoading}
                        className="px-4 py-2 rounded-lg text-gray-300 hover:bg-[#2d2d42] transition-colors font-medium disabled:opacity-50"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`px-4 py-2 rounded-lg text-white font-medium transition-colors flex items-center gap-2 disabled:opacity-50 ${isDangerous
                            ? 'bg-red-500 hover:bg-red-600'
                            : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                    >
                        {isLoading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
