import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Media } from '../models';
import { uploadToGridFS } from '../utils/gridfs';

/**
 * Create trailer from base64 video data
 * POST /api/media/trailer
 */
export const createTrailer = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = (req as any).user?.userId;
        const {
            title,
            description,
            genre,
            creativeType, // 'Parody', 'Original', or 'Response'
            videoData, // base64 data URI
            startTime,
            endTime,
            // Response linking fields
            respondingTo,
            responseType, // 'full' or 'stitch'
            stitchMetadata,
        } = req.body;

        if (!title || !genre || !creativeType || !videoData) {
            res.status(400).json({ message: 'Missing required fields: title, genre, creativeType, videoData' });
            return;
        }

        // Validate response fields
        if (creativeType === 'Response') {
            if (!respondingTo) {
                res.status(400).json({ message: 'Response trailers must specify respondingTo' });
                return;
            }
            if (!responseType || !['full', 'stitch'].includes(responseType)) {
                res.status(400).json({ message: 'Response trailers must specify responseType: full or stitch' });
                return;
            }
            if (responseType === 'stitch' && !stitchMetadata) {
                res.status(400).json({ message: 'Stitch responses must include stitchMetadata' });
                return;
            }
        }

        // Extract base64 data from data URI
        const matches = videoData.match(/^data:(.+);base64,(.+)$/);
        if (!matches) {
            res.status(400).json({ message: 'Invalid video data format. Expected base64 data URI' });
            return;
        }

        const mimeType = matches[1];
        const base64Data = matches[2];
        const buffer = Buffer.from(base64Data, 'base64');

        // Validate file size (100 MB limit)
        if (buffer.length > 100 * 1024 * 1024) {
            res.status(400).json({ message: 'Video too large. Maximum size is 100MB' });
            return;
        }

        // Generate unique filename
        const filename = `trailer_${userId}_${Date.now()}.mp4`;

        // Upload to GridFS
        const gridfsId = await uploadToGridFS(buffer, filename, {
            contentType: mimeType,
            metadata: {
                originalName: `${title}.mp4`,
                uploadedBy: userId,
                type: 'video',
            },
        });

        // Calculate duration if provided
        const duration = endTime && startTime ? parseFloat(endTime) - parseFloat(startTime) : undefined;

        // Build media data
        const mediaData: any = {
            filename,
            originalName: `${title}.mp4`,
            mimeType,
            size: buffer.length,
            gridfsId,
            uploadedBy: new mongoose.Types.ObjectId(userId),
            type: 'video',
            title,
            description: description || '',
            genre,
            creativeType,
            metadata: {
                duration,
                startTime: startTime ? parseFloat(startTime) : undefined,
                endTime: endTime ? parseFloat(endTime) : undefined,
            },
            metrics: {
                views: 0,
                likes: 0,
                comments: 0,
                shares: 0,
            },
        };

        // Add response fields if applicable
        if (creativeType === 'Response' && respondingTo) {
            mediaData.respondingTo = new mongoose.Types.ObjectId(respondingTo);
            mediaData.responseType = responseType;
            if (responseType === 'stitch' && stitchMetadata) {
                mediaData.stitchMetadata = stitchMetadata;
            }
        }

        // Create Media record
        const media = await Media.create(mediaData);

        res.status(201).json({
            id: media._id,
            title: media.title,
            description: media.description,
            genre: media.genre,
            creativeType: media.creativeType,
            url: `/api/media/${media._id}`,
            createdAt: media.createdAt,
        });
    } catch (error: any) {
        console.error('Create trailer error:', error);
        next(error);
    }
};
