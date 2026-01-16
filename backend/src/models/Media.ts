import mongoose, { Schema, Document } from 'mongoose';

export type MediaType = 'avatar' | 'video' | 'thumbnail';

export interface IMediaMetadata {
    width?: number;
    height?: number;
    duration?: number; // For videos, in seconds
}

export interface IMedia extends Document {
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    gridfsId: mongoose.Types.ObjectId;
    uploadedBy: mongoose.Types.ObjectId;
    type: MediaType;
    metadata?: IMediaMetadata;
    metrics: {
        views: number;
        likes: number;
        shares: number;
        comments: number;
    };
    title: string;
    description?: string;
    genre: string;
    creativeType: 'Original' | 'Parody' | 'Remix';
    createdAt: Date;
}

const MediaSchema = new Schema<IMedia>(
    {
        filename: {
            type: String,
            required: true,
        },
        originalName: {
            type: String,
            required: true,
        },
        mimeType: {
            type: String,
            required: true,
        },
        size: {
            type: Number,
            required: true,
        },
        gridfsId: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        uploadedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        type: {
            type: String,
            enum: ['avatar', 'video', 'thumbnail'],
            required: true,
        },
        metadata: {
            width: Number,
            height: Number,
            duration: Number,
        },
        metrics: {
            views: { type: Number, default: 0 },
            likes: { type: Number, default: 0 },
            shares: { type: Number, default: 0 },
            comments: { type: Number, default: 0 },
        },
        // Content Metadata
        title: { type: String, default: 'Untitled Trailer' },
        description: { type: String },
        genre: { type: String, default: 'General' },
        creativeType: {
            type: String,
            enum: ['Original', 'Parody', 'Remix'],
            default: 'Original',
        },
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
    }
);

// Index for querying by user and type
MediaSchema.index({ uploadedBy: 1, type: 1 });

// Index for GridFS reference
MediaSchema.index({ gridfsId: 1 });

export const Media = mongoose.model<IMedia>('Media', MediaSchema);
