import type { EligibilityStatus, QuestionType } from '@prisma/client';

// ─── GET /surveys/published ──────────────────────────────────────────────────

export type PublishedSurveyItem = {
  id: string;
  title: string;
  description: string | null;
  status: 'PUBLISHED';
  questionCount: number;
  createdAt: Date;
  alreadySubmitted: boolean;
};

// ─── GET /surveys/:surveyId/start ────────────────────────────────────────────

export type SurveyStartQuestion = {
  id: string;
  questionText: string;
  questionType: QuestionType;
  isRequired: boolean;
  order: number;
  /** Prisma stores options as Json — null for TEXT/NUMBER, string[] for SELECT */
  options: string[] | null;
};

export type SurveyStartData = {
  id: string;
  title: string;
  description: string | null;
  questions: SurveyStartQuestion[];
};

// ─── POST /surveys/:surveyId/submit ──────────────────────────────────────────

export type SurveySubmitResult = {
  responseId: string;
  eligibilityStatus: EligibilityStatus;
  resultMessage: string;
};
