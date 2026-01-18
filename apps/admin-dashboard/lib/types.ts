export interface UserProfile {
    displayName?: string;
    bio?: string;
    avatarUrl?: string;
    creativeFocus?: string[];
    website?: string;
}

export interface UserMetrics {
    followersCount: number;
    followingCount: number;
    totalLikesReceived: number;
}

export interface User {
    _id: string;
    id?: string;
    username?: string;
    name: string;
    email: string;
    role: string;
    profileType: string;
    avatar?: string;
    handle?: string;
    suspended?: boolean;
    profile?: UserProfile;
    metrics?: UserMetrics;
    createdAt?: string;
    updatedAt?: string;
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
    content?: any; // Populated by backend manually
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface UserActivity {
    type: 'upload' | 'comment' | 'report';
    description: string;
    createdAt: string;
}
