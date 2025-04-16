export const IJwtService = 'IJwtService';

export interface IJwtService {
  sign(
    payload: Buffer | object,
    options?: {
      secret: string;
      algorithm: string;
      expiresIn: string;
    },
  ): string;

  verify<T extends object = any>(
    token: string,
    options?: {
      secret: string;
      algorithms: string[];
    },
  ): T;
}
