import { z } from 'zod';

// User Schema
export const UserSchema = z.object({
    id: z.string(),
    email: z.string().email(),
    name: z.string().min(2).max(100),
    role: z.enum(['user', 'admin']).default('user'),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
});

export type User = z.infer<typeof UserSchema>;

// Create User DTO
export const CreateUserSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    name: z.string().min(2, 'Name must be at least 2 characters').max(100),
});

export type CreateUserDTO = z.infer<typeof CreateUserSchema>;

// Creative Focus Options
export const CREATIVE_FOCUS_OPTIONS = [
    'action',
    'comedy',
    'drama',
    'sci-fi',
    'horror',
    'documentary',
    'thriller',
    'romance',
] as const;

export type CreativeFocus = typeof CREATIVE_FOCUS_OPTIONS[number];

// Update User DTO
export const UpdateUserSchema = z.object({
    name: z.string().min(2).max(100).optional(),
    email: z.string().email().optional(),
    bio: z.string().max(160).optional(),
    avatarUrl: z.string().url().optional(),
    creativeFocus: z.enum(CREATIVE_FOCUS_OPTIONS).optional(),
    profileType: z.enum(['viewer', 'creator']).optional(),
});

export type UpdateUserDTO = z.infer<typeof UpdateUserSchema>;
