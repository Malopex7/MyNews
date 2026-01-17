import mongoose, { Schema, Document } from 'mongoose';

export type CommentType = 'critique' | 'hype';

export interface IComment extends Document {
    mediaId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    text: string;
    type: CommentType;
    parentCommentId?: mongoose.Types.ObjectId; // For replies/threading
    createdAt: Date;
    updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
    {
        mediaId: {
            type: Schema.Types.ObjectId,
            ref: 'Media',
            required: true,
            index: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        text: {
            type: String,
            required: true,
            trim: true,
            minlength: 1,
            maxlength: 500,
        },
        type: {
            type: String,
            enum: ['critique', 'hype'],
            required: true,
        },
        parentCommentId: {
            type: Schema.Types.ObjectId,
            ref: 'Comment',
        },
    },
    {
        timestamps: true,
    }
);

// Compound index for efficient querying by media and type
CommentSchema.index({ mediaId: 1, type: 1, createdAt: -1 });

// Index for user's comments
CommentSchema.index({ userId: 1 });

export const Comment = mongoose.model<IComment>('Comment', CommentSchema);
