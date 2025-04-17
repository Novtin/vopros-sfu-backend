import { UserModel } from '../models/UserModel';
import { UserSearchDto } from '../dtos/UserSearchDto';

export const IUserRepository = 'IUserRepository';

export interface IUserRepository {
  existBy(dto: Partial<UserModel>): Promise<boolean>;
  create(dto: Partial<UserModel>): Promise<UserModel>;
  update(id: number, dto: Partial<UserModel>): Promise<UserModel>;
  getOneBy(dto: Partial<UserModel>): Promise<UserModel>;
  search(dto: UserSearchDto): Promise<[UserModel[], number]>;
  delete(id: number): Promise<void>;
  restore(id: number): Promise<void>;
}
