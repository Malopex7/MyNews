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
});

export type RegisterDTO = z.infer<typeof RegisterSchema>;

// Auth Response
export const AuthResponseSchema = z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
    user: z.object({
        id: z.string(),
        email: z.string().email(),
        name: z.string(),
        role: z.enum(['user', 'admin']),
        profileType: z.enum(['viewer', 'creator']).optional(),
    }),
});

export type AuthResponse = z.infer<typeof AuthResponseSchema>;

// Refresh Token Request
export const RefreshTokenSchema = z.object({
    refreshToken: z.string(),
});

export type RefreshTokenDTO = z.infer<typeof RefreshTokenSchema>;
