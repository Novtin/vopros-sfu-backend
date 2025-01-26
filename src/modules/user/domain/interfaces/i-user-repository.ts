import { ExistUserDto } from '../dtos/exist-user.dto';
import { SaveUserDto } from '../dtos/save-user.dto';
import { UserModel } from '../models/user.model';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { SearchUserDto } from '../dtos/search-user.dto';

export const IUserRepository = 'IUserRepository';

export interface IUserRepository {
  existBy(dto: ExistUserDto): Promise<boolean>;
  create(dto: SaveUserDto): Promise<UserModel>;
  update(id: number, dto: Partial<UserModel>): Promise<UserModel>;
  existBy(dto: ExistUserDto): Promise<boolean>;
  confirmEmail(id: number): Promise<UserModel>;
  getOneBy(dto: Partial<UserModel>): Promise<UserModel>;
  search(dto: SearchUserDto): Promise<[UserModel[], number]>;
  delete(id: number): Promise<void>;
  restore(id: number): Promise<void>;
}
