import { Prisma } from "@prisma/client";

// Augment Express.User so that Passport's req.user is typed as our Prisma User.
// @types/passport declares req.user as Express.User; we extend that interface
// here so TypeScript knows req.user has .id, .email, etc.
declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface User extends Prisma.UserGetPayload<object> {}
  }
}
