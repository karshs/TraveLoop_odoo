// User routes — all protected
import { Router } from "express";
import multer from "multer";
import { getProfileHandler, updateProfileHandler, changePasswordHandler, uploadPhotoHandler, deleteAccountHandler } from "./user.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

router.use(authenticate);

router.get("/me", getProfileHandler);
router.patch("/me", updateProfileHandler);
router.patch("/me/password", changePasswordHandler);
router.post("/me/photo", upload.single("photo"), uploadPhotoHandler);
router.delete("/me", deleteAccountHandler);

export default router;
