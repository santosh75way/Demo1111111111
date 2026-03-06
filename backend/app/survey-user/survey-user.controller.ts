import type { Request, Response, NextFunction } from 'express';
import { surveyUserService } from './survey-user.service';
import { surveyIdParamSchema, submitSurveyBodySchema } from './survey-user.schema';
import { successResponse } from '@/common/types/response.type';

// req.user is globally typed by the authenticate middleware as DecodedToken
// DecodedToken: { userId: string; email: string; role: string; iat: number; exp: number }

export const surveyUserController = {
  /**
   * GET /surveys/published
   * Returns all PUBLISHED surveys visible to the current user.
   */
  async getPublishedSurveys(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const surveys = await surveyUserService.getPublishedSurveys(userId);
      res.status(200).json(successResponse('Published surveys fetched successfully', surveys));
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /surveys/:surveyId/start
   * Returns survey details + ordered questions for a user to fill in.
   * 404 if not found / not published; 409 if already submitted.
   */
  async startSurvey(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { surveyId } = surveyIdParamSchema.parse(req.params);
      const userId = req.user!.userId;

      const survey = await surveyUserService.startSurvey(surveyId, userId);
      res.status(200).json(successResponse('Survey fetched successfully', survey));
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /surveys/:surveyId/submit
   * Submits answers, evaluates eligibility, persists response.
   * 404 if not found / not published; 409 if already submitted; 400 on validation failure.
   */
  async submitSurvey(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { surveyId } = surveyIdParamSchema.parse(req.params);
      const body = submitSurveyBodySchema.parse(req.body);
      const userId = req.user!.userId;

      const result = await surveyUserService.submitSurvey(surveyId, userId, body);
      res.status(201).json(successResponse('Survey submitted successfully', result));
    } catch (error) {
      next(error);
    }
  },
};
