import { questionRepository } from './question.repository';
import { surveyRepository } from '../survey/survey.repository';
import { CreateQuestionDTO, UpdateQuestionDTO } from './question.types';

export const createQuestion = async (surveyId: string, userId: string, data: CreateQuestionDTO) => {
    const survey = await surveyRepository.findByIdAndUserId(surveyId, userId);

    if (!survey) {
        throw new Error('Survey not found or unauthorized');
    }

    return questionRepository.create(surveyId, data);
};

export const listQuestions = async (surveyId: string, userId: string) => {
    const survey = await surveyRepository.findByIdAndUserId(surveyId, userId);

    if (!survey) {
        throw new Error('Survey not found or unauthorized');
    }

    return questionRepository.findManyBySurveyId(surveyId);
};

export const updateQuestion = async (questionId: string, userId: string, data: UpdateQuestionDTO) => {
    const question = await questionRepository.findByIdWithSurvey(questionId);

    if (!question) {
        throw new Error('Question not found');
    }

    if (question.survey.createdById !== userId) {
        throw new Error('Unauthorized');
    }

    return questionRepository.update(questionId, data);
};

export const deleteQuestion = async (questionId: string, userId: string) => {
    const question = await questionRepository.findByIdWithSurvey(questionId);

    if (!question) {
        throw new Error('Question not found');
    }

    if (question.survey.createdById !== userId) {
        throw new Error('Unauthorized');
    }

    return questionRepository.delete(questionId);
};

export const questionService = {
    createQuestion,
    listQuestions,
    updateQuestion,
    deleteQuestion,
};
