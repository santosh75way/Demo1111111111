import { Router } from 'express';
import { analyticsController } from './analytics.controller';
import { authenticate, authorize } from '@/common/middleware/auth';
import { Role } from '@prisma/client';

export const reportsRoutes = Router();

reportsRoutes.use(authenticate);
reportsRoutes.use(authorize([Role.ADMIN]));

reportsRoutes.get('/surveys-summary', analyticsController.getSurveysSummary);
