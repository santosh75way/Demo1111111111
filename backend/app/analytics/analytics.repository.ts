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

    getSurveysSummary: async () => {
        const surveys = await prisma.survey.findMany({
            select: {
                id: true,
                title: true,
                responses: {
                    select: {
                        eligibilityStatus: true
                    }
                }
            },
            orderBy: {
                createdAt: 'asc'
            }
        });

        let surveyNumber = 1;
        const surveyStats = surveys.map(survey => {
            const totalResponses = survey.responses.length;
            const eligible = survey.responses.filter(r => r.eligibilityStatus === EligibilityStatus.ELIGIBLE).length;
            const notEligible = survey.responses.filter(r => r.eligibilityStatus === EligibilityStatus.NOT_ELIGIBLE).length;
            const eligibilityRate = totalResponses > 0 ? (eligible / totalResponses) * 100 : 0;

            return {
                surveyNumber: surveyNumber++,
                surveyId: survey.id,
                surveyName: survey.title,
                totalResponses,
                eligible,
                notEligible,
                eligibilityRate
            };
        });

        return {
            totalSurveys: surveys.length,
            surveys: surveyStats
        };
    }
};
