import mongoose from 'mongoose';
import { Media, IMedia, MediaType } from '../models';
import {
    uploadToGridFS,
    downloadFromGridFS,
    downloadFromGridFSWithRange,
    deleteFromGridFS,
    getGridFSFileInfo,
} from '../utils/gridfs';

// File size limits in bytes
export const FILE_SIZE_LIMITS: Record<MediaType, number> = {
    avatar: 5 * 1024 * 1024,      // 5 MB
    video: 100 * 1024 * 1024,     // 100 MB
    thumbnail: 2 * 1024 * 1024,   // 2 MB
};

// Allowed MIME types
export const ALLOWED_MIME_TYPES: Record<MediaType, string[]> = {
    avatar: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    video: ['video/mp4', 'video/webm', 'video/quicktime'],
    thumbnail: ['image/jpeg', 'image/png', 'image/webp'],
};

export interface UploadOptions {
    type: MediaType;
    userId: string;
    metadata?: {
        width?: number;
        height?: number;
        duration?: number;
    };
}

/**
 * Upload a file and create a Media record
 */
export const upload = async (
    file: Express.Multer.File,
    options: UploadOptions
): Promise<IMedia> => {
    const { type, userId, metadata } = options;

    // Validate file size
    if (file.size > FILE_SIZE_LIMITS[type]) {
        throw new Error(`File too large. Maximum size for ${type} is ${FILE_SIZE_LIMITS[type] / (1024 * 1024)}MB`);
    }

    // Validate MIME type
    if (!ALLOWED_MIME_TYPES[type].includes(file.mimetype)) {
        throw new Error(`Invalid file type. Allowed types for ${type}: ${ALLOWED_MIME_TYPES[type].join(', ')}`);
    }

    // Generate unique filename
    const ext = file.originalname.split('.').pop();
    const filename = `${type}_${userId}_${Date.now()}.${ext}`;

    // Upload to GridFS
    const gridfsId = await uploadToGridFS(file.buffer, filename, {
        contentType: file.mimetype,
        metadata: {
            originalName: file.originalname,
            uploadedBy: userId,
            type,
        },
    });

    // Create Media record
    const media = await Media.create({
        filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        gridfsId,
        uploadedBy: new mongoose.Types.ObjectId(userId),
        type,
        metadata,
    });

    return media;
};

/**
 * Get media by ID
 */
export const getById = async (id: string): Promise<IMedia | null> => {
    return Media.findById(id);
};

/**
 * Get media stream for download
 */
export const getStream = (gridfsId: mongoose.Types.ObjectId) => {
    return downloadFromGridFS(gridfsId);
};

/**
 * Get media stream with range support for video
 */
export const getStreamWithRange = (
    gridfsId: mongoose.Types.ObjectId,
    start?: number,
    end?: number
) => {
    return downloadFromGridFSWithRange(gridfsId, start, end);
};

/**
 * Get GridFS file info
 */
export const getFileInfo = async (gridfsId: mongoose.Types.ObjectId) => {
    return getGridFSFileInfo(gridfsId);
};

/**
 * Delete media and its GridFS file
 */
export const remove = async (id: string, userId?: string): Promise<IMedia | null> => {
    const media = await Media.findById(id);

    if (!media) {
        return null;
    }

    // Check ownership if userId provided
    if (userId && media.uploadedBy.toString() !== userId) {
        throw new Error('Not authorized to delete this file');
    }

    // Delete from GridFS
    await deleteFromGridFS(media.gridfsId);

    // Delete Media record
    await Media.findByIdAndDelete(id);

    return media;
};

/**
 * Get all media by user
 */
export const getByUser = async (
    userId: string,
    type?: MediaType
): Promise<IMedia[]> => {
    const query: Record<string, any> = { uploadedBy: userId };
    if (type) query.type = type;
    return Media.find(query).sort({ createdAt: -1 });
};

/**
 * Get user's avatar
 */
export const getUserAvatar = async (userId: string): Promise<IMedia | null> => {
    return Media.findOne({
        uploadedBy: userId,
        type: 'avatar',
    }).sort({ createdAt: -1 });
};
