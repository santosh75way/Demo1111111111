import { responseRepository } from './response.repository';
import { surveyRepository } from '../survey/survey.repository';
import { SubmitSurveyDTO } from './response.types';
import { EligibilityStatus } from '@prisma/client';
import { eligibilityService } from '../eligibility/eligibility.service';

export const submitResponse = async (surveyId: string, userId: string, data: SubmitSurveyDTO) => {
    // 1. Verify survey exists and is published
    const survey = await surveyRepository.findPublishedSurveyById(surveyId);
    if (!survey) {
        throw new Error('Survey not found or not published');
    }

    // 2. Prevent multiple submissions (idempotency/business rule)
    const existingResponse = await responseRepository.findResponseByUserAndSurvey(surveyId, userId);
    if (existingResponse) {
        throw new Error('You have already submitted a response for this survey');
    }

    // 3. Evaluate eligibility
    const conditions = survey.conditions.map(c => ({
        questionId: c.questionId,
        operator: c.operator,
        value: c.value,
        question: {
            questionType: survey.questions.find(q => q.id === c.questionId)?.questionType || 'TEXT'
        }
    }));

    const eligibilityStatus = eligibilityService.evaluateEligibility(data.answers, conditions as any);

    // 4. Save the response
    return responseRepository.createResponseWithAnswers(surveyId, userId, data, eligibilityStatus);
};

export const responseService = {
    submitResponse,
};
