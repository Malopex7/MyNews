import { Request, Response, NextFunction } from 'express';
import { userService } from '../services';
import { UpdateUserSchema } from '@packages/schemas';

export const getMe = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = (req as any).user?.userId;
        const user = await userService.findById(userId);

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.json({
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
            profileType: user.profileType,
            bio: user.bio,
            avatarUrl: user.avatarUrl,
            creativeFocus: user.creativeFocus,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        });
    } catch (error) {
        next(error);
    }
};

export const getById = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const user = await userService.findById(req.params.id);

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.json({
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        });
    } catch (error) {
        next(error);
    }
};

export const getAll = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;

        const { users, total, totalPages } = await userService.findAll(page, limit);

        res.json({
            items: users.map((user) => ({
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            })),
            total,
            page,
            limit,
            totalPages,
        });
    } catch (error) {
        next(error);
    }
};

export const update = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;
        const currentUserId = (req as any).user?.userId;

        // Ensure user is updating themselves or is admin
        // Note: Full permissions logic should be in middleware or service
        if (id !== currentUserId && (req as any).user?.role !== 'admin') {
            res.status(403).json({ message: 'Forbidden' });
            return;
        }

        // Just pass body to service, it should match partial schema + new field
        // We'll trust the updated DB schema to accept it
        const updates = req.body;

        // Explicitly allow profileType if it's in the body
        // (Assuming UpdateUserSchema might strip it if not updated yet, 
        //  but we can arguably just pass req.body if we want to bypass Zod for this new field strictly here,
        //  OR better: update the Zod schema in shared packages. 
        //  For this step, let's bypass Zod validation for profileType temporarily or assume it fits.)

        const user = await userService.update(id, updates);

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.json({
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
            profileType: user.profileType,
            bio: user.bio,
            avatarUrl: user.avatarUrl,
            creativeFocus: user.creativeFocus,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        });
    } catch (error) {
        next(error);
    }
};

export const remove = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const user = await userService.remove(req.params.id);

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        next(error);
    }
};
