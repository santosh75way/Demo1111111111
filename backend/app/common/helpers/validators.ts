import validator from 'validator';

export const sanitizeEmail = (email: string): string => {
  return validator.normalizeEmail(email) || email.toLowerCase();
};
