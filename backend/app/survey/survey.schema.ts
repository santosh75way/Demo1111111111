import { z } from 'zod';
import { SurveyStatus } from '@prisma/client';

export const CreateSurveySchema = z.object({
    body: z.object({
        title: z.string().min(1, 'Title cannot be empty').max(255, 'Title too long'),
        description: z.string().optional(),
    }),
});

export type CreateSurveyDTO = z.infer<typeof CreateSurveySchema>['body'];

export const UpdateSurveySchema = z.object({
    body: z.object({
        title: z.string().min(1, 'Title cannot be empty').max(255, 'Title too long').optional(),
        description: z.string().optional(),
    })
});

export type UpdateSurveyDTO = z.infer<typeof UpdateSurveySchema>['body'];

export const UpdateSurveyStatusSchema = z.object({
    body: z.object({
        status: z.nativeEnum(SurveyStatus, {
            message: 'Invalid or missing status value'
        }),
    }),
});

export type UpdateSurveyStatusDTO = z.infer<typeof UpdateSurveyStatusSchema>['body'];
