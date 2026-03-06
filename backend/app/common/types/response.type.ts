export type JsonValue =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JsonValue }
  | JsonValue[];

export interface ApiResponse<T = JsonValue, E = JsonValue> {
  success: boolean;
  message: string;
  data?: T;
  error?: E;
}

export const successResponse = <T = JsonValue>(
  message: string,
  data?: T,
): ApiResponse<T> => {
  return {
    success: true,
    message,
    data,
  };
};

export const errorResponse = <E = JsonValue>(
  message: string,
  error?: E,
): ApiResponse<JsonValue, E> => {
  return {
    success: false,
    message,
    error: error || (message as JsonValue as E),
  };
};
