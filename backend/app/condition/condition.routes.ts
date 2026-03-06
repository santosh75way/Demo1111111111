import { Router } from 'express';
import { conditionController } from './condition.controller';
import { authenticate, authorize } from '@/common/middleware/auth';
import { validateRequest } from '@/common/middleware/zodValidation';
import { CreateConditionSchema, UpdateConditionSchema } from './condition.schema';
import { Role } from '@prisma/client';

export const surveyConditionRoutes = Router({ mergeParams: true });
surveyConditionRoutes.use(authenticate);
surveyConditionRoutes.use(authorize([Role.ADMIN]));

surveyConditionRoutes.post('/', validateRequest(CreateConditionSchema), conditionController.createCondition);
surveyConditionRoutes.get('/', conditionController.listConditions);

export const conditionRoutes = Router({ mergeParams: true });
conditionRoutes.use(authenticate);
conditionRoutes.use(authorize([Role.ADMIN]));

conditionRoutes.patch('/:conditionId', validateRequest(UpdateConditionSchema), conditionController.updateCondition);
conditionRoutes.delete('/:conditionId', conditionController.deleteCondition);
