import { z } from 'zod';
import { QuestionType } from '@prisma/client';

export const CreateQuestionSchema = z.object({
    body: z.object({
        questionText: z.string().min(1, 'Question text cannot be empty'),
        questionType: z.nativeEnum(QuestionType, {
            message: 'Invalid or missing question type',
        }),
        isRequired: z.boolean().default(true),
        order: z.number().int().nonnegative(),
        options: z.array(z.string()).optional(),
    }).refine((data) => {
        if (data.questionType === QuestionType.SELECT && (!data.options || data.options.length === 0)) {
            return false;
        }
        return true;
    }, {
        message: "Select questions must have at least one option",
        path: ["options"],
    }),
});

export type CreateQuestionDTO = z.infer<typeof CreateQuestionSchema>['body'];

export const UpdateQuestionSchema = z.object({
    body: z.object({
        questionText: z.string().min(1, 'Question text cannot be empty').optional(),
        questionType: z.nativeEnum(QuestionType, {
            message: 'Invalid question type',
        }).optional(),
        isRequired: z.boolean().optional(),
        order: z.number().int().nonnegative().optional(),
        options: z.array(z.string()).optional(),
    }).refine((data) => {
        if (data.questionType === QuestionType.SELECT && data.options && data.options.length === 0) {
            return false;
        }
        return true;
    }, {
        message: "Select questions must have at least one option if options are provided",
        path: ["options"]
    }),
});

export type UpdateQuestionDTO = z.infer<typeof UpdateQuestionSchema>['body'];
