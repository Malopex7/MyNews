import React from 'react';

interface ChartSkeletonProps {
    height?: string;
    borderColor?: string;
    spinnerColor?: string;
}

export const ChartSkeleton = ({
    height = 'h-[420px]',
    borderColor = 'border-[#2a2a4a]',
    spinnerColor = 'border-t-[#60A5FA]'
}: ChartSkeletonProps) => {
    return (
        <div className={`bg-[#0d0d14] border border-[#1a1a2e] rounded-2xl p-6 ${height} flex items-center justify-center w-full`}>
            <div className="relative">
                <div className={`w-12 h-12 rounded-full border-2 ${borderColor} ${spinnerColor} animate-spin`} />
            </div>
        </div>
    );
};
