import { z } from 'zod';

// Login Request
export const LoginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

export type LoginDTO = z.infer<typeof LoginSchema>;

// Register Request
export const RegisterSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    name: z.string().min(2, 'Name must be at least 2 characters').max(100),
    username: z.string()
        .min(3, 'Username must be at least 3 characters')
        .max(30, 'Username must be less than 30 characters')
        .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
        .optional(),
});

export type RegisterDTO = z.infer<typeof RegisterSchema>;

// Auth Response
export const AuthResponseSchema = z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
    user: z.object({
        id: z.string(),
        username: z.string(),
        email: z.string().email(),
        name: z.string(),
        role: z.enum(['user', 'admin']),
        profileType: z.enum(['viewer', 'creator']).optional(),
        profile: z.object({
            displayName: z.string(),
            bio: z.string(),
            avatarUrl: z.string().optional(),
            creativeFocus: z.array(z.string()),
            website: z.string().optional(),
        }),
        metrics: z.object({
            followersCount: z.number(),
            followingCount: z.number(),
            totalLikesReceived: z.number(),
        }),
    }),
});

export type AuthResponse = z.infer<typeof AuthResponseSchema>;

// Refresh Token Request
export const RefreshTokenSchema = z.object({
    refreshToken: z.string(),
});

export type RefreshTokenDTO = z.infer<typeof RefreshTokenSchema>;
