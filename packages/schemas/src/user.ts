import { z } from 'zod';

// Genres / Creative Focus Options (also defined in @packages/domain)
export const GENRES = [
    'action',
    'comedy',
    'drama',
    'sci-fi',
    'horror',
    'documentary',
    'thriller',
    'romance',
] as const;

// ============================================
// Profile Sub-Schema (nested in User)
// ============================================

export const UserProfileSchema = z.object({
    displayName: z.string().min(2).max(50),
    bio: z.string().max(160).default(''),
    avatarUrl: z.string().url().optional(),
    creativeFocus: z.array(z.enum(GENRES)).default([]),
    website: z.string().url().optional(),
});

export type UserProfile = z.infer<typeof UserProfileSchema>;

// ============================================
// Metrics Sub-Schema (nested in User)
// ============================================

export const UserMetricsSchema = z.object({
    followersCount: z.number().int().min(0).default(0),
    followingCount: z.number().int().min(0).default(0),
    totalLikesReceived: z.number().int().min(0).default(0),
});

export type UserMetrics = z.infer<typeof UserMetricsSchema>;

// ============================================
// Full User Schema (for API responses)
// ============================================

export const UserSchema = z.object({
    id: z.string(),
    username: z.string().min(3).max(30),
    email: z.string().email(),
    name: z.string().min(2).max(100),
    role: z.enum(['user', 'admin']).default('user'),
    profileType: z.enum(['viewer', 'creator']).optional(),
    profile: UserProfileSchema,
    metrics: UserMetricsSchema,
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
});

export type User = z.infer<typeof UserSchema>;

// ============================================
// Public User Schema (for public profiles, no email)
// ============================================

export const PublicUserSchema = z.object({
    id: z.string(),
    username: z.string(),
    name: z.string(),
    profileType: z.enum(['viewer', 'creator']).optional(),
    profile: UserProfileSchema,
    metrics: UserMetricsSchema,
    createdAt: z.string().datetime(),
});

export type PublicUser = z.infer<typeof PublicUserSchema>;

// ============================================
// Create User DTO
// ============================================

export const CreateUserSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    name: z.string().min(2, 'Name must be at least 2 characters').max(100),
    username: z.string()
        .min(3, 'Username must be at least 3 characters')
        .max(30, 'Username must be less than 30 characters')
        .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
});

export type CreateUserDTO = z.infer<typeof CreateUserSchema>;

// ============================================
// Update User DTO (for profile updates)
// ============================================

export const UpdateUserSchema = z.object({
    name: z.string().min(2).max(100).optional(),
    profileType: z.enum(['viewer', 'creator']).optional(),
    profile: z.object({
        displayName: z.string().min(2).max(50).optional(),
        bio: z.string().max(160).optional(),
        avatarUrl: z.string().url().nullable().optional(),
        creativeFocus: z.array(z.enum(GENRES)).optional(),
        website: z.string().url().nullable().optional(),
    }).optional(),
});

export type UpdateUserDTO = z.infer<typeof UpdateUserSchema>;

// ============================================
// Legacy exports for backward compatibility
// ============================================

export const CREATIVE_FOCUS_OPTIONS = GENRES;
export type CreativeFocus = (typeof GENRES)[number];
