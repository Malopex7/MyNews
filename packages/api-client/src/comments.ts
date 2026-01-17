import { AxiosInstance } from 'axios';
import type {
    CreateCommentInput,
    UpdateCommentInput,
    CommentResponse,
    CommentsList,
} from '@packages/schemas';

export interface GetCommentsParams {
    type?: 'critique' | 'hype';
    sort?: 'recent' | 'oldest';
}

export const createCommentsApi = (client: AxiosInstance) => ({
    /**
     * Create a comment
     */
    createComment: async (data: CreateCommentInput): Promise<CommentResponse> => {
        const response = await client.post('/comments', data);
        return response.data;
    },

    /**
     * Get comments for a media item
     */
    getCommentsByMedia: async (
        mediaId: string,
        params?: GetCommentsParams
    ): Promise<CommentsList> => {
        const response = await client.get(`/comments/media/${mediaId}`, { params });
        return response.data;
    },

    /**
     * Update a comment
     */
    updateComment: async (commentId: string, data: UpdateCommentInput): Promise<CommentResponse> => {
        const response = await client.patch(`/comments/${commentId}`, data);
        return response.data;
    },

    /**
     * Delete a comment
     */
    deleteComment: async (commentId: string): Promise<void> => {
        await client.delete(`/comments/${commentId}`);
    },
});

export type CommentsApi = ReturnType<typeof createCommentsApi>;
