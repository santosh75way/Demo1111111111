import prisma from '@/common/lib/prisma';
import { CreateQuestionDTO, UpdateQuestionDTO } from './question.types';
import { Prisma } from '@prisma/client';

export const questionRepository = {
    create: async (surveyId: string, data: CreateQuestionDTO) => {
        return prisma.question.create({
            data: {
                surveyId,
                questionText: data.questionText,
                questionType: data.questionType,
                isRequired: data.isRequired ?? true,
                order: data.order,
                options: data.options ? (data.options as unknown as Prisma.InputJsonValue) : undefined,
            },
        });
    },

    findManyBySurveyId: async (surveyId: string) => {
        return prisma.question.findMany({
            where: { surveyId },
            orderBy: { order: 'asc' },
        });
    },

    findByIdWithSurvey: async (questionId: string) => {
        return prisma.question.findUnique({
            where: { id: questionId },
            include: {
                survey: true,
            },
        });
    },

    update: async (questionId: string, data: UpdateQuestionDTO) => {
        return prisma.question.update({
            where: { id: questionId },
            data: {
                ...data,
                options: data.options === undefined ? undefined : (data.options as unknown as Prisma.InputJsonValue),
            },
        });
    },

    delete: async (questionId: string) => {
        return prisma.question.delete({
            where: { id: questionId },
        });
    },
};
