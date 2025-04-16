import { AuthLoginModel } from '../models/AuthLoginModel';

export const IAuthLoginRepository = 'IAuthLoginRepository';

export interface IAuthLoginRepository {
  getOneBy(dto: Partial<AuthLoginModel>): Promise<AuthLoginModel>;
  getLastBy(dto: Partial<AuthLoginModel>): Promise<AuthLoginModel>;
  save(dto: Partial<AuthLoginModel>): Promise<AuthLoginModel>;
}
