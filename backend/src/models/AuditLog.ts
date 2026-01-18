import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLog extends Document {
    adminId: mongoose.Types.ObjectId;
    action: string;
    targetType: 'media' | 'user' | 'comment' | 'report' | 'other';
    targetId?: mongoose.Types.ObjectId;
    details?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
    createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
    {
        adminId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        action: {
            type: String,
            required: true,
            index: true,
        },
        targetType: {
            type: String,
            enum: ['media', 'user', 'comment', 'report', 'other'],
            required: true,
            index: true,
        },
        targetId: {
            type: Schema.Types.ObjectId,
            index: true,
        },
        details: {
            type: Schema.Types.Mixed,
        },
        ipAddress: String,
        userAgent: String,
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
    }
);

// Index for chronological querying
AuditLogSchema.index({ createdAt: -1 });

export const AuditLog = mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
