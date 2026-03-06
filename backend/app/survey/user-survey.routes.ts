import { Router } from 'express';
import { userSurveyController } from './user-survey.controller';
import { authenticate } from '@/common/middleware/auth';

export const userSurveyRoutes = Router();

// Ensure user is authenticated to see/take surveys
userSurveyRoutes.use(authenticate);

userSurveyRoutes.get('/', userSurveyController.listPublishedSurveys);
userSurveyRoutes.get('/:surveyId', userSurveyController.getPublishedSurveyDetails);
