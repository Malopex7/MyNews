import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

// Profile sub-document interface
export interface IUserProfile {
    displayName: string;
    bio: string;
    avatarUrl?: string;
    creativeFocus: string[];
    website?: string;
}

// Metrics sub-document interface
export interface IUserMetrics {
    followersCount: number;
    followingCount: number;
    totalLikesReceived: number;
}

// Main User interface
export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    name: string;
    role: 'user' | 'admin';
    profileType?: 'viewer' | 'creator';
    profile: IUserProfile;
    metrics: IUserMetrics;
    watchlist: mongoose.Types.ObjectId[];
    refreshToken?: string;
    expoPushToken?: string;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
    suspended: boolean;
}

// Profile sub-schema
const ProfileSchema = new Schema<IUserProfile>(
    {
        displayName: {
            type: String,
            default: '',
            trim: true,
            minlength: 2,
            maxlength: 50,
        },
        bio: {
            type: String,
            default: '',
            maxlength: 160,
            trim: true,
        },
        avatarUrl: {
            type: String,
        },
        creativeFocus: {
            type: [String],
            enum: ['action', 'comedy', 'drama', 'sci-fi', 'horror', 'documentary', 'thriller', 'romance'],
            default: [],
        },
        website: {
            type: String,
        },
    },
    { _id: false }
);

// Metrics sub-schema
const MetricsSchema = new Schema<IUserMetrics>(
    {
        followersCount: {
            type: Number,
            default: 0,
            min: 0,
        },
        followingCount: {
            type: Number,
            default: 0,
            min: 0,
        },
        totalLikesReceived: {
            type: Number,
            default: 0,
            min: 0,
        },
    },
    { _id: false }
);

// Main User schema
const UserSchema = new Schema<IUser>(
    {
        username: {
            type: String,
            required: [true, 'Username is required'],
            unique: true,
            lowercase: true,
            trim: true,
            minlength: [3, 'Username must be at least 3 characters'],
            maxlength: [30, 'Username must be less than 30 characters'],
            match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [8, 'Password must be at least 8 characters'],
            select: false,
        },
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            minlength: [2, 'Name must be at least 2 characters'],
            maxlength: [100, 'Name must be less than 100 characters'],
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
        profileType: {
            type: String,
            enum: ['viewer', 'creator'],
        },
        profile: {
            type: ProfileSchema,
            default: () => ({}),
        },
        metrics: {
            type: MetricsSchema,
            default: () => ({}),
        },
        watchlist: {
            type: [{ type: Schema.Types.ObjectId, ref: 'Media' }],
            default: [],
        },
        suspended: {
            type: Boolean,
            default: false,
        },
        refreshToken: {
            type: String,
            select: false,
        },
        expoPushToken: {
            type: String,
            validate: {
                validator: function (v: string) {
                    if (!v) return true; // Optional field
                    return /^ExponentPushToken\[.+\]$/.test(v);
                },
                message: 'Invalid Expo push token format'
            },
        },
    },
    {
        timestamps: true,
    }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Set default displayName from name if not provided
UserSchema.pre('save', function (next) {
    if (!this.profile.displayName && this.name) {
        this.profile.displayName = this.name;
    }
    next();
});

// Compare password method
UserSchema.methods.comparePassword = async function (
    candidatePassword: string
): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>('User', UserSchema);
