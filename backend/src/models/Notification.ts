import mongoose, { Schema, Document } from 'mongoose';

export type NotificationType = 'like' | 'comment' | 'response';

export interface INotification extends Document {
    recipient: mongoose.Types.ObjectId; // User who receives the notification
    actor: mongoose.Types.ObjectId; // User who triggered the notification
    type: NotificationType;
    targetMedia: mongoose.Types.ObjectId; // The trailer involved
    targetComment?: mongoose.Types.ObjectId; // Optional: for comment notifications
    read: boolean;
    createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
    {
        recipient: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        actor: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        type: {
            type: String,
            enum: ['like', 'comment', 'response'],
            required: true,
        },
        targetMedia: {
            type: Schema.Types.ObjectId,
            ref: 'Media',
            required: true,
        },
        targetComment: {
            type: Schema.Types.ObjectId,
            ref: 'Comment',
        },
        read: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Compound index for efficient queries
NotificationSchema.index({ recipient: 1, read: 1, createdAt: -1 });
NotificationSchema.index({ recipient: 1, createdAt: -1 });

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);
