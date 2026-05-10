import prisma from "../../config/prisma.js";
import { UpdateProfileInput, ChangePasswordInput } from "./user.validation.js";
import { comparePassword, hashPassword } from "../../utils/bcrypt.js";
import { v2 as cloudinary } from "cloudinary";

export async function getProfile(userId: string) {
  const user = await prisma.user.findFirst({
    where: { id: userId, is_deleted: false },
  });
  if (!user) throw new Error("User not found");

  const { password_hash, reset_token, reset_token_expiry, verify_token, ...safeUser } = user;
  return safeUser;
}

export async function updateProfile(userId: string, data: UpdateProfileInput) {
  const userExists = await prisma.user.findFirst({ where: { id: userId, is_deleted: false } });
  if (!userExists) throw new Error("User not found");

  const user = await prisma.user.update({
    where: { id: userId },
    data,
  });

  const { password_hash, reset_token, reset_token_expiry, verify_token, ...safeUser } = user;
  return safeUser;
}

export async function changePassword(userId: string, data: ChangePasswordInput) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");

  if (!user.password_hash) {
    throw new Error("Cannot change password for OAuth accounts");
  }

  const isMatch = await comparePassword(data.currentPassword, user.password_hash);
  if (!isMatch) throw new Error("Current password is incorrect");

  const newHash = await hashPassword(data.newPassword);

  await prisma.user.update({
    where: { id: userId },
    data: { password_hash: newHash },
  });

  return { message: "Password changed successfully" };
}

export async function uploadProfilePhoto(userId: string, fileBuffer: Buffer, mimetype: string) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "traveloop/avatars", resource_type: "image" },
      async (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error("Upload to Cloudinary failed"));

        try {
          const user = await prisma.user.update({
            where: { id: userId },
            data: { profile_photo_url: result.secure_url },
          });
          
          const { password_hash, reset_token, reset_token_expiry, verify_token, ...safeUser } = user;
          resolve(safeUser);
        } catch (err) {
          reject(err);
        }
      }
    );

    stream.end(fileBuffer);
  });
}

export async function deleteAccount(userId: string) {
  await prisma.user.update({
    where: { id: userId },
    data: { is_deleted: true },
  });
  return { message: "Account deleted" };
}
