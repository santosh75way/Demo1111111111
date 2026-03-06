import { ConditionOperator, EligibilityStatus, QuestionType } from '@prisma/client';
import { AnswerDTO } from '../response/response.types';

export const eligibilityService = {
    /**
     * Evaluates if a given set of answers meets ALL survey conditions.
     * Currently, models a strict 'AND' policy where every condition must pass.
     */
    evaluateEligibility: (
        answers: AnswerDTO[],
        conditions: { questionId: string; operator: ConditionOperator; value: string; question: { questionType: QuestionType } }[]
    ): EligibilityStatus => {

        // If there are no conditions, they are eligible by default
        if (!conditions || conditions.length === 0) {
            return EligibilityStatus.ELIGIBLE;
        }

        const answersMap = new Map(answers.map(a => [a.questionId, a.value]));

        for (const condition of conditions) {
            const userAnswerValue = answersMap.get(condition.questionId);

            // If a condition exists for a question, but the user didn't provide an answer, they fail the condition.
            if (userAnswerValue === undefined || userAnswerValue === null) {
                return EligibilityStatus.NOT_ELIGIBLE;
            }

            const passed = evaluateSingleCondition(
                userAnswerValue,
                condition.value,
                condition.operator,
                condition.question.questionType
            );

            // Strict AND logic: if any single condition fails, they are NOT ELIGIBLE
            if (!passed) {
                return EligibilityStatus.NOT_ELIGIBLE;
            }
        }

        // All conditions passed
        return EligibilityStatus.ELIGIBLE;
    }
};

const evaluateSingleCondition = (
    userAnswer: string,
    conditionValue: string,
    operator: ConditionOperator,
    questionType: QuestionType
): boolean => {
    // Parsing numbers if applicable
    const isNumeric = questionType === QuestionType.NUMBER;

    if (isNumeric) {
        const userNum = Number(userAnswer);
        const condNum = Number(conditionValue);

        if (isNaN(userNum) || isNaN(condNum)) {
            return false; // Can't compare mathematically if not valid numbers
        }

        switch (operator) {
            case ConditionOperator.EQUALS:
                return userNum === condNum;
            case ConditionOperator.NOT_EQUALS:
                return userNum !== condNum;
            case ConditionOperator.GREATER_THAN:
                return userNum > condNum;
            case ConditionOperator.GREATER_THAN_EQUAL:
                return userNum >= condNum;
            case ConditionOperator.LESS_THAN:
                return userNum < condNum;
            case ConditionOperator.LESS_THAN_EQUAL:
                return userNum <= condNum;
            case ConditionOperator.CONTAINS:
                return userAnswer.includes(conditionValue); // Fallback to string behavior
            default:
                return false;
        }
    }

    // String comparison logic (for TEXT, SELECT)
    // Ignoring case for robustness
    const userStr = userAnswer.toLowerCase().trim();
    const condStr = conditionValue.toLowerCase().trim();

    switch (operator) {
        case ConditionOperator.EQUALS:
            return userStr === condStr;
        case ConditionOperator.NOT_EQUALS:
            return userStr !== condStr;
        case ConditionOperator.CONTAINS:
            return userStr.includes(condStr);
        // Mathematical operators don't make sense for generic strings, fail them safely or compare lexically.
        // For safety, string math operators fail.
        default:
            return false;
    }
};
