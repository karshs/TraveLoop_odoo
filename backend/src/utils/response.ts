import { Response } from "express";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Array<{ field: string; message: string }>;
}

export function sendSuccess<T>(
  res: Response,
  data: T,
  message: string = "Success",
  status: number = 200,
): Response {
  return res.status(status).json({
    success: true,
    message,
    data,
  } as ApiResponse<T>);
}

export function sendError(
  res: Response,
  message: string,
  status: number = 400,
  errors?: Array<{ field: string; message: string }>,
): Response {
  return res.status(status).json({
    success: false,
    message,
    ...(errors && { errors }),
  } as ApiResponse<null>);
}
