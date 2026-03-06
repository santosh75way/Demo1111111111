import prisma from '@/common/lib/prisma';
import { EligibilityStatus, SurveyStatus, Prisma } from '@prisma/client';

// ─── Return shapes ────────────────────────────────────────────────────────────

/** Minimal row used by getPublishedSurveys — count only, no full question rows */
export type SurveyListRow = {
  id: string;
  title: string;
  description: string | null;
  status: SurveyStatus;
  createdAt: Date;
  _count: { questions: number };
  responses: { id: string }[];
};

/** Full row used by startSurvey — includes ordered questions, excludes conditions */
export type SurveyDetailRow = {
  id: string;
  title: string;
  description: string | null;
  questions: {
    id: string;
    questionText: string;
    questionType: 'TEXT' | 'NUMBER' | 'SELECT';
    isRequired: boolean;
    order: number;
    options: unknown; // Prisma Json field — cast in service/util layers
  }[];
  responses: { id: string }[];
};

/** Full row used by submitSurvey — includes questions + conditions for eligibility */
export type SurveySubmissionRow = {
  id: string;
  questions: {
    id: string;
    questionText: string;
    questionType: 'TEXT' | 'NUMBER' | 'SELECT';
    isRequired: boolean;
    order: number;
    options: unknown;
  }[];
  conditions: {
    questionId: string;
    operator: 'EQUALS' | 'NOT_EQUALS' | 'GREATER_THAN' | 'GREATER_THAN_EQUAL' | 'LESS_THAN' | 'LESS_THAN_EQUAL' | 'CONTAINS';
    value: string;
    question: { questionType: 'TEXT' | 'NUMBER' | 'SELECT' };
  }[];
  responses: { id: string }[];
};

/** Input for the transactional response + answers write */
export type CreateResponseInput = {
  surveyId: string;
  userId: string;
  eligibilityStatus: EligibilityStatus;
  answers: { questionId: string; value: string }[];
};

// ─── Repository ───────────────────────────────────────────────────────────────

export const surveyUserRepository = {
  /**
   * GET /surveys/published
   * Returns all PUBLISHED surveys with question count and whether
   * the given user has already submitted a response.
   */
  async findPublishedSurveysWithMeta(userId: string): Promise<SurveyListRow[]> {
    return prisma.survey.findMany({
      where: { status: SurveyStatus.PUBLISHED },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        createdAt: true,
        _count: { select: { questions: true } },
        responses: {
          where: { userId },
          select: { id: true },
        },
      },
    });
  },

  /**
   * GET /surveys/:surveyId/start
   * Returns the survey with ordered questions.
   * Does NOT include conditions — those are only needed at submit time.
   */
  async findPublishedSurveyById(
    surveyId: string,
    userId: string,
  ): Promise<SurveyDetailRow | null> {
    return prisma.survey.findFirst({
      where: { id: surveyId, status: SurveyStatus.PUBLISHED },
      select: {
        id: true,
        title: true,
        description: true,
        questions: {
          orderBy: { order: 'asc' },
          select: {
            id: true,
            questionText: true,
            questionType: true,
            isRequired: true,
            order: true,
            options: true,
          },
        },
        responses: {
          where: { userId },
          select: { id: true },
        },
      },
    });
  },

  /**
   * POST /surveys/:surveyId/submit
   * Returns the survey with questions, conditions (including the question type
   * needed by the eligibility evaluator), and the user's prior responses.
   */
  async findSurveyForSubmission(
    surveyId: string,
    userId: string,
  ): Promise<SurveySubmissionRow | null> {
    return prisma.survey.findFirst({
      where: { id: surveyId, status: SurveyStatus.PUBLISHED },
      select: {
        id: true,
        questions: {
          orderBy: { order: 'asc' },
          select: {
            id: true,
            questionText: true,
            questionType: true,
            isRequired: true,
            order: true,
            options: true,
          },
        },
        conditions: {
          select: {
            questionId: true,
            operator: true,
            value: true,
            question: {
              select: { questionType: true },
            },
          },
        },
        responses: {
          where: { userId },
          select: { id: true },
        },
      },
    });
  },

  /**
   * Writes the Response row and all Answer rows in a single transaction.
   * The @@unique([surveyId, userId]) constraint in the schema guarantees
   * at-most-one submission per user at the DB level.
   */
  async createResponseWithAnswers(input: CreateResponseInput): Promise<{ id: string }> {
    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const response = await tx.response.create({
        data: {
          surveyId: input.surveyId,
          userId: input.userId,
          eligibilityStatus: input.eligibilityStatus,
        },
        select: { id: true },
      });

      if (input.answers.length > 0) {
        await tx.answer.createMany({
          data: input.answers.map((a) => ({
            responseId: response.id,
            questionId: a.questionId,
            value: a.value,
          })),
        });
      }

      return response;
    });
  },
};
