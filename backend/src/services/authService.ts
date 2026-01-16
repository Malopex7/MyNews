import jwt from 'jsonwebtoken';
import { config } from '../config';
import { User, IUser } from '../models';

export interface TokenPayload {
    userId: string;
    email: string;
    role: string;
}

export const generateAccessToken = (user: IUser): string => {
    return jwt.sign(
        { userId: user._id, email: user.email, role: user.role },
        config.jwt.secret,
        { expiresIn: '15m' }
    );
};

export const generateRefreshToken = (user: IUser): string => {
    return jwt.sign(
        { userId: user._id },
        config.jwt.refreshSecret,
        { expiresIn: '7d' }
    );
};

export const verifyAccessToken = (token: string): TokenPayload => {
    return jwt.verify(token, config.jwt.secret) as TokenPayload;
};

export const verifyRefreshToken = (token: string): { userId: string } => {
    return jwt.verify(token, config.jwt.refreshSecret) as { userId: string };
};

export const register = async (
    email: string,
    password: string,
    name: string,
    username?: string
): Promise<{ user: IUser; accessToken: string; refreshToken: string }> => {
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error('Email already registered');
    }

    // Generate username if not provided
    const finalUsername = username || email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '_');

    // Check if username already exists
    const existingUsername = await User.findOne({ username: finalUsername.toLowerCase() });
    if (existingUsername) {
        throw new Error('Username already taken');
    }

    // Create user with nested structure defaults
    const user = await User.create({
        email,
        password,
        name,
        username: finalUsername.toLowerCase(),
        profile: {
            displayName: name,
            bio: '',
            creativeFocus: [],
        },
        metrics: {
            followersCount: 0,
            followingCount: 0,
            totalLikesReceived: 0,
        },
    });

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Save refresh token
    user.refreshToken = refreshToken;
    await user.save();

    return { user, accessToken, refreshToken };
};

export const login = async (
    email: string,
    password: string
): Promise<{ user: IUser; accessToken: string; refreshToken: string }> => {
    // Find user with password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        throw new Error('Invalid email or password');
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        throw new Error('Invalid email or password');
    }

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Save refresh token (use update to avoid full document validation)
    await User.findByIdAndUpdate(user._id, { refreshToken });

    return { user, accessToken, refreshToken };
};

export const refreshTokens = async (
    refreshToken: string
): Promise<{ accessToken: string; refreshToken: string }> => {
    // Verify refresh token
    const payload = verifyRefreshToken(refreshToken);

    // Find user with refresh token
    const user = await User.findById(payload.userId).select('+refreshToken');
    if (!user || user.refreshToken !== refreshToken) {
        throw new Error('Invalid refresh token');
    }

    // Generate new tokens
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    // Save new refresh token (use update to avoid full document validation)
    await User.findByIdAndUpdate(user._id, { refreshToken: newRefreshToken });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

export const logout = async (userId: string): Promise<void> => {
    await User.findByIdAndUpdate(userId, { refreshToken: null });
};
