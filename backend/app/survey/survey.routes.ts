import { Router } from 'express';
import { surveyController } from './survey.controller';
import { authenticate, authorize } from '@/common/middleware/auth';
import { validateRequest } from '@/common/middleware/zodValidation';
import { CreateSurveySchema, UpdateSurveySchema, UpdateSurveyStatusSchema } from './survey.schema';
import { Role } from '@prisma/client';

const router = Router();

// All survey routes require authentication and ADMIN role
router.use(authenticate);
router.use(authorize([Role.ADMIN]));

router.post('/', validateRequest(CreateSurveySchema), surveyController.createSurvey);
router.get('/', surveyController.listSurveys);
router.get('/:surveyId', surveyController.getSurveyDetails);
router.patch('/:surveyId', validateRequest(UpdateSurveySchema), surveyController.updateSurvey);
router.patch('/:surveyId/status', validateRequest(UpdateSurveyStatusSchema), surveyController.updateSurveyStatus);

export default router;
