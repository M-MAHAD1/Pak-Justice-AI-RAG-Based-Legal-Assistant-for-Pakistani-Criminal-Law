import express from 'express';
const router=express.Router();
import { register, login, googleLogin, logout } from '../controller/auth.js';
router.post('/register',register);
router.post('/login', login);
router.post('/google', googleLogin);
router.post('/logout', logout);
export default router;