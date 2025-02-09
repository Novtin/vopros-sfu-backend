import { AuthCodeModel } from '../models/auth-code.model';

export const IAuthCodeRepositories = 'IAuthCodeRepositories';

export interface IAuthCodeRepositories {
  getOneBy(dto: Partial<AuthCodeModel>): Promise<AuthCodeModel>;
  save(dto: Partial<AuthCodeModel>): Promise<AuthCodeModel>;
}
