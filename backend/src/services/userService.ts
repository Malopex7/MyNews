import { User, IUser, Follow } from '../models';
import { UpdateUserDTO } from '@packages/schemas';

// ============================================
// Basic CRUD Operations
// ============================================

export const findById = async (id: string): Promise<IUser | null> => {
    return User.findById(id);
};

export const findByEmail = async (email: string): Promise<IUser | null> => {
    return User.findOne({ email });
};

export const findByUsername = async (username: string): Promise<IUser | null> => {
    return User.findOne({ username: username.toLowerCase() });
};

export const findAll = async (
    page: number = 1,
    limit: number = 20
): Promise<{ users: IUser[]; total: number; totalPages: number }> => {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
        User.find().skip(skip).limit(limit),
        User.countDocuments(),
    ]);

    return {
        users,
        total,
        totalPages: Math.ceil(total / limit),
    };
};

export const remove = async (id: string): Promise<IUser | null> => {
    return User.findByIdAndDelete(id);
};

// ============================================
// Profile Operations
// ============================================

export const update = async (
    id: string,
    data: UpdateUserDTO
): Promise<IUser | null> => {
    const updateData: Record<string, any> = {};

    // Handle top-level fields
    if (data.name) updateData.name = data.name;
    if (data.profileType) updateData.profileType = data.profileType;

    // Handle nested profile fields using dot notation
    if (data.profile) {
        if (data.profile.displayName !== undefined) {
            updateData['profile.displayName'] = data.profile.displayName;
        }
        if (data.profile.bio !== undefined) {
            updateData['profile.bio'] = data.profile.bio;
        }
        if (data.profile.avatarUrl !== undefined) {
            updateData['profile.avatarUrl'] = data.profile.avatarUrl;
        }
        if (data.profile.creativeFocus !== undefined) {
            updateData['profile.creativeFocus'] = data.profile.creativeFocus;
        }
        if (data.profile.website !== undefined) {
            updateData['profile.website'] = data.profile.website;
        }
    }

    return User.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
    );
};

export const getPublicProfile = async (username: string): Promise<IUser | null> => {
    return User.findOne({ username: username.toLowerCase() }).select(
        '-email -refreshToken -password'
    );
};

// ============================================
// Follow Operations
// ============================================

export const follow = async (
    followerId: string,
    followingId: string
): Promise<{ success: boolean; alreadyFollowing?: boolean }> => {
    // Prevent self-follow
    if (followerId === followingId) {
        throw new Error('Cannot follow yourself');
    }

    try {
        // Create follow relationship
        await Follow.create({ followerId, followingId });

        // Update metrics for both users
        await Promise.all([
            User.findByIdAndUpdate(followerId, { $inc: { 'metrics.followingCount': 1 } }),
            User.findByIdAndUpdate(followingId, { $inc: { 'metrics.followersCount': 1 } }),
        ]);

        return { success: true };
    } catch (error: any) {
        // Handle duplicate key error (already following)
        if (error.code === 11000) {
            return { success: false, alreadyFollowing: true };
        }
        throw error;
    }
};

export const unfollow = async (
    followerId: string,
    followingId: string
): Promise<{ success: boolean; wasFollowing: boolean }> => {
    const result = await Follow.findOneAndDelete({ followerId, followingId });

    if (result) {
        // Update metrics for both users
        await Promise.all([
            User.findByIdAndUpdate(followerId, { $inc: { 'metrics.followingCount': -1 } }),
            User.findByIdAndUpdate(followingId, { $inc: { 'metrics.followersCount': -1 } }),
        ]);
        return { success: true, wasFollowing: true };
    }

    return { success: true, wasFollowing: false };
};

export const isFollowing = async (
    followerId: string,
    followingId: string
): Promise<boolean> => {
    const follow = await Follow.findOne({ followerId, followingId });
    return !!follow;
};

export const getFollowers = async (
    userId: string,
    page: number = 1,
    limit: number = 20
): Promise<{ followers: IUser[]; total: number }> => {
    const skip = (page - 1) * limit;

    const [follows, total] = await Promise.all([
        Follow.find({ followingId: userId })
            .skip(skip)
            .limit(limit)
            .populate('followerId', '-email -password -refreshToken'),
        Follow.countDocuments({ followingId: userId }),
    ]);

    const followers = follows
        .map((f) => f.followerId as unknown as IUser)
        .filter(Boolean);

    return { followers, total };
};

export const getFollowing = async (
    userId: string,
    page: number = 1,
    limit: number = 20
): Promise<{ following: IUser[]; total: number }> => {
    const skip = (page - 1) * limit;

    const [follows, total] = await Promise.all([
        Follow.find({ followerId: userId })
            .skip(skip)
            .limit(limit)
            .populate('followingId', '-email -password -refreshToken'),
        Follow.countDocuments({ followerId: userId }),
    ]);

    const following = follows
        .map((f) => f.followingId as unknown as IUser)
        .filter(Boolean);

    return { following, total };
};

// ============================================
// Metrics Operations
// ============================================

export const incrementMetric = async (
    userId: string,
    metric: 'followersCount' | 'followingCount' | 'totalLikesReceived',
    amount: number = 1
): Promise<void> => {
    await User.findByIdAndUpdate(userId, {
        $inc: { [`metrics.${metric}`]: amount },
    });
};
