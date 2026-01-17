import mongoose, { Schema, Document } from 'mongoose';

export type MediaType = 'avatar' | 'video' | 'thumbnail';
export type ResponseType = 'full' | 'stitch';

export interface IStitchMetadata {
    originalClipStart: number; // seconds into original video
    originalClipEnd: number; // seconds
    userClipStart: number; // where user's clip begins in final video
}

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
    creativeType: 'Original' | 'Parody' | 'Remix' | 'Response';
    // Response linking
    respondingTo?: mongoose.Types.ObjectId;
    responseType?: ResponseType;
    stitchMetadata?: IStitchMetadata;
    pollId?: mongoose.Types.ObjectId; // Optional reference to poll
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
            enum: ['Original', 'Parody', 'Remix', 'Response'],
            default: 'Original',
        },
        // Response linking
        respondingTo: {
            type: Schema.Types.ObjectId,
            ref: 'Media',
        },
        responseType: {
            type: String,
            enum: ['full', 'stitch'],
        },
        stitchMetadata: {
            originalClipStart: Number,
            originalClipEnd: Number,
            userClipStart: Number,
        },
        pollId: {
            type: Schema.Types.ObjectId,
            ref: 'Poll',
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

// Index for response lookups
MediaSchema.index({ respondingTo: 1 });

export const Media = mongoose.model<IMedia>('Media', MediaSchema);
