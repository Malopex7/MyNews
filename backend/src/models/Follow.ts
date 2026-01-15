import mongoose, { Schema, Document } from 'mongoose';

export interface IFollow extends Document {
    followerId: mongoose.Types.ObjectId;
    followingId: mongoose.Types.ObjectId;
    createdAt: Date;
}

const FollowSchema = new Schema<IFollow>(
    {
        followerId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        followingId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
    }
);

// Compound index to ensure unique follower-following pairs
FollowSchema.index({ followerId: 1, followingId: 1 }, { unique: true });

// Index for querying followers of a user
FollowSchema.index({ followingId: 1 });

// Index for querying who a user follows
FollowSchema.index({ followerId: 1 });

export const Follow = mongoose.model<IFollow>('Follow', FollowSchema);
