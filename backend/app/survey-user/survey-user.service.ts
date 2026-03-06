import { surveyUserRepository } from './survey-user.repository';
import { AppError } from '@/common/errors/AppError';
import { evaluateEligibility } from './eligibility.util';
import { validateSurveyAnswers } from './survey-answer.util';
import type {
  PublishedSurveyItem,
  SurveyStartData,
  SurveyStartQuestion,
  SurveySubmitResult,
} from './survey-user.types';
import type { SubmitSurveyBodyInput } from './survey-user.schema';

export const surveyUserService = {
  /**
   * GET /surveys/published
   * Returns all PUBLISHED surveys enriched with questionCount and alreadySubmitted flag.
   */
  async getPublishedSurveys(userId: string): Promise<PublishedSurveyItem[]> {
    const rows = await surveyUserRepository.findPublishedSurveysWithMeta(userId);

    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      status: 'PUBLISHED' as const,
      questionCount: row._count.questions,
      createdAt: row.createdAt,
      alreadySubmitted: row.responses.length > 0,
    }));
  },

  /**
   * GET /surveys/:surveyId/start
   * Returns the survey with ordered questions ready for the user to fill in.
   * Throws 404 if the survey is not found or not PUBLISHED.
   * Throws 409 if the user has already submitted a response.
   */
  async startSurvey(surveyId: string, userId: string): Promise<SurveyStartData> {
    const row = await surveyUserRepository.findPublishedSurveyById(surveyId, userId);

    if (!row) {
      throw AppError.notFound('Survey not found or not available');
    }

    if (row.responses.length > 0) {
      throw AppError.conflict('You have already submitted this survey');
    }

    const questions: SurveyStartQuestion[] = row.questions.map((q) => ({
      id: q.id,
      questionText: q.questionText,
      questionType: q.questionType,
      isRequired: q.isRequired,
      order: q.order,
      // Prisma returns Json — for SELECT it's string[], for others it's null
      options: Array.isArray(q.options) ? (q.options as string[]) : null,
    }));

    return {
      id: row.id,
      title: row.title,
      description: row.description,
      questions,
    };
  },

  /**
   * POST /surveys/:surveyId/submit
   * Validates answers, evaluates eligibility, and persists the response in a transaction.
   * Throws 404 if survey is not found / not PUBLISHED.
   * Throws 409 if the user already submitted.
   * Throws 400 if the survey has no questions or answer validation fails.
   */
  async submitSurvey(
    surveyId: string,
    userId: string,
    input: SubmitSurveyBodyInput,
  ): Promise<SurveySubmitResult> {
    const row = await surveyUserRepository.findSurveyForSubmission(surveyId, userId);

    if (!row) {
      throw AppError.notFound('Survey not found or not available');
    }

    if (row.responses.length > 0) {
      throw AppError.conflict('You have already submitted this survey');
    }

    if (row.questions.length === 0) {
      throw AppError.badRequest('This survey has no questions');
    }

    // Validate structure and format of all submitted answers
    validateSurveyAnswers(row.questions, input.answers);

    // Evaluate eligibility using AND logic across all conditions
    const eligibilityStatus = evaluateEligibility(row.conditions, input.answers);

    // Persist response + answers atomically
    const response = await surveyUserRepository.createResponseWithAnswers({
      surveyId,
      userId,
      eligibilityStatus,
      answers: input.answers,
    });

    return {
      responseId: response.id,
      eligibilityStatus,
      resultMessage:
        eligibilityStatus === 'ELIGIBLE'
          ? 'Congratulations! You are eligible.'
          : 'Thank you for completing the survey. Unfortunately you are not eligible at this time.',
    };
  },
};
