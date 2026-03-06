import { z } from 'zod';
import { ConditionOperator } from '@prisma/client';

export const CreateConditionSchema = z.object({
    body: z.object({
        questionId: z.string().cuid('Invalid question ID format'),
        operator: z.nativeEnum(ConditionOperator, {
            message: 'Invalid or missing condition operator',
        }),
        value: z.string().min(1, 'Value cannot be empty'),
    }),
});

export type CreateConditionDTO = z.infer<typeof CreateConditionSchema>['body'];

export const UpdateConditionSchema = z.object({
    body: z.object({
        operator: z.nativeEnum(ConditionOperator, {
            message: 'Invalid condition operator',
        }).optional(),
        value: z.string().min(1, 'Value cannot be empty').optional(),
    }),
});

export type UpdateConditionDTO = z.infer<typeof UpdateConditionSchema>['body'];
