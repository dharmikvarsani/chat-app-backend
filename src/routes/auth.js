import express from 'express';
import { checkAuth, login, logout, profileUpdate, signup } from '../controller/auth.js';
import { protectedRoute } from '../middleware/auth-middleware.js';
const authRouter = express.Router();


authRouter.post('/signup', signup)

authRouter.post('/login', login)

authRouter.post('/logout', logout)

authRouter.put('/profile-update', protectedRoute, profileUpdate)

authRouter.get('/check', protectedRoute, checkAuth)

export default authRouter;