import { Request, Response, NextFunction } from 'express';
import { authService } from '../services';
import { RegisterSchema, LoginSchema, RefreshTokenSchema } from '@packages/schemas';

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
            validatedData.name
        );

        res.status(201).json({
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
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
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
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
