import mongoose, { Schema, Document } from 'mongoose';

export interface IReport extends Document {
    reportedBy: mongoose.Types.ObjectId;
    contentType: 'trailer' | 'comment';
    contentId: mongoose.Types.ObjectId;
    reason: 'inappropriate' | 'spam' | 'copyright' | 'harassment' | 'other';
    details?: string;
    status: 'pending' | 'reviewed' | 'dismissed' | 'actioned';
    reviewedBy?: mongoose.Types.ObjectId;
    reviewNotes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const ReportSchema = new Schema<IReport>(
    {
        reportedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        contentType: {
            type: String,
            enum: ['trailer', 'comment'],
            required: true,
        },
        contentId: {
            type: Schema.Types.ObjectId,
            required: true,
            refPath: 'contentType',
        },
        reason: {
            type: String,
            enum: ['inappropriate', 'spam', 'copyright', 'harassment', 'other'],
            required: true,
        },
        details: {
            type: String,
            maxlength: 500,
            trim: true,
        },
        status: {
            type: String,
            enum: ['pending', 'reviewed', 'dismissed', 'actioned'],
            default: 'pending',
        },
        reviewedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        reviewNotes: {
            type: String,
            maxlength: 1000,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

// Compound index to prevent duplicate reports from same user on same content
ReportSchema.index({ reportedBy: 1, contentId: 1 }, { unique: true });

// Index for querying reports by status
ReportSchema.index({ status: 1, createdAt: -1 });

// Index for querying reports by content
ReportSchema.index({ contentType: 1, contentId: 1 });

export const Report = mongoose.model<IReport>('Report', ReportSchema);
