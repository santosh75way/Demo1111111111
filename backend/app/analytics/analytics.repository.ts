import prisma from '@/common/lib/prisma';
import { EligibilityStatus } from '@prisma/client';

export const analyticsRepository = {
    getStats: async (surveyId: string) => {
        // We can use prisma.groupBy or direct counts.
        // Given the simplicity, direct counts are often easier to type and read.
        const totalResponses = await prisma.response.count({
            where: { surveyId },
        });

        const eligibleCount = await prisma.response.count({
            where: {
                surveyId,
                eligibilityStatus: EligibilityStatus.ELIGIBLE,
            },
        });

        const notEligibleCount = await prisma.response.count({
            where: {
                surveyId,
                eligibilityStatus: EligibilityStatus.NOT_ELIGIBLE,
            },
        });

        return {
            totalResponses,
            eligibleCount,
            notEligibleCount,
        };
    },

    getResponsesBySurvey: async (surveyId: string) => {
        return prisma.response.findMany({
            where: { surveyId },
            include: {
                answers: {
                    include: {
                        question: {
                            select: {
                                questionText: true,
                                questionType: true,
                            }
                        }
                    }
                },
                user: {
                    select: {
                        id: true,
                        email: true,
                        fullName: true,
                    }
                }
            },
            orderBy: {
                submittedAt: 'desc',
            },
        });
    },
};
