import { z } from 'zod';

// API Error Response
export const ApiErrorSchema = z.object({
    message: z.string(),
    code: z.string().optional(),
    details: z.record(z.string(), z.string()).optional(),
});

export type ApiError = z.infer<typeof ApiErrorSchema>;

// Pagination Request
export const PaginationSchema = z.object({
    page: z.number().int().positive().default(1),
    limit: z.number().int().positive().max(100).default(20),
});

export type PaginationDTO = z.infer<typeof PaginationSchema>;

// Paginated Response
export const PaginatedResponseSchema = <T extends z.ZodType>(itemSchema: T) =>
    z.object({
        items: z.array(itemSchema),
        total: z.number().int(),
        page: z.number().int(),
        limit: z.number().int(),
        totalPages: z.number().int(),
    });

export type PaginatedResponse<T> = {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
};

// Success Response
export const SuccessResponseSchema = z.object({
    success: z.boolean(),
    message: z.string().optional(),
});

export type SuccessResponse = z.infer<typeof SuccessResponseSchema>;
