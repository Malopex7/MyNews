export interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    profileType: string;
    avatar?: string;
    handle?: string;
}

export type ReportStatus = 'pending' | 'reviewed' | 'dismissed' | 'actioned';
export type ReportReason = 'inappropriate' | 'spam' | 'copyright' | 'harassment' | 'other';
export type ReportContentType = 'trailer' | 'comment';

export interface Report {
    _id: string;
    reportedBy: User | string; // Populated or ID
    contentType: ReportContentType;
    contentId: string;
    reason: ReportReason;
    details?: string;
    status: ReportStatus;
    reviewedBy?: User | string;
    reviewNotes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
