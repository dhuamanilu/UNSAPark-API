import { Router } from 'express';
import { register , login } from '../controllers/authController';

const router = Router();

// Endpoint: POST /api/auth/register
router.post('/register', register);
// Endpoint: POST /api/auth/login
// Este es el que usa tu pantalla de "Login"
router.post('/login', login);
export default router;