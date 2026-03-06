import { api } from './api';
import type { ApiResponse } from '@/libs/types';

// ─── Shared Types ───────────────────────────────────────────────────────────

export interface Survey {
    id: string;
    title: string;
    description: string | null;
    status: 'DRAFT' | 'PUBLISHED' | 'CLOSED';
    createdAt: string;
    updatedAt: string;
    questions?: Question[];
    conditions?: Condition[];
}

export interface Question {
    id: string;
    surveyId: string;
    questionText: string;
    questionType: 'TEXT' | 'NUMBER' | 'SELECT';
    isRequired: boolean;
    order: number;
    options?: string[] | null;
}

export interface Condition {
    id: string;
    surveyId: string;
    questionId: string;
    operator: 'EQUALS' | 'NOT_EQUALS' | 'GREATER_THAN' | 'GREATER_THAN_EQUAL' | 'LESS_THAN' | 'LESS_THAN_EQUAL' | 'CONTAINS';
    value: string;
}

export interface SurveyStats {
    totalResponses: number;
    eligibleCount: number;
    notEligibleCount: number;
}

// ─── Admin — Surveys ────────────────────────────────────────────────────────
// GET  /api/admin/surveys
export const getAdminSurveys = async (): Promise<Survey[]> => {
    const res = await api.get<ApiResponse<Survey[]>>('/api/admin/surveys');
    return res.data.data;
};

// GET  /api/admin/surveys/:surveyId
export const getAdminSurveyById = async (id: string): Promise<Survey> => {
    const res = await api.get<ApiResponse<Survey>>(`/api/admin/surveys/${id}`);
    return res.data.data;
};

// POST /api/admin/surveys
export const createAdminSurvey = async (data: { title: string; description?: string }): Promise<Survey> => {
    const res = await api.post<ApiResponse<Survey>>('/api/admin/surveys', data);
    return res.data.data;
};

// PATCH /api/admin/surveys/:surveyId
export const updateAdminSurvey = async (id: string, data: { title?: string; description?: string }): Promise<Survey> => {
    const res = await api.patch<ApiResponse<Survey>>(`/api/admin/surveys/${id}`, data);
    return res.data.data;
};

// PATCH /api/admin/surveys/:surveyId/status  (publish → status: PUBLISHED)
export const updateAdminSurveyStatus = async (id: string, status: Survey['status']): Promise<Survey> => {
    const res = await api.patch<ApiResponse<Survey>>(`/api/admin/surveys/${id}/status`, { status });
    return res.data.data;
};

// ─── Admin — Questions ──────────────────────────────────────────────────────
// POST /api/admin/surveys/:surveyId/questions
export const createQuestion = async (
    surveyId: string,
    data: Omit<Question, 'id' | 'surveyId'>
): Promise<Question> => {
    const res = await api.post<ApiResponse<Question>>(`/api/admin/surveys/${surveyId}/questions`, data);
    return res.data.data;
};

// GET  /api/admin/surveys/:surveyId/questions
export const listQuestions = async (surveyId: string): Promise<Question[]> => {
    const res = await api.get<ApiResponse<Question[]>>(`/api/admin/surveys/${surveyId}/questions`);
    return res.data.data;
};

// PATCH /api/admin/questions/:questionId
export const updateQuestion = async (
    questionId: string,
    data: Partial<Omit<Question, 'id' | 'surveyId'>>
): Promise<Question> => {
    const res = await api.patch<ApiResponse<Question>>(`/api/admin/questions/${questionId}`, data);
    return res.data.data;
};

// DELETE /api/admin/questions/:questionId
export const deleteQuestion = async (questionId: string): Promise<void> => {
    await api.delete(`/api/admin/questions/${questionId}`);
};

// ─── Admin — Conditions ─────────────────────────────────────────────────────
// POST /api/admin/surveys/:surveyId/conditions
export const createCondition = async (
    surveyId: string,
    data: Omit<Condition, 'id' | 'surveyId'>
): Promise<Condition> => {
    const res = await api.post<ApiResponse<Condition>>(`/api/admin/surveys/${surveyId}/conditions`, data);
    return res.data.data;
};

// GET  /api/admin/surveys/:surveyId/conditions
export const listConditions = async (surveyId: string): Promise<Condition[]> => {
    const res = await api.get<ApiResponse<Condition[]>>(`/api/admin/surveys/${surveyId}/conditions`);
    return res.data.data;
};

// PATCH /api/admin/conditions/:conditionId
export const updateCondition = async (
    conditionId: string,
    data: Partial<Omit<Condition, 'id' | 'surveyId'>>
): Promise<Condition> => {
    const res = await api.patch<ApiResponse<Condition>>(`/api/admin/conditions/${conditionId}`, data);
    return res.data.data;
};

// DELETE /api/admin/conditions/:conditionId
export const deleteCondition = async (conditionId: string): Promise<void> => {
    await api.delete(`/api/admin/conditions/${conditionId}`);
};

// ─── Admin — Analytics ──────────────────────────────────────────────────────
// GET  /api/admin/surveys/:surveyId/stats
export const getSurveyStats = async (surveyId: string): Promise<SurveyStats> => {
    const res = await api.get<ApiResponse<SurveyStats>>(`/api/admin/surveys/${surveyId}/stats`);
    return res.data.data;
};

// ─── User — Surveys ─────────────────────────────────────────────────────────
// GET  /api/surveys  (published only)
export const getAvailableSurveys = async (): Promise<Survey[]> => {
    const res = await api.get<ApiResponse<Survey[]>>('/api/surveys');
    return res.data.data;
};

// GET  /api/surveys/:surveyId  (with questions)
export const getSurveyDetails = async (id: string): Promise<Survey> => {
    const res = await api.get<ApiResponse<Survey>>(`/api/surveys/${id}`);
    return res.data.data;
};

// POST /api/surveys/:surveyId/submit
export const submitSurvey = async (
    surveyId: string,
    answers: { questionId: string; value: string }[]
): Promise<{ eligibilityStatus: 'ELIGIBLE' | 'NOT_ELIGIBLE' }> => {
    const res = await api.post<ApiResponse<{ eligibilityStatus: 'ELIGIBLE' | 'NOT_ELIGIBLE' }>>(
        `/api/surveys/${surveyId}/submit`,
        { answers }
    );
    return res.data.data;
};
