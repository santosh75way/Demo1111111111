import { Request, Response, NextFunction, RequestHandler } from "express";

export const notFoundHandler: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
};
