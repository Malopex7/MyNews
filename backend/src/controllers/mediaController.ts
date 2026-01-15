import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import mongoose from 'mongoose';
import * as mediaService from '../services/mediaService';
import { MediaType } from '../models';

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter
const fileFilter = (
    req: Express.Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
) => {
    // Accept images and videos
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image and video files are allowed'));
    }
};

// Multer upload middleware
export const uploadMiddleware = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024, // 100 MB max (will be validated per type in service)
    },
});

/**
 * Upload a file
 * POST /api/media/upload
 */
export const upload = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const file = req.file;
        const userId = (req as any).user?.userId;
        const type = req.body.type as MediaType;

        if (!file) {
            res.status(400).json({ message: 'No file provided' });
            return;
        }

        if (!type || !['avatar', 'video', 'thumbnail'].includes(type)) {
            res.status(400).json({ message: 'Invalid media type. Must be avatar, video, or thumbnail' });
            return;
        }

        const media = await mediaService.upload(file, {
            type,
            userId,
            metadata: req.body.metadata ? JSON.parse(req.body.metadata) : undefined,
        });

        res.status(201).json({
            id: media._id,
            filename: media.filename,
            originalName: media.originalName,
            mimeType: media.mimeType,
            size: media.size,
            type: media.type,
            url: `/api/media/${media._id}`,
            createdAt: media.createdAt,
        });
    } catch (error: any) {
        if (error.message.includes('File too large') || error.message.includes('Invalid file type')) {
            res.status(400).json({ message: error.message });
            return;
        }
        next(error);
    }
};

/**
 * Get/stream a file
 * GET /api/media/:id
 */
export const download = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;

        const media = await mediaService.getById(id);
        if (!media) {
            res.status(404).json({ message: 'Media not found' });
            return;
        }

        const fileInfo = await mediaService.getFileInfo(media.gridfsId);
        if (!fileInfo) {
            res.status(404).json({ message: 'File not found in storage' });
            return;
        }

        const fileSize = fileInfo.length;
        const range = req.headers.range;

        // Handle range requests for video streaming
        if (range && media.type === 'video') {
            const parts = range.replace(/bytes=/, '').split('-');
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
            const chunkSize = end - start + 1;

            res.writeHead(206, {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunkSize,
                'Content-Type': media.mimeType,
            });

            const stream = mediaService.getStreamWithRange(media.gridfsId, start, end);
            stream.pipe(res);
        } else {
            // Full file download
            res.set({
                'Content-Type': media.mimeType,
                'Content-Length': fileSize,
                'Content-Disposition': `inline; filename="${media.originalName}"`,
            });

            const stream = mediaService.getStream(media.gridfsId);
            stream.pipe(res);
        }
    } catch (error) {
        next(error);
    }
};

/**
 * Get media metadata
 * GET /api/media/:id/info
 */
export const getInfo = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;

        const media = await mediaService.getById(id);
        if (!media) {
            res.status(404).json({ message: 'Media not found' });
            return;
        }

        res.json({
            id: media._id,
            filename: media.filename,
            originalName: media.originalName,
            mimeType: media.mimeType,
            size: media.size,
            type: media.type,
            metadata: media.metadata,
            url: `/api/media/${media._id}`,
            createdAt: media.createdAt,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Delete a file
 * DELETE /api/media/:id
 */
export const remove = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = (req as any).user?.userId;
        const isAdmin = (req as any).user?.role === 'admin';

        const media = await mediaService.remove(id, isAdmin ? undefined : userId);

        if (!media) {
            res.status(404).json({ message: 'Media not found' });
            return;
        }

        res.json({ success: true, message: 'Media deleted successfully' });
    } catch (error: any) {
        if (error.message.includes('Not authorized')) {
            res.status(403).json({ message: error.message });
            return;
        }
        next(error);
    }
};

/**
 * Get user's media
 * GET /api/media/user/:userId
 */
export const getUserMedia = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { userId } = req.params;
        const type = req.query.type as MediaType | undefined;

        const mediaList = await mediaService.getByUser(userId, type);

        res.json({
            items: mediaList.map((media) => ({
                id: media._id,
                filename: media.filename,
                originalName: media.originalName,
                mimeType: media.mimeType,
                size: media.size,
                type: media.type,
                url: `/api/media/${media._id}`,
                createdAt: media.createdAt,
            })),
            total: mediaList.length,
        });
    } catch (error) {
        next(error);
    }
};
