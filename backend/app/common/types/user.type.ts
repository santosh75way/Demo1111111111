import { Role } from "@prisma/client";

export interface User {
  id: string;
  email: string;
  password: string;
  fullName: string;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  role: Role;
}

export interface ResetPasswordToken {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  used: boolean;
}
