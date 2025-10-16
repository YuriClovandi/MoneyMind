import { Router } from 'express';
import { userController } from '../controllers/userController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Todas as rotas de usuário precisam de autenticação
router.use(authenticateToken);

// Routes
router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);
router.put('/balance', userController.updateBalance);

export default router;
