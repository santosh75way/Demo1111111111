import { QuestionType } from '@prisma/client';
import { AppError } from '@/common/errors/AppError';

// ─── Input types ──────────────────────────────────────────────────────────────

export type QuestionForValidation = {
  id: string;
  questionType: QuestionType;
  isRequired: boolean;
  options: unknown; // Prisma Json — string[] | null
};

export type AnswerForValidation = {
  questionId: string;
  value: string;
};

// ─── Main validator ───────────────────────────────────────────────────────────

/**
 * Validates a submitted answers array against the survey's questions.
 *
 * Checks (in order):
 * 1. No duplicate questionIds in the submitted answers
 * 2. Every questionId in answers belongs to this survey
 * 3. All required questions are answered
 * 4. NUMBER answers are numeric
 * 5. SELECT answers match one of the defined options
 *
 * Throws AppError(400) on the first validation failure.
 */
export function validateSurveyAnswers(
  questions: QuestionForValidation[],
  answers: AnswerForValidation[],
): void {
  // ── 1. Duplicate questionId check ──────────────────────────────────────────
  const seenIds = new Set<string>();
  for (const answer of answers) {
    if (seenIds.has(answer.questionId)) {
      throw AppError.badRequest(
        `Duplicate answer for question "${answer.questionId}"`,
      );
    }
    seenIds.add(answer.questionId);
  }

  // Build a lookup from the survey's questions
  const questionMap = new Map<string, QuestionForValidation>(
    questions.map((q) => [q.id, q]),
  );

  // ── 2. Unknown questionId check ────────────────────────────────────────────
  for (const answer of answers) {
    if (!questionMap.has(answer.questionId)) {
      throw AppError.badRequest(
        `Question "${answer.questionId}" does not belong to this survey`,
      );
    }
  }

  // Build answer lookup for required-question check
  const answersMap = new Map<string, string>(
    answers.map((a) => [a.questionId, a.value]),
  );

  for (const question of questions) {
    const rawValue = answersMap.get(question.id);

    // ── 3. Required question answered ────────────────────────────────────────
    if (question.isRequired && (rawValue === undefined || rawValue.trim() === '')) {
      throw AppError.badRequest(
        `Question "${question.id}" is required but was not answered`,
      );
    }

    // Skip format checks for unanswered optional questions
    if (rawValue === undefined || rawValue.trim() === '') continue;

    // ── 4. NUMBER must be numeric ─────────────────────────────────────────────
    if (question.questionType === QuestionType.NUMBER) {
      if (isNaN(Number(rawValue))) {
        throw AppError.badRequest(
          `Answer for question "${question.id}" must be a valid number`,
        );
      }
    }

    // ── 5. SELECT must be one of the allowed options ──────────────────────────
    if (question.questionType === QuestionType.SELECT) {
      const allowedOptions = parseOptions(question.options);

      if (allowedOptions === null) {
        throw AppError.badRequest(
          `Question "${question.id}" has no defined options`,
        );
      }

      const normalised = rawValue.toLowerCase().trim();
      const validMatch = allowedOptions.some(
        (opt) => opt.toLowerCase().trim() === normalised,
      );

      if (!validMatch) {
        throw AppError.badRequest(
          `"${rawValue}" is not a valid option for question "${question.id}". ` +
          `Allowed: ${allowedOptions.join(', ')}`,
        );
      }
    }
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Safely coerces the Prisma Json options field to string[] | null */
function parseOptions(options: unknown): string[] | null {
  if (Array.isArray(options) && options.every((o) => typeof o === 'string')) {
    return options as string[];
  }
  return null;
}
