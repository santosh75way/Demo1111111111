import { ConditionOperator, EligibilityStatus, QuestionType } from '@prisma/client';

// ─── Input types ──────────────────────────────────────────────────────────────

export type ConditionInput = {
  questionId: string;
  operator: ConditionOperator;
  value: string;
  question: { questionType: QuestionType };
};

export type AnswerInput = {
  questionId: string;
  value: string;
};

// ─── Core evaluation ─────────────────────────────────────────────────────────

/**
 * Evaluates all survey conditions against a user's answers using strict AND logic.
 * - If there are no conditions, the user is ELIGIBLE by default.
 * - If any condition references a question that wasn't answered, the user is NOT_ELIGIBLE.
 * - All conditions must pass for the user to be ELIGIBLE.
 */
export function evaluateEligibility(
  conditions: ConditionInput[],
  answers: AnswerInput[],
): EligibilityStatus {
  if (conditions.length === 0) {
    return EligibilityStatus.ELIGIBLE;
  }

  const answersMap = new Map<string, string>(
    answers.map((a) => [a.questionId, a.value]),
  );

  for (const condition of conditions) {
    const userAnswer = answersMap.get(condition.questionId);

    // A missing answer for a conditioned question fails immediately
    if (userAnswer === undefined) {
      return EligibilityStatus.NOT_ELIGIBLE;
    }

    const passed = evaluateSingleCondition(
      userAnswer,
      condition.value,
      condition.operator,
      condition.question.questionType,
    );

    if (!passed) {
      return EligibilityStatus.NOT_ELIGIBLE;
    }
  }

  return EligibilityStatus.ELIGIBLE;
}

// ─── Single condition ─────────────────────────────────────────────────────────

function evaluateSingleCondition(
  userAnswer: string,
  conditionValue: string,
  operator: ConditionOperator,
  questionType: QuestionType,
): boolean {
  if (questionType === QuestionType.NUMBER) {
    const userNum = Number(userAnswer);
    const condNum = Number(conditionValue);

    if (isNaN(userNum) || isNaN(condNum)) return false;

    switch (operator) {
      case ConditionOperator.EQUALS:             return userNum === condNum;
      case ConditionOperator.NOT_EQUALS:         return userNum !== condNum;
      case ConditionOperator.GREATER_THAN:       return userNum > condNum;
      case ConditionOperator.GREATER_THAN_EQUAL: return userNum >= condNum;
      case ConditionOperator.LESS_THAN:          return userNum < condNum;
      case ConditionOperator.LESS_THAN_EQUAL:    return userNum <= condNum;
      case ConditionOperator.CONTAINS:           return userAnswer.includes(conditionValue);
      default:                                   return false;
    }
  }

  // TEXT / SELECT — case-insensitive string comparison
  const userStr = userAnswer.toLowerCase().trim();
  const condStr = conditionValue.toLowerCase().trim();

  switch (operator) {
    case ConditionOperator.EQUALS:     return userStr === condStr;
    case ConditionOperator.NOT_EQUALS: return userStr !== condStr;
    case ConditionOperator.CONTAINS:   return userStr.includes(condStr);
    default:                           return false;
  }
}
