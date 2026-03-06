import prisma from "@/common/lib/prisma";
import { Role } from "@prisma/client";
import {
  hashPassword,
  comparePassword,
  generateResetToken,
} from "@/common/helpers/passwordUtils";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "@/common/helpers/tokenUtils";
import { TokenPayload } from "@/common/types/auth.type";
import { sanitizeEmail } from "@/common/helpers/validators";
import { sendResetEmail } from "@/common/helpers/email";

export const register = async (
  email: string,
  password: string,
  fullName: string,
  role: Role = Role.USER,
) => {
  const sanitizedEmail = sanitizeEmail(email);
  const existingUser = await prisma.user.findUnique({
    where: { email: sanitizedEmail },
  });

  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      email: sanitizedEmail,
      password: hashedPassword,
      fullName: fullName.trim(),
      role: role,
    },
  });

  const tokenPayload: TokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  return {
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    },
    accessToken,
    refreshToken,
  };
};

export const login = async (email: string, password: string) => {
  if (!password) {
    throw new Error("Password is required");
  }

  const sanitizedEmail = sanitizeEmail(email);
  const user = await prisma.user.findUnique({
    where: { email: sanitizedEmail },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLogin: new Date() },
  });

  const tokenPayload: TokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  return {
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    },
    accessToken,
    refreshToken,
  };
};

export const changePassword = async (
  userId: string,
  oldPassword: string,
  newPassword: string,
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordValid = await comparePassword(oldPassword, user.password);

  if (!isPasswordValid) {
    throw new Error("Current password is incorrect");
  }

  if (oldPassword === newPassword) {
    throw new Error("New password must be different from current password");
  }

  const hashedPassword = await hashPassword(newPassword);
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  return { message: "Password changed successfully" };
};

export const forgotPassword = async (email: string) => {
  const sanitizedEmail = sanitizeEmail(email);
  const user = await prisma.user.findUnique({
    where: { email: sanitizedEmail },
  });

  if (!user) {
    return {
      message: "If user exists, password reset link has been sent to email",
    };
  }

  const token = generateResetToken();
  const resetToken = await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      token,
      expiresAt: new Date(Date.now() + 1000 * 60 * 15),
    },
  });

  const resetLink = `http://localhost:8080/api/auth/reset-password/${resetToken.token}`;

  // Send the email
  await sendResetEmail(user.email, resetLink);

  return {
    message: "Password reset link has been sent to email",
    resetToken: resetToken.token,
    resetLink,
  };
};

export const resetPassword = async (token: string, newPassword: string) => {
  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token },
  });

  if (!resetToken) {
    throw new Error("Invalid or expired reset token");
  }

  if (resetToken.used) {
    throw new Error("This reset token has already been used");
  }

  if (resetToken.expiresAt < new Date()) {
    throw new Error("Reset token has expired");
  }

  const user = await prisma.user.findUnique({
    where: { id: resetToken.userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const hashedPassword = await hashPassword(newPassword);
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  });

  await prisma.passwordResetToken.update({
    where: { id: resetToken.id },
    data: { used: true },
  });

  return { message: "Password has been reset successfully" };
};

export const getUserProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return {
    id: user.id,
    email: user.email,
    role: user.role,
    fullName: user.fullName,
    createdAt: user.createdAt,
    lastLogin: user.lastLogin,
  };
};

export const updateUserProfile = async (
  userId: string,
  updates: { fullName?: string },
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      fullName: updates.fullName || user.fullName,
    },
  });

  return {
    id: updatedUser.id,
    email: updatedUser.email,
    fullName: updatedUser.fullName,
  };
};

export const refreshToken = async (token: string) => {
  const decoded = verifyRefreshToken(token);

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const tokenPayload: TokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateAccessToken(tokenPayload);
  const newRefreshToken = generateRefreshToken(tokenPayload);

  return {
    accessToken,
    refreshToken: newRefreshToken,
  };
};

export const authService = {
  register,
  login,
  changePassword,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updateUserProfile,
  refreshToken,
};
