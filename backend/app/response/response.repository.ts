import prisma from '@/common/lib/prisma';
import { SubmitSurveyDTO } from './response.types';
import { EligibilityStatus } from '@prisma/client';

export const responseRepository = {
    createResponseWithAnswers: async (surveyId: string, userId: string, data: SubmitSurveyDTO, eligibilityStatus: EligibilityStatus) => {
        return prisma.response.create({
            data: {
                surveyId,
                userId,
                eligibilityStatus,
                answers: {
                    create: data.answers.map(answer => ({
                        questionId: answer.questionId,
                        value: answer.value,
                    })),
                },
            },
            include: {
                answers: true,
            },
        });
    },

    findResponseByUserAndSurvey: async (surveyId: string, userId: string) => {
        return prisma.response.findFirst({
            where: {
                surveyId,
                userId,
            },
        });
    },
};
