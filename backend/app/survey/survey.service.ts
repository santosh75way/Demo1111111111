import { SurveyStatus } from '@prisma/client';
import { surveyRepository } from './survey.repository';
import { CreateSurveyDTO, UpdateSurveyDTO } from './survey.types';

export const createSurvey = async (data: CreateSurveyDTO, userId: string) => {
    return surveyRepository.create(data, userId);
};

export const listSurveys = async (userId: string) => {
    return surveyRepository.findManyByUserId(userId);
};

export const getSurveyDetails = async (surveyId: string, userId: string) => {
    const survey = await surveyRepository.findByIdAndUserId(surveyId, userId);
    if (!survey) {
        throw new Error('Survey not found or unauthorized');
    }
    return survey;
};

export const updateSurveyStatus = async (surveyId: string, userId: string, status: SurveyStatus) => {
    const survey = await surveyRepository.findByIdAndUserId(surveyId, userId);

    if (!survey) {
        throw new Error('Survey not found or unauthorized');
    }

    if (status === SurveyStatus.PUBLISHED) {
        if (!survey.questions || survey.questions.length === 0) {
            throw new Error('Cannot publish a survey with zero questions');
        }
    }

    return surveyRepository.update(surveyId, { status });
};

export const updateSurvey = async (surveyId: string, userId: string, data: UpdateSurveyDTO) => {
    const survey = await surveyRepository.findByIdAndUserId(surveyId, userId);

    if (!survey) {
        throw new Error('Survey not found or unauthorized');
    }

    if (survey.status === SurveyStatus.CLOSED) {
        throw new Error('Cannot edit a closed survey');
    }

    return surveyRepository.update(surveyId, data);
};

export const surveyService = {
    createSurvey,
    listSurveys,
    getSurveyDetails,
    updateSurvey,
    updateSurveyStatus,
};
