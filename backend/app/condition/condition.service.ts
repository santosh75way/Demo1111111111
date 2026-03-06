import { conditionRepository } from './condition.repository';
import { surveyRepository } from '../survey/survey.repository';
import { questionRepository } from '../question/question.repository';
import { CreateConditionDTO, UpdateConditionDTO } from './condition.types';

export const createCondition = async (surveyId: string, userId: string, data: CreateConditionDTO) => {
    const survey = await surveyRepository.findByIdAndUserId(surveyId, userId);

    if (!survey) {
        throw new Error('Survey not found or unauthorized');
    }

    // Ensure the question belongs to this survey
    const question = await questionRepository.findByIdWithSurvey(data.questionId);
    if (!question || question.surveyId !== surveyId) {
        throw new Error('Question not found or does not belong to this survey');
    }

    return conditionRepository.create(surveyId, data);
};

export const listConditions = async (surveyId: string, userId: string) => {
    const survey = await surveyRepository.findByIdAndUserId(surveyId, userId);

    if (!survey) {
        throw new Error('Survey not found or unauthorized');
    }

    return conditionRepository.findManyBySurveyId(surveyId);
};

export const updateCondition = async (conditionId: string, userId: string, data: UpdateConditionDTO) => {
    const condition = await conditionRepository.findByIdWithSurvey(conditionId);

    if (!condition) {
        throw new Error('Condition not found');
    }

    if (condition.survey.createdById !== userId) {
        throw new Error('Unauthorized');
    }

    return conditionRepository.update(conditionId, data);
};

export const deleteCondition = async (conditionId: string, userId: string) => {
    const condition = await conditionRepository.findByIdWithSurvey(conditionId);

    if (!condition) {
        throw new Error('Condition not found');
    }

    if (condition.survey.createdById !== userId) {
        throw new Error('Unauthorized');
    }

    return conditionRepository.delete(conditionId);
};

export const conditionService = {
    createCondition,
    listConditions,
    updateCondition,
    deleteCondition,
};
