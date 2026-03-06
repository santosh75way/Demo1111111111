import { z } from "zod";

export const surveyIdParamSchema = z.object({
  surveyId: z.string().min(1, "Survey id is required"),
});

export const submitSurveyBodySchema = z.object({
  answers: z.array(
    z.object({
      questionId: z.string().min(1, "Question id is required"),
      value: z.string().trim().min(1, "Answer value is required"),
    })
  ).min(1, "At least one answer is required"),
});

export type SurveyIdParamInput = z.infer<typeof surveyIdParamSchema>;
export type SubmitSurveyBodyInput = z.infer<typeof submitSurveyBodySchema>;