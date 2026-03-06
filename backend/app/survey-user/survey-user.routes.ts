import { Router } from 'express';
import { surveyUserController } from './survey-user.controller';
import { authenticate } from '@/common/middleware/auth';

const router = Router();

// All user-facing survey routes require a valid JWT
router.use(authenticate);

// GET /api/surveys/published
router.get('/published', surveyUserController.getPublishedSurveys);

// GET /api/surveys/:surveyId/start
router.get('/:surveyId/start', surveyUserController.startSurvey);

// POST /api/surveys/:surveyId/submit
router.post('/:surveyId/submit', surveyUserController.submitSurvey);

export default router;
