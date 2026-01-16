import { AxiosInstance } from 'axios';

export interface FeedParams {
    page?: number;
    limit?: number;
    sort?: 'quality' | 'recency';
    creativeType?: 'Original' | 'Parody' | 'Remix';
    genre?: string;
}

export interface MediaMetrics {
    likes: number;
    comments: number;
    shares: number;
    views: number;
}

export interface FeedItem {
    id: string;
    type: 'video' | 'avatar' | 'thumbnail';
    url: string;
    metrics: MediaMetrics;
    title: string;
    description?: string;
    genre: string;
    creativeType: 'Original' | 'Parody' | 'Remix';
    creator: string;
    originalName: string;
}

export interface FeedResponse {
    items: FeedItem[];
    page: number;
    limit: number;
}

export interface CategoryFilter {
    creativeType?: string;
    genre?: string;
    sort?: 'quality' | 'recency';
}

export interface Category {
    id: string;
    name: string;
    filter: CategoryFilter;
}

export interface CategoriesResponse {
    categories: Category[];
}

export const createMediaApi = (client: AxiosInstance) => ({
    getFeed: async (params?: FeedParams): Promise<FeedResponse> => {
        const response = await client.get('/media/feed', { params });
        return response.data;
    },

    getCategories: async (): Promise<CategoriesResponse> => {
        const response = await client.get('/media/categories');
        return response.data;
    },
});

export type MediaApi = ReturnType<typeof createMediaApi>;
