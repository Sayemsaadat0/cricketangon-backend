import express from 'express';
import { upload } from '../../middlewares/uploadImage';
import { UserController } from './user.controller';
const router = express.Router()

router.post('/',upload.single('image'),UserController.createUser);
router.get('/', UserController.getAllUsers);
router.get('/:id', UserController.getUserById);
router.patch('/:id',upload.single('image'), UserController.updateUser);
router.delete('/:id', UserController.deleteUser);

export const userRoutes = router

// auth(ENUM_USER_ROLE.ADMIN,ENUM_USER_ROLE.SUPER_ADMIN,ENUM_USER_ROLE.USER),