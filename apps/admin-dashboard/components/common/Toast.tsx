'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useToast, Toast as ToastType } from '@/contexts/ToastContext';

const toastStyles = {
    success: {
        bg: 'bg-green-500/10 border-green-500/30',
        icon: 'text-green-400',
        text: 'text-green-300',
    },
    error: {
        bg: 'bg-red-500/10 border-red-500/30',
        icon: 'text-red-400',
        text: 'text-red-300',
    },
    warning: {
        bg: 'bg-amber-500/10 border-amber-500/30',
        icon: 'text-amber-400',
        text: 'text-amber-300',
    },
    info: {
        bg: 'bg-blue-500/10 border-blue-500/30',
        icon: 'text-blue-400',
        text: 'text-blue-300',
    },
};

const toastIcons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertTriangle,
    info: Info,
};

function ToastItem({ toast, onRemove }: { toast: ToastType; onRemove: () => void }) {
    const [isVisible, setIsVisible] = useState(false);
    const style = toastStyles[toast.type];
    const Icon = toastIcons[toast.type];

    useEffect(() => {
        // Trigger enter animation
        const timer = setTimeout(() => setIsVisible(true), 10);
        return () => clearTimeout(timer);
    }, []);

    const handleRemove = () => {
        setIsVisible(false);
        setTimeout(onRemove, 200); // Wait for exit animation
    };

    return (
        <div
            className={`
                flex items-center gap-3 px-4 py-3 rounded-lg border backdrop-blur-sm
                shadow-lg transition-all duration-200 ease-out
                ${style.bg}
                ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}
            `}
        >
            <Icon className={`w-5 h-5 flex-shrink-0 ${style.icon}`} />
            <p className={`flex-1 text-sm font-medium ${style.text}`}>{toast.message}</p>
            <button
                onClick={handleRemove}
                className="p-1 hover:bg-white/10 rounded transition-colors"
            >
                <X className={`w-4 h-4 ${style.icon}`} />
            </button>
        </div>
    );
}

export function ToastContainer() {
    const { toasts, removeToast } = useToast();

    if (toasts.length === 0) return null;

    return (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
            {toasts.map((toast) => (
                <ToastItem
                    key={toast.id}
                    toast={toast}
                    onRemove={() => removeToast(toast.id)}
                />
            ))}
        </div>
    );
}

export default ToastContainer;
