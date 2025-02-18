import { AuthCodeModel } from '../models/auth-code.model';

export const IAuthCodeRepository = 'IAuthCodeRepository';

export interface IAuthCodeRepository {
  getOneBy(dto: Partial<AuthCodeModel>): Promise<AuthCodeModel>;
  save(dto: Partial<AuthCodeModel>): Promise<AuthCodeModel>;
}
