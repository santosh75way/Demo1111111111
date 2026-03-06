import authRoutes from '@/auth/auth.routes';
import surveyRoutes from '@/survey/survey.routes';
import { userSurveyRoutes } from '@/survey/user-survey.routes';
import { questionRoutes, surveyQuestionRoutes } from '@/question/question.routes';
import { conditionRoutes, surveyConditionRoutes } from '@/condition/condition.routes';
import { responseRoutes } from '@/response/response.routes';
import { surveyAnalyticsRoutes } from '@/analytics/analytics.routes';
import surveyUserRoutes from '@/survey-user/survey-user.routes';
import { Router } from "express";

const router = Router();

router.use('/auth', authRoutes);
router.use('/admin/surveys/:surveyId/questions', surveyQuestionRoutes);
router.use('/admin/surveys/:surveyId/conditions', surveyConditionRoutes);
router.use('/admin/surveys/:surveyId', surveyAnalyticsRoutes);
router.use('/admin/surveys', surveyRoutes);
router.use('/admin/questions', questionRoutes);
router.use('/admin/conditions', conditionRoutes);

// User-facing survey routes (new clean module)
router.use('/surveys', surveyUserRoutes);

// Legacy user survey routes (kept for backward-compat during migration)
router.use('/surveys', userSurveyRoutes);
router.use('/surveys/:surveyId', responseRoutes);

export default router;