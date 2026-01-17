import mongoose, { Schema, Document } from 'mongoose';

export interface IPollVote extends Document {
    pollId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    optionIndex: number;
    createdAt: Date;
}

const PollVoteSchema = new Schema<IPollVote>(
    {
        pollId: {
            type: Schema.Types.ObjectId,
            ref: 'Poll',
            required: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        optionIndex: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
    }
);

// Ensure one vote per user per poll
PollVoteSchema.index({ pollId: 1, userId: 1 }, { unique: true });

// Index for querying user's votes
PollVoteSchema.index({ userId: 1 });

export const PollVote = mongoose.model<IPollVote>('PollVote', PollVoteSchema);
