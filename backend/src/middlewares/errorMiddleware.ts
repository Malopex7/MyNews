import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { config } from '../config';

export interface AppError extends Error {
    statusCode?: number;
    isOperational?: boolean;
}

export const errorHandler = (
    err: AppError,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    // Default error values
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    // Handle Zod validation errors
    if (err instanceof ZodError) {
        statusCode = 400;
        const details = err.errors.reduce((acc, error) => {
            acc[error.path.join('.')] = error.message;
            return acc;
        }, {} as Record<string, string>);

        res.status(statusCode).json({
            message: 'Validation failed',
            code: 'VALIDATION_ERROR',
            details,
        });
        return;
    }

    // Handle MongoDB duplicate key error
    if ((err as any).code === 11000) {
        statusCode = 409;
        message = 'Duplicate entry';
    }

    // Handle MongoDB validation error
    if (err.name === 'ValidationError') {
        statusCode = 400;
    }

    // Handle JWT errors
    if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token';
    }

    if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token expired';
    }

    // Log error in development
    if (config.nodeEnv === 'development') {
        console.error('Error:', err);
    }

    res.status(statusCode).json({
        message,
        ...(config.nodeEnv === 'development' && { stack: err.stack }),
    });
};

// 404 handler
export const notFoundHandler = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    res.status(404).json({ message: 'Route not found' });
};
