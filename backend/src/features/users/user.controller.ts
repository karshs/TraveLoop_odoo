import { Request, Response } from "express";
import { getProfile, updateProfile, changePassword, uploadProfilePhoto, deleteAccount } from "./user.service.js";
import { updateProfileSchema, changePasswordSchema } from "./user.validation.js";
import { sendSuccess, sendError } from "../../utils/response.js";

export async function getProfileHandler(req: Request, res: Response) {
  try {
    const user = await getProfile(req.user!.id);
    sendSuccess(res, user, "Profile fetched");
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
}

export async function updateProfileHandler(req: Request, res: Response) {
  try {
    const data = updateProfileSchema.parse(req.body);
    const user = await updateProfile(req.user!.id, data);
    sendSuccess(res, user, "Profile updated");
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
}

export async function changePasswordHandler(req: Request, res: Response) {
  try {
    const data = changePasswordSchema.parse(req.body);
    const result = await changePassword(req.user!.id, data);
    sendSuccess(res, result, "Password changed");
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
}

export async function uploadPhotoHandler(req: Request, res: Response) {
  try {
    if (!req.file) {
      return sendError(res, "No file uploaded", 400);
    }
    const user = await uploadProfilePhoto(req.user!.id, req.file.buffer, req.file.mimetype);
    sendSuccess(res, user, "Photo uploaded");
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
}

export async function deleteAccountHandler(req: Request, res: Response) {
  try {
    await deleteAccount(req.user!.id);
    sendSuccess(res, null, "Account deleted");
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
}
