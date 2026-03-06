import prisma from '@/common/lib/prisma';
import { SurveyStatus, Prisma } from '@prisma/client';
import { CreateSurveyDTO, UpdateSurveyDTO } from './survey.types';

export const surveyRepository = {
    create: async (data: CreateSurveyDTO, userId: string) => {
        return prisma.survey.create({
            data: {
                title: data.title,
                description: data.description,
                createdById: userId,
                status: SurveyStatus.DRAFT,
            },
        });
    },

    findManyByUserId: async (userId: string) => {
        return prisma.survey.findMany({
            where: {
                createdById: userId,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    },

    findByIdAndUserId: async (surveyId: string, userId: string) => {
        return prisma.survey.findFirst({
            where: {
                id: surveyId,
                createdById: userId,
            },
            include: {
                questions: {
                    orderBy: {
                        order: 'asc',
                    },
                },
                conditions: true,
            },
        });
    },

    findPublishedSurveys: async () => {
        return prisma.survey.findMany({
            where: {
                status: SurveyStatus.PUBLISHED,
            },
            select: {
                id: true,
                title: true,
                description: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    },

    findPublishedSurveyById: async (surveyId: string) => {
        return prisma.survey.findFirst({
            where: {
                id: surveyId,
                status: SurveyStatus.PUBLISHED,
            },
            include: {
                questions: {
                    orderBy: {
                        order: 'asc',
                    },
                },
                conditions: true,
            },
        });
    },

    update: async (surveyId: string, data: UpdateSurveyDTO | { status: SurveyStatus }) => {
        return prisma.survey.update({
            where: { id: surveyId },
            data,
        });
    },
};
