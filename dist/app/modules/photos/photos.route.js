"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.photoRoutes = void 0;
const express_1 = __importDefault(require("express"));
const uploadImage_1 = require("../../middlewares/uploadImage");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const photos_controller_1 = require("./photos.controller");
const photos_validation_1 = require("./photos.validation");
const router = express_1.default.Router();
router.post('/', uploadImage_1.upload.single('image'), (0, validateRequest_1.default)(photos_validation_1.PhotoValidation.createPhotoZodSchema), photos_controller_1.PhotoController.createPhoto);
router.get('/', photos_controller_1.PhotoController.getAllPhotos);
router.get('/:id', photos_controller_1.PhotoController.getPhotoById);
router.patch('/:id', uploadImage_1.upload.single('image'), (0, validateRequest_1.default)(photos_validation_1.PhotoValidation.updatePhotoZodSchema), photos_controller_1.PhotoController.updatePhoto);
router.delete('/:id', photos_controller_1.PhotoController.deletePhoto);
exports.photoRoutes = router;
