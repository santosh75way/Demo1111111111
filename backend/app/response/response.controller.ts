import { Request, Response } from 'express';
import { responseService } from './response.service';
import { successResponse, errorResponse } from '@/common/types/response.type';
import { SubmitSurveyDTO } from './response.types';

export const submitSurvey = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json(errorResponse('Unauthorized'));
            return;
        }

        const { surveyId } = req.params;
        const data = req.body as SubmitSurveyDTO;

        const response = await responseService.submitResponse(surveyId, req.user.userId, data);
        res.status(201).json(successResponse('Survey submitted successfully', response));
    } catch (error) {
        if (error instanceof Error) {
            if (error.message.includes('not found')) {
                res.status(404).json(errorResponse(error.message));
            } else if (error.message.includes('already submitted')) {
                res.status(409).json(errorResponse(error.message));
            } else {
                res.status(400).json(errorResponse(error.message));
            }
        } else {
            res.status(400).json(errorResponse('An unexpected error occurred'));
        }
    }
};

export const responseController = {
    submitSurvey,
};
