import mongoose, { Schema, Document } from 'mongoose';

export type PollTemplateType = 'sequel' | 'cast' | 'rating' | 'custom';

export interface IPollOption {
    text: string;
    votes: number;
}

export interface IPoll extends Document {
    mediaId: mongoose.Types.ObjectId;
    creatorId: mongoose.Types.ObjectId;
    templateType: PollTemplateType;
    question: string;
    options: IPollOption[];
    totalVotes: number;
    expiresAt?: Date;
    createdAt: Date;
}

const PollSchema = new Schema<IPoll>(
    {
        mediaId: {
            type: Schema.Types.ObjectId,
            ref: 'Media',
            required: true,
            unique: true, // One poll per trailer
        },
        creatorId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        templateType: {
            type: String,
            enum: ['sequel', 'cast', 'rating', 'custom'],
            required: true,
        },
        question: {
            type: String,
            required: true,
            maxlength: 200,
        },
        options: [
            {
                text: { type: String, required: true, maxlength: 100 },
                votes: { type: Number, default: 0 },
            },
        ],
        totalVotes: {
            type: Number,
            default: 0,
        },
        expiresAt: {
            type: Date,
        },
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
    }
);

// Index for querying polls by media
PollSchema.index({ mediaId: 1 });

// Index for querying polls by creator
PollSchema.index({ creatorId: 1 });

export const Poll = mongoose.model<IPoll>('Poll', PollSchema);
