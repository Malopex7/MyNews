import { Request, Response, NextFunction } from 'express';
import { userService } from '../services';
import { UpdateUserSchema } from '@packages/schemas';
import mongoose from 'mongoose';
import { Media, User } from '../models';

// Helper to format user response
const formatUserResponse = (user: any, includePrivate: boolean = true) => {
    const response: any = {
        id: user._id,
        username: user.username,
        name: user.name,
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
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };

    if (includePrivate) {
        response.email = user.email;
        response.role = user.role;
    }

    return response;
};

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

        res.json(formatUserResponse(user, true));
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

        res.json(formatUserResponse(user, true));
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
            items: users.map((user) => formatUserResponse(user, false)),
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
        if (id !== currentUserId && (req as any).user?.role !== 'admin') {
            res.status(403).json({ message: 'Forbidden' });
            return;
        }

        // Validate update data
        const parseResult = UpdateUserSchema.safeParse(req.body);
        if (!parseResult.success) {
            res.status(400).json({
                message: 'Validation failed',
                errors: parseResult.error.flatten().fieldErrors,
            });
            return;
        }

        const user = await userService.update(id, parseResult.data);

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.json(formatUserResponse(user, true));
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

// ============================================
// Public Profile
// ============================================

export const getPublicProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { username } = req.params;
        const user = await userService.getPublicProfile(username);

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.json(formatUserResponse(user, false));
    } catch (error) {
        next(error);
    }
};

// ============================================
// Follow Operations
// ============================================

export const followUser = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const followerId = (req as any).user?.userId;
        const { id: followingId } = req.params;

        // Check if target user exists
        const targetUser = await userService.findById(followingId);
        if (!targetUser) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const result = await userService.follow(followerId, followingId);

        if (result.alreadyFollowing) {
            res.status(409).json({ message: 'Already following this user' });
            return;
        }

        res.json({ success: true, message: 'Now following user' });
    } catch (error: any) {
        if (error.message === 'Cannot follow yourself') {
            res.status(400).json({ message: error.message });
            return;
        }
        next(error);
    }
};

export const unfollowUser = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const followerId = (req as any).user?.userId;
        const { id: followingId } = req.params;

        const result = await userService.unfollow(followerId, followingId);

        if (!result.wasFollowing) {
            res.status(404).json({ message: 'Was not following this user' });
            return;
        }

        res.json({ success: true, message: 'Unfollowed user' });
    } catch (error) {
        next(error);
    }
};

export const getFollowers = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;

        const { followers, total } = await userService.getFollowers(id, page, limit);

        res.json({
            items: followers.map((user) => formatUserResponse(user, false)),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        next(error);
    }
};

export const getFollowing = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;

        const { following, total } = await userService.getFollowing(id, page, limit);

        res.json({
            items: following.map((user) => formatUserResponse(user, false)),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        next(error);
    }
};

export const checkFollowing = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const followerId = (req as any).user?.userId;
        const { id: followingId } = req.params;

        const isFollowing = await userService.isFollowing(followerId, followingId);

        res.json({ isFollowing });
    } catch (error) {
        next(error);
    }
};

// ============================================
// Watchlist Operations
// ============================================

export const addToWatchlist = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = (req as any).user?.userId;
        const { mediaId } = req.params;

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(mediaId)) {
            res.status(400).json({ message: 'Invalid media ID format' });
            return;
        }

        // Check if media exists
        const media = await Media.findById(mediaId);
        if (!media) {
            res.status(404).json({ message: 'Media not found' });
            return;
        }

        // Use atomic update to avoid validation issues
        const result = await User.findByIdAndUpdate(
            userId,
            { $addToSet: { watchlist: new mongoose.Types.ObjectId(mediaId) } },
            { new: true }
        );

        if (!result) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.json({ success: true, message: 'Added to watchlist' });
    } catch (error) {
        next(error);
    }
};

export const removeFromWatchlist = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = (req as any).user?.userId;
        const { mediaId } = req.params;

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(mediaId)) {
            res.status(400).json({ message: 'Invalid media ID format' });
            return;
        }

        // Use atomic update to remove from watchlist
        const result = await User.findByIdAndUpdate(
            userId,
            { $pull: { watchlist: new mongoose.Types.ObjectId(mediaId) } },
            { new: true }
        );

        if (!result) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.json({ success: true, message: 'Removed from watchlist' });
    } catch (error) {
        next(error);
    }
};

export const getWatchlist = async (
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

        // Populate watchlist with media details
        await user.populate('watchlist');

        res.json({
            items: user.watchlist.map((media: any) => ({
                id: media._id,
                title: media.title,
                genre: media.genre,
                creativeType: media.creativeType,
                url: `/api/media/${media._id}`,
            })),
            total: user.watchlist.length,
        });
    } catch (error) {
        next(error);
    }
};

export const checkWatchlist = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = (req as any).user?.userId;
        const { mediaId } = req.params;

        const user = await userService.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const inWatchlist = user.watchlist.some((id: any) => id.toString() === mediaId);

        res.json({ inWatchlist });
    } catch (error) {
        next(error);
    }
};
