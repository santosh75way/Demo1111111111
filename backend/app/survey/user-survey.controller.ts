import { Request, Response } from 'express';
import { surveyRepository } from './survey.repository';
import { successResponse, errorResponse } from '@/common/types/response.type';

export const listPublishedSurveys = async (req: Request, res: Response): Promise<void> => {
    try {
        const surveys = await surveyRepository.findPublishedSurveys();
        res.status(200).json(successResponse('Published surveys retrieved successfully', surveys));
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json(errorResponse(error.message));
        } else {
            res.status(400).json(errorResponse('An unexpected error occurred'));
        }
    }
};

export const getPublishedSurveyDetails = async (req: Request, res: Response): Promise<void> => {
    try {
        const { surveyId } = req.params;
        const survey = await surveyRepository.findPublishedSurveyById(surveyId);

        if (!survey) {
            res.status(404).json(errorResponse('Survey not found or not published'));
            return;
        }

        res.status(200).json(successResponse('Survey details retrieved', survey));
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json(errorResponse(error.message));
        } else {
            res.status(400).json(errorResponse('An unexpected error occurred'));
        }
    }
};

export const userSurveyController = {
    listPublishedSurveys,
    getPublishedSurveyDetails,
};
