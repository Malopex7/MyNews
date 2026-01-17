import { Request, Response, NextFunction } from 'express';
import { Media } from '../models';

/**
 * Get all responses for a media item
 * GET /api/media/:id/responses
 */
export const getMediaResponses = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const skip = (page - 1) * limit;

        // Verify the original media exists
        const original = await Media.findById(id);
        if (!original) {
            res.status(404).json({ message: 'Media not found' });
            return;
        }

        // Find all responses
        const responses = await Media.find({ respondingTo: id })
            .populate('uploadedBy', 'username name')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await Media.countDocuments({ respondingTo: id });

        res.json({
            items: responses.map((media: any) => ({
                id: media._id,
                title: media.title,
                description: media.description,
                genre: media.genre,
                creativeType: media.creativeType,
                responseType: media.responseType,
                stitchMetadata: media.stitchMetadata,
                metrics: media.metrics,
                creator: media.uploadedBy?.username,
                url: `/api/media/${media._id}`,
                createdAt: media.createdAt,
            })),
            page,
            limit,
            total,
        });
    } catch (error) {
        next(error);
    }
};
