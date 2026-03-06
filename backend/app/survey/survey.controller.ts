import { Request, Response } from 'express';
import { surveyService } from './survey.service';
import { successResponse, errorResponse } from '@/common/types/response.type';
import { CreateSurveyDTO, UpdateSurveyDTO, UpdateSurveyStatusDTO } from './survey.types';

export const createSurvey = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json(errorResponse('Unauthorized'));
            return;
        }

        const { title, description } = req.body as CreateSurveyDTO;
        const survey = await surveyService.createSurvey({ title, description }, req.user.userId);

        res.status(201).json(successResponse('Survey created successfully', survey));
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json(errorResponse(error.message));
        } else {
            res.status(400).json(errorResponse('An unexpected error occurred'));
        }
    }
};

export const listSurveys = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json(errorResponse('Unauthorized'));
            return;
        }

        const surveys = await surveyService.listSurveys(req.user.userId);
        res.status(200).json(successResponse('Surveys retrieved successfully', surveys));
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json(errorResponse(error.message));
        } else {
            res.status(400).json(errorResponse('An unexpected error occurred'));
        }
    }
};

export const getSurveyDetails = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json(errorResponse('Unauthorized'));
            return;
        }

        const { surveyId } = req.params;
        const survey = await surveyService.getSurveyDetails(surveyId, req.user.userId);

        res.status(200).json(successResponse('Survey details retrieved', survey));
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

export const updateSurvey = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json(errorResponse('Unauthorized'));
            return;
        }

        const { surveyId } = req.params;
        const data = req.body as UpdateSurveyDTO;

        const survey = await surveyService.updateSurvey(surveyId, req.user.userId, data);
        res.status(200).json(successResponse('Survey updated successfully', survey));
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

export const updateSurveyStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json(errorResponse('Unauthorized'));
            return;
        }

        const { surveyId } = req.params;
        const { status } = req.body as UpdateSurveyStatusDTO;

        const survey = await surveyService.updateSurveyStatus(surveyId, req.user.userId, status);
        res.status(200).json(successResponse('Survey status updated successfully', survey));
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

export const surveyController = {
    createSurvey,
    listSurveys,
    getSurveyDetails,
    updateSurvey,
    updateSurveyStatus,
};
