import { z } from 'zod';

export const CommentTypeSchema = z.enum(['critique', 'hype']);

export const CreateCommentSchema = z.object({
    mediaId: z.string(),
    text: z.string().min(1).max(500),
    type: CommentTypeSchema,
    parentCommentId: z.string().optional(),
});

export const UpdateCommentSchema = z.object({
    text: z.string().min(1).max(500),
});

export const CommentUserSchema = z.object({
    _id: z.string(),
    name: z.string(),
    email: z.string().email(),
    profile: z.object({
        avatar: z.string().optional(),
    }).optional(),
});

export const CommentResponseSchema = z.object({
    _id: z.string(),
    mediaId: z.string(),
    userId: z.union([z.string(), CommentUserSchema]), // Can be populated or not
    text: z.string(),
    type: CommentTypeSchema,
    parentCommentId: z.string().optional(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
});

export const CommentsListSchema = z.object({
    comments: z.array(CommentResponseSchema),
    total: z.number(),
});

// Type exports
export type CommentType = z.infer<typeof CommentTypeSchema>;
export type CreateCommentInput = z.infer<typeof CreateCommentSchema>;
export type UpdateCommentInput = z.infer<typeof UpdateCommentSchema>;
export type CommentUser = z.infer<typeof CommentUserSchema>;
export type CommentResponse = z.infer<typeof CommentResponseSchema>;
export type CommentsList = z.infer<typeof CommentsListSchema>;
