import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';
const router = express.Router()

router.post('/', validateRequest(UserValidation.createUserZodSchema),UserController.createUser);
router.get('/', UserController.getAllUsers);
router.get('/:id', UserController.getUserById);
router.put('/:id',validateRequest(UserValidation.updateUserZodSchema), UserController.updateUser);
router.delete('/:id', UserController.deleteUser);

export const userRoutes = router

// auth(ENUM_USER_ROLE.ADMIN,ENUM_USER_ROLE.SUPER_ADMIN,ENUM_USER_ROLE.USER),