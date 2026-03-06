import { Router } from 'express';
import { responseController } from './response.controller';
import { authenticate } from '@/common/middleware/auth';
import { validateRequest } from '@/common/middleware/zodValidation';
import { SubmitSurveySchema } from './response.schema';

export const responseRoutes = Router({ mergeParams: true });

// Ensure user is authenticated to submit
responseRoutes.use(authenticate);

responseRoutes.post('/submit', validateRequest(SubmitSurveySchema), responseController.submitSurvey);
