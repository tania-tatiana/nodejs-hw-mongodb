import express from 'express';
import {
  registerController,
  loginController,
  logoutController,
  refreshController,
} from '../controllers/auth.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { registerSchema, loginSchema } from '../validation/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
const router = express.Router();
router.post(
  '/register',
  validateBody(registerSchema),
  ctrlWrapper(registerController),
);

router.post('/login', validateBody(loginSchema), ctrlWrapper(loginController));
export default router;

router.post('/refresh', ctrlWrapper(refreshController));

router.post('/logout', ctrlWrapper(logoutController));
