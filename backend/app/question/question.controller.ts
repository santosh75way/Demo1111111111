import { Request, Response } from 'express';
import { questionService } from './question.service';
import { successResponse, errorResponse } from '@/common/types/response.type';
import { CreateQuestionDTO, UpdateQuestionDTO } from './question.types';

const handleServiceError = (res: Response, error: unknown) => {
    if (error instanceof Error) {
        if (error.message.includes('not found')) {
            res.status(404).json(errorResponse(error.message));
        } else if (error.message.includes('Unauthorized')) {
            res.status(403).json(errorResponse(error.message));
        } else {
            res.status(400).json(errorResponse(error.message));
        }
    } else {
        res.status(400).json(errorResponse('An unexpected error occurred'));
    }
};

export const createQuestion = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json(errorResponse('Unauthorized'));
            return;
        }

        const { surveyId } = req.params;
        const data = req.body as CreateQuestionDTO;

        const question = await questionService.createQuestion(surveyId, req.user.userId, data);
        res.status(201).json(successResponse('Question created successfully', question));
    } catch (error) {
        handleServiceError(res, error);
    }
};

export const listQuestions = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json(errorResponse('Unauthorized'));
            return;
        }

        const { surveyId } = req.params;
        const questions = await questionService.listQuestions(surveyId, req.user.userId);
        res.status(200).json(successResponse('Questions retrieved successfully', questions));
    } catch (error) {
        handleServiceError(res, error);
    }
};

export const updateQuestion = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json(errorResponse('Unauthorized'));
            return;
        }

        const { questionId } = req.params;
        const data = req.body as UpdateQuestionDTO;

        const question = await questionService.updateQuestion(questionId, req.user.userId, data);
        res.status(200).json(successResponse('Question updated successfully', question));
    } catch (error) {
        handleServiceError(res, error);
    }
};

export const deleteQuestion = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json(errorResponse('Unauthorized'));
            return;
        }

        const { questionId } = req.params;
        const question = await questionService.deleteQuestion(questionId, req.user.userId);
        res.status(200).json(successResponse('Question deleted successfully', question));
    } catch (error) {
        handleServiceError(res, error);
    }
};

export const questionController = {
    createQuestion,
    listQuestions,
    updateQuestion,
    deleteQuestion,
};
