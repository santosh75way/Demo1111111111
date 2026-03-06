import { Request, Response } from 'express';
import { conditionService } from './condition.service';
import { successResponse, errorResponse } from '@/common/types/response.type';
import { CreateConditionDTO, UpdateConditionDTO } from './condition.types';

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

export const createCondition = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json(errorResponse('Unauthorized'));
            return;
        }

        const { surveyId } = req.params;
        const data = req.body as CreateConditionDTO;

        const condition = await conditionService.createCondition(surveyId, req.user.userId, data);
        res.status(201).json(successResponse('Condition created successfully', condition));
    } catch (error) {
        handleServiceError(res, error);
    }
};

export const listConditions = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json(errorResponse('Unauthorized'));
            return;
        }

        const { surveyId } = req.params;
        const conditions = await conditionService.listConditions(surveyId, req.user.userId);
        res.status(200).json(successResponse('Conditions retrieved successfully', conditions));
    } catch (error) {
        handleServiceError(res, error);
    }
};

export const updateCondition = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json(errorResponse('Unauthorized'));
            return;
        }

        const { conditionId } = req.params;
        const data = req.body as UpdateConditionDTO;

        const condition = await conditionService.updateCondition(conditionId, req.user.userId, data);
        res.status(200).json(successResponse('Condition updated successfully', condition));
    } catch (error) {
        handleServiceError(res, error);
    }
};

export const deleteCondition = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json(errorResponse('Unauthorized'));
            return;
        }

        const { conditionId } = req.params;
        const condition = await conditionService.deleteCondition(conditionId, req.user.userId);
        res.status(200).json(successResponse('Condition deleted successfully', condition));
    } catch (error) {
        handleServiceError(res, error);
    }
};

export const conditionController = {
    createCondition,
    listConditions,
    updateCondition,
    deleteCondition,
};
