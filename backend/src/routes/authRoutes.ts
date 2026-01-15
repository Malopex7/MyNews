import { Router } from 'express';
import { authController } from '../controllers';
import { authenticate } from '../middlewares';

const router = Router();

// POST /api/auth/register
router.post('/register', authController.register);

// POST /api/auth/login
router.post('/login', authController.login);

// POST /api/auth/refresh
router.post('/refresh', authController.refresh);

// POST /api/auth/logout (requires authentication)
router.post('/logout', authenticate, authController.logout);

export default router;
