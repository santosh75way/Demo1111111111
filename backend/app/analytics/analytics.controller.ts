import { Request, Response } from 'express';
import { analyticsService } from './analytics.service';
import { successResponse, errorResponse } from '@/common/types/response.type';

export const getSurveyStats = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json(errorResponse('Unauthorized'));
            return;
        }

        const { surveyId } = req.params;
        const stats = await analyticsService.getSurveyStats(surveyId, req.user.userId);
        res.status(200).json(successResponse('Survey statistics retrieved', stats));
    } catch (error) {
        if (error instanceof Error) {
            if (error.message.includes('not found')) {
                res.status(404).json(errorResponse(error.message));
            } else {
                res.status(400).json(errorResponse(error.message));
            }
        } else {
            res.status(400).json(errorResponse('An unexpected error occurred'));
        }
    }
};

export const getSurveyResponses = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json(errorResponse('Unauthorized'));
            return;
        }

        const { surveyId } = req.params;
        const responses = await analyticsService.getSurveyResponses(surveyId, req.user.userId);
        res.status(200).json(successResponse('Survey responses retrieved', responses));
    } catch (error) {
        if (error instanceof Error) {
            if (error.message.includes('not found')) {
                res.status(404).json(errorResponse(error.message));
            } else {
                res.status(400).json(errorResponse(error.message));
            }
        } else {
            res.status(400).json(errorResponse('An unexpected error occurred'));
        }
    }
};

export const analyticsController = {
    getSurveyStats,
    getSurveyResponses,
};
