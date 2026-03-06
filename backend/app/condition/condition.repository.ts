import prisma from '@/common/lib/prisma';
import { CreateConditionDTO, UpdateConditionDTO } from './condition.types';

export const conditionRepository = {
    create: async (surveyId: string, data: CreateConditionDTO) => {
        return prisma.condition.create({
            data: {
                surveyId,
                questionId: data.questionId,
                operator: data.operator,
                value: data.value,
            },
        });
    },

    findManyBySurveyId: async (surveyId: string) => {
        return prisma.condition.findMany({
            where: { surveyId },
            orderBy: { createdAt: 'asc' },
        });
    },

    findByIdWithSurvey: async (conditionId: string) => {
        return prisma.condition.findUnique({
            where: { id: conditionId },
            include: {
                survey: true,
            },
        });
    },

    update: async (conditionId: string, data: UpdateConditionDTO) => {
        return prisma.condition.update({
            where: { id: conditionId },
            data,
        });
    },

    delete: async (conditionId: string) => {
        return prisma.condition.delete({
            where: { id: conditionId },
        });
    },
};
