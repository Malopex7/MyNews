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

export interface UserReport {
    _id: string;
    reason: ReportReason;
    status: ReportStatus;
    contentType: ReportContentType;
    createdAt: string;
    type: 'filed' | 'against';
}

export interface AdminStats {
    users: {
        total: number;
        creators: number;
        viewers: number;
        suspended: number;
        newToday: number;
        newThisWeek: number;
        newThisMonth: number;
    };
    content: {
        total: number;
        newThisWeek: number;
        newThisMonth: number;
        totalViews: number;
        totalLikes: number;
        totalShares: number;
    };
    reports: {
        total: number;
        pending: number;
        reviewed: number;
        actioned: number;
        newThisWeek: number;
    };
    engagement: {
        totalComments: number;
        avgViewsPerContent: number;
        avgLikesPerContent: number;
    };
    generatedAt: string;
}

export interface UserAnalyticsDataPoint {
    date: string;
    count: number;
    creators: number;
    viewers: number;
}

export interface UserAnalytics {
    period: number;
    data: UserAnalyticsDataPoint[];
    summary: {
        totalNewUsers: number;
        totalNewCreators: number;
        totalNewViewers: number;
        averagePerDay: number;
    };
    generatedAt: string;
}

export interface ContentAnalyticsDataPoint {
    date: string;
    count: number;
    views: number;
    likes: number;
    original: number;
    parody: number;
    remix: number;
    response: number;
}

export interface ContentAnalytics {
    period: number;
    data: ContentAnalyticsDataPoint[];
    summary: {
        totalContent: number;
        totalViews: number;
        totalLikes: number;
        averagePerDay: number;
    };
    generatedAt: string;
}

export interface ReportAnalyticsDataPoint {
    date: string;
    count: number;
    pending: number;
    resolved: number;
}

export interface ReportReasonStat {
    _id: ReportReason;
    count: number;
}

export interface ReportStatusStat {
    _id: ReportStatus;
    count: number;
}

export interface ReportAnalytics {
    period: number;
    data: ReportAnalyticsDataPoint[];
    byReason: ReportReasonStat[];
    byStatus: ReportStatusStat[];
    summary: {
        totalReports: number;
        totalPending: number;
        totalResolved: number;
        resolutionRate: number;
        averagePerDay: number;
    };
    generatedAt: string;
}

export interface DashboardActivity {
    _id: string;
    type: 'user_register' | 'content_upload' | 'report_filed';
    description: string;
    metadata?: {
        userId?: string;
        username?: string;
        contentId?: string;
        contentType?: string;
        reportId?: string;
        reason?: string;
    };
    createdAt: string;
}
