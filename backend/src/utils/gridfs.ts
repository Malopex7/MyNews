import mongoose from 'mongoose';
import { Readable } from 'stream';

let bucket: mongoose.mongo.GridFSBucket | null = null;

/**
 * Initialize GridFS bucket after MongoDB connection is established
 */
export const initGridFS = (): mongoose.mongo.GridFSBucket => {
    if (!bucket) {
        const db = mongoose.connection.db;
        if (!db) {
            throw new Error('MongoDB connection not established');
        }
        bucket = new mongoose.mongo.GridFSBucket(db, {
            bucketName: 'media',
        });
    }
    return bucket;
};

/**
 * Get the GridFS bucket instance
 */
export const getGridFSBucket = (): mongoose.mongo.GridFSBucket => {
    if (!bucket) {
        return initGridFS();
    }
    return bucket;
};

/**
 * Upload a file to GridFS
 */
export const uploadToGridFS = (
    fileBuffer: Buffer,
    filename: string,
    options?: {
        contentType?: string;
        metadata?: Record<string, any>;
    }
): Promise<mongoose.Types.ObjectId> => {
    return new Promise((resolve, reject) => {
        const gridfs = getGridFSBucket();
        const readableStream = Readable.from(fileBuffer);

        const uploadStream = gridfs.openUploadStream(filename, {
            contentType: options?.contentType,
            metadata: options?.metadata,
        });

        readableStream
            .pipe(uploadStream)
            .on('error', reject)
            .on('finish', () => {
                resolve(uploadStream.id as mongoose.Types.ObjectId);
            });
    });
};

/**
 * Download a file from GridFS as a stream
 */
export const downloadFromGridFS = (
    fileId: mongoose.Types.ObjectId
): mongoose.mongo.GridFSBucketReadStream => {
    const gridfs = getGridFSBucket();
    return gridfs.openDownloadStream(fileId);
};

/**
 * Download a file from GridFS with range support (for video streaming)
 */
export const downloadFromGridFSWithRange = (
    fileId: mongoose.Types.ObjectId,
    start?: number,
    end?: number
): mongoose.mongo.GridFSBucketReadStream => {
    const gridfs = getGridFSBucket();
    const options: { start?: number; end?: number } = {};

    if (start !== undefined) options.start = start;
    if (end !== undefined) options.end = end;

    return gridfs.openDownloadStream(fileId, options);
};

/**
 * Delete a file from GridFS
 */
export const deleteFromGridFS = async (
    fileId: mongoose.Types.ObjectId
): Promise<void> => {
    const gridfs = getGridFSBucket();
    await gridfs.delete(fileId);
};

/**
 * Get file info from GridFS
 */
export const getGridFSFileInfo = async (
    fileId: mongoose.Types.ObjectId
): Promise<mongoose.mongo.GridFSFile | null> => {
    const gridfs = getGridFSBucket();
    const files = await gridfs.find({ _id: fileId }).toArray();
    return files[0] || null;
};
