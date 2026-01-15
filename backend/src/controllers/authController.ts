import { Request, Response, NextFunction } from 'express';
import { authService } from '../services';
import { RegisterSchema, LoginSchema, RefreshTokenSchema } from '@packages/schemas';

// Helper to format user response for auth
const formatAuthUserResponse = (user: any) => ({
    id: user._id,
    username: user.username,
    email: user.email,
    name: user.name,
    role: user.role,
    profileType: user.profileType,
    profile: {
        displayName: user.profile?.displayName || user.name,
        bio: user.profile?.bio || '',
        avatarUrl: user.profile?.avatarUrl,
        creativeFocus: user.profile?.creativeFocus || [],
        website: user.profile?.website,
    },
    metrics: {
        followersCount: user.metrics?.followersCount || 0,
        followingCount: user.metrics?.followingCount || 0,
        totalLikesReceived: user.metrics?.totalLikesReceived || 0,
    },
});

export const register = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const validatedData = RegisterSchema.parse(req.body);
        const { user, accessToken, refreshToken } = await authService.register(
            validatedData.email,
            validatedData.password,
            validatedData.name,
            (validatedData as any).username // Optional username
        );

        res.status(201).json({
            accessToken,
            refreshToken,
            user: formatAuthUserResponse(user),
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const validatedData = LoginSchema.parse(req.body);
        const { user, accessToken, refreshToken } = await authService.login(
            validatedData.email,
            validatedData.password
        );

        res.json({
            accessToken,
            refreshToken,
            user: formatAuthUserResponse(user),
        });
    } catch (error) {
        next(error);
    }
};

export const refresh = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const validatedData = RefreshTokenSchema.parse(req.body);
        const tokens = await authService.refreshTokens(validatedData.refreshToken);

        res.json(tokens);
    } catch (error) {
        next(error);
    }
};

export const logout = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = (req as any).user?.userId;
        if (userId) {
            await authService.logout(userId);
        }

        res.json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
        next(error);
    }
};
