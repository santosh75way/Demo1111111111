import { Router } from 'express';
import { questionController } from './question.controller';
import { authenticate, authorize } from '@/common/middleware/auth';
import { validateRequest } from '@/common/middleware/zodValidation';
import { CreateQuestionSchema, UpdateQuestionSchema } from './question.schema';
import { Role } from '@prisma/client';

export const surveyQuestionRoutes = Router({ mergeParams: true });
surveyQuestionRoutes.use(authenticate);
surveyQuestionRoutes.use(authorize([Role.ADMIN]));

surveyQuestionRoutes.post('/', validateRequest(CreateQuestionSchema), questionController.createQuestion);
surveyQuestionRoutes.get('/', questionController.listQuestions);


export const questionRoutes = Router({ mergeParams: true });
questionRoutes.use(authenticate);
questionRoutes.use(authorize([Role.ADMIN]));

questionRoutes.patch('/:questionId', validateRequest(UpdateQuestionSchema), questionController.updateQuestion);
questionRoutes.delete('/:questionId', questionController.deleteQuestion);
