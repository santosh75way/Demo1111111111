import { Role } from '@prisma/client';

export interface TokenPayload {
  userId: string;
  email: string;
  role: Role;
}

export interface DecodedToken extends TokenPayload {
  iat: number;
  exp: number;
}