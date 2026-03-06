import { z } from 'zod';

export const AnswerSchema = z.object({
    questionId: z.string().cuid('Invalid question ID format'),
    value: z.string().min(1, 'Answer value cannot be empty'),
});

export const SubmitSurveySchema = z.object({
    body: z.object({
        answers: z.array(AnswerSchema).min(1, 'At least one answer is required'),
    }),
});

export type SubmitSurveyDTO = z.infer<typeof SubmitSurveySchema>['body'];
export type AnswerDTO = z.infer<typeof AnswerSchema>;
