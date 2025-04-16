import { AuthCodeModel } from '../models/AuthCodeModel';

export const IAuthCodeRepository = 'IAuthCodeRepository';

export interface IAuthCodeRepository {
  getOneBy(dto: Partial<AuthCodeModel>): Promise<AuthCodeModel>;
  save(dto: Partial<AuthCodeModel>): Promise<AuthCodeModel>;
}
