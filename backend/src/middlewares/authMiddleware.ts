import { Request, Response, NextFunction } from 'express';
import { authService } from '../services';

export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader?.startsWith('Bearer ')) {
            res.status(401).json({ message: 'Authentication required' });
            return;
        }

        const token = authHeader.split(' ')[1];
        const payload = authService.verifyAccessToken(token);

        (req as any).user = payload;

        // Check if user is suspended
        const user = await import('../models').then(m => m.User.findById(payload.userId).select('suspended'));
        if (user?.suspended) {
            res.status(403).json({ message: 'Account suspended' });
            return;
        }

        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};

export const authorize = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const userRole = (req as any).user?.role;

        if (!roles.includes(userRole)) {
            res.status(403).json({ message: 'Access denied' });
            return;
        }

        next();
    };
};
