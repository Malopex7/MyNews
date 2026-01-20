'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    // Determine the range of page numbers to display
    const getPageNumbers = () => {
        const pages = [];
        const maxPagesToShow = 5;

        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

        if (endPage - startPage < maxPagesToShow - 1) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        return pages;
    };

    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-between border-t border-[#2d2d42] bg-[#1c1c2e] px-4 py-3 sm:px-6 mt-4 rounded-xl border border-[#2d2d42]">
            <div className="flex flex-1 justify-between sm:hidden">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center rounded-lg border border-[#2d2d42] bg-[#1c1c2e] px-4 py-2 text-sm font-medium text-gray-300 hover:bg-[#2d2d42] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Previous
                </button>
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative ml-3 inline-flex items-center rounded-lg border border-[#2d2d42] bg-[#1c1c2e] px-4 py-2 text-sm font-medium text-gray-300 hover:bg-[#2d2d42] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next
                </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-gray-400">
                        Showing page <span className="font-medium text-white">{currentPage}</span> of{' '}
                        <span className="font-medium text-white">{totalPages}</span>
                    </p>
                </div>
                <div>
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                        <button
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-[#2d2d42] hover:bg-[#2d2d42] hover:text-white focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <span className="sr-only">Previous</span>
                            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                        </button>

                        {getPageNumbers().map(page => (
                            <button
                                key={page}
                                onClick={() => onPageChange(page)}
                                aria-current={currentPage === page ? 'page' : undefined}
                                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 focus:outline-offset-0 transition-colors
                                    ${currentPage === page
                                        ? 'bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                                        : 'text-gray-300 ring-1 ring-inset ring-[#2d2d42] hover:bg-[#2d2d42] hover:text-white'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-[#2d2d42] hover:bg-[#2d2d42] hover:text-white focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <span className="sr-only">Next</span>
                            <ChevronRight className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    );
}
