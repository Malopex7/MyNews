'use client';

import { AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ErrorDisplayProps {
    title?: string;
    message: string;
    onRetry?: () => void;
    showBackButton?: boolean;
    className?: string;
}

export function ErrorDisplay({
    title = 'Something went wrong',
    message,
    onRetry,
    showBackButton = false,
    className = '',
}: ErrorDisplayProps) {
    const router = useRouter();

    return (
        <div
            className={`
                p-6 rounded-xl border border-red-500/20 bg-red-500/5
                flex flex-col items-center text-center gap-4
                ${className}
            `}
            role="alert"
        >
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>

            <div>
                <h3 className="text-lg font-semibold text-red-400 mb-1">{title}</h3>
                <p className="text-red-300/80 text-sm">{message}</p>
            </div>

            <div className="flex gap-3">
                {showBackButton && (
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg
                            bg-[#1c1c2e] border border-[#2d2d42]
                            text-gray-400 hover:text-white hover:bg-[#2d2d42]
                            transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Go Back
                    </button>
                )}

                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg
                            bg-red-500/10 border border-red-500/20
                            text-red-400 hover:bg-red-500/20
                            transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Try Again
                    </button>
                )}
            </div>
        </div>
    );
}

export default ErrorDisplay;
