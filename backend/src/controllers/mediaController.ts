import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import mongoose from 'mongoose';
import * as mediaService from '../services/mediaService';
import { MediaType, Media } from '../models';

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
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Range',
                'Access-Control-Expose-Headers': 'Content-Length, Content-Range',
            });

            const stream = mediaService.getStreamWithRange(media.gridfsId, start, end);
            stream.pipe(res);
        } else {
            // Full file download
            res.set({
                'Content-Type': media.mimeType,
                'Content-Length': fileSize,
                'Content-Disposition': `inline; filename="${media.originalName}"`,
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Range',
                'Access-Control-Expose-Headers': 'Content-Length, Content-Range',
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
/**
 * Get video feed with sorting
 * GET /api/media/feed
 */
export const getFeed = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const sort = (req.query.sort as string) || 'quality';
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const creativeType = req.query.creativeType as string | undefined;
        const genre = req.query.genre as string | undefined;
        const skip = (page - 1) * limit;

        // Build match filter
        const matchFilter: any = { type: 'video' };
        if (creativeType) matchFilter.creativeType = creativeType;
        if (genre) matchFilter.genre = { $regex: genre, $options: 'i' };

        const pipeline: any[] = [
            { $match: matchFilter },
        ];

        // 2. Add Quality Score calculation if sort is 'quality'
        if (sort === 'quality') {
            pipeline.push({
                $addFields: {
                    qualityScore: {
                        $add: [
                            { $multiply: [{ $ifNull: ['$metrics.likes', 0] }, 2] },
                            { $multiply: [{ $ifNull: ['$metrics.comments', 0] }, 3] },
                            { $ifNull: ['$metrics.shares', 0] },
                        ],
                    },
                },
            });
            pipeline.push({ $sort: { qualityScore: -1, createdAt: -1 } });
        } else {
            // Default: Recency
            pipeline.push({ $sort: { createdAt: -1 } });
        }

        // 3. Pagination
        pipeline.push({ $skip: skip });
        pipeline.push({ $limit: limit });

        // 4. Lookup Creator (User)
        pipeline.push({
            $lookup: {
                from: 'users',
                localField: 'uploadedBy',
                foreignField: '_id',
                as: 'creatorData',
            },
        });
        pipeline.push({ $unwind: { path: '$creatorData', preserveNullAndEmptyArrays: true } });

        // 5. Projection
        pipeline.push({
            $project: {
                id: '$_id',
                filename: 1,
                originalName: 1,
                mimeType: 1,
                size: 1,
                type: 1,
                metadata: 1,
                metrics: 1,
                title: 1,
                description: 1,
                genre: 1,
                creativeType: 1,
                createdAt: 1,
                creator: { $ifNull: ['$creatorData.username', 'deleted_user'] }, // Fallback for missing users
                url: { $concat: ['/api/media/', { $toString: '$_id' }] },
                // Include score for debugging
                ...(sort === 'quality' ? { qualityScore: 1 } : {}),
            },
        });

        const items = await Media.aggregate(pipeline);

        res.json({
            items,
            page,
            limit,
        });
    } catch (error) {
        console.error('getFeed error:', error);
        next(error);
    }
};

/**
 * Get predefined categories
 * GET /api/media/categories
 */
export const getCategories = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const categories = [
            {
                id: 'top-parodies',
                name: 'Top Parodies',
                filter: { creativeType: 'Parody', sort: 'quality' },
            },
            {
                id: 'new-concepts',
                name: 'New Concepts',
                filter: { creativeType: 'Original', sort: 'recency' },
            },
            {
                id: 'sci-fi-thrillers',
                name: 'Sci-Fi Thrillers',
                filter: { genre: 'Sci-Fi', sort: 'quality' },
            },
        ];

        res.json({ categories });
    } catch (error) {
        next(error);
    }
};
