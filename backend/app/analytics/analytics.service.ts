import { analyticsRepository } from './analytics.repository';
import { surveyRepository } from '../survey/survey.repository';

export const getSurveyStats = async (surveyId: string, userId: string) => {
    const survey = await surveyRepository.findByIdAndUserId(surveyId, userId);

    if (!survey) {
        throw new Error('Survey not found or unauthorized');
    }

    return analyticsRepository.getStats(surveyId);
};

export const getSurveyResponses = async (surveyId: string, userId: string) => {
    const survey = await surveyRepository.findByIdAndUserId(surveyId, userId);

    if (!survey) {
        throw new Error('Survey not found or unauthorized');
    }

    return analyticsRepository.getResponsesBySurvey(surveyId);
};

export const getSurveysSummary = async () => {
    return analyticsRepository.getSurveysSummary();
};

export const analyticsService = {
    getSurveyStats,
    getSurveyResponses,
    getSurveysSummary,
};
