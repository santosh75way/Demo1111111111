import { Request, Response } from "express";
import { authService } from "@/auth/auth.service";
import { successResponse, errorResponse } from "@/common/types/response.type";

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, fullName, role } = req.body;

    const result = await authService.register(
      email,
      password,
      fullName,
      role,
    );

    res
      .status(201)
      .json(successResponse("User registered successfully", result));
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json(errorResponse(error.message));
    } else {
      res.status(400).json(errorResponse("An unexpected error occurred"));
    }
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const result = await authService.login(email, password);

    res.status(200).json(successResponse("Login successful", result));
  } catch (error) {
    if (error instanceof Error) {
      res.status(401).json(errorResponse(error.message));
    } else {
      res.status(401).json(errorResponse("An unexpected error occurred"));
    }
  }
};

export const changePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json(errorResponse("Unauthorized"));
      return;
    }

    const { oldPassword, newPassword } = req.body;

    const result = await authService.changePassword(
      req.user.userId,
      oldPassword,
      newPassword,
    );

    res.status(200).json(successResponse(result.message));
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json(errorResponse(error.message));
    } else {
      res.status(400).json(errorResponse("An unexpected error occurred"));
    }
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    const result = await authService.forgotPassword(email);

    res.status(200).json(
      successResponse(result.message, {
        resetToken: result.resetToken,
        resetLink: result.resetLink,
      }),
    );
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json(errorResponse(error.message));
    } else {
      res.status(400).json(errorResponse("An unexpected error occurred"));
    }
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, newPassword } = req.body;

    const result = await authService.resetPassword(token, newPassword);

    res.status(200).json(successResponse(result.message));
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json(errorResponse(error.message));
    } else {
      res.status(400).json(errorResponse("An unexpected error occurred"));
    }
  }
};

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json(errorResponse("Unauthorized"));
      return;
    }

    const profile = await authService.getUserProfile(req.user.userId);

    res.status(200).json(successResponse("Profile retrieved", profile));
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json(errorResponse(error.message));
    } else {
      res.status(400).json(errorResponse("An unexpected error occurred"));
    }
  }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json(errorResponse("Unauthorized"));
      return;
    }

    const { fullName } = req.body;

    const result = await authService.updateUserProfile(req.user.userId, {
      fullName,
    });

    res
      .status(200)
      .json(successResponse("Profile updated successfully", result));
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json(errorResponse(error.message));
    } else {
      res.status(400).json(errorResponse("An unexpected error occurred"));
    }
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    res.status(200).json(successResponse("Logged out successfully"));
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json(errorResponse(error.message));
    } else {
      res.status(400).json(errorResponse("An unexpected error occurred"));
    }
  }
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json(errorResponse("Refresh token is required"));
      return;
    }

    const result = await authService.refreshToken(refreshToken);

    res
      .status(200)
      .json(successResponse("Token refreshed successfully", result));
  } catch (error) {
    if (error instanceof Error) {
      res.status(401).json(errorResponse(error.message));
    } else {
      res.status(401).json(errorResponse("An unexpected error occurred"));
    }
  }
};

export const authController = {
  signup,
  login,
  changePassword,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
  logout,
  refreshToken,
};

