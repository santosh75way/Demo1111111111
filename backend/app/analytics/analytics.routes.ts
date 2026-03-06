import { Router } from 'express';
import { analyticsController } from './analytics.controller';
import { authenticate, authorize } from '@/common/middleware/auth';
import { Role } from '@prisma/client';

export const surveyAnalyticsRoutes = Router({ mergeParams: true });

surveyAnalyticsRoutes.use(authenticate);
surveyAnalyticsRoutes.use(authorize([Role.ADMIN]));

surveyAnalyticsRoutes.get('/stats', analyticsController.getSurveyStats);
surveyAnalyticsRoutes.get('/responses', analyticsController.getSurveyResponses);
