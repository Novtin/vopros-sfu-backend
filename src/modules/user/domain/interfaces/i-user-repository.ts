import { ExistUserDto } from '../dtos/exist-user.dto';
import { SaveUserDto } from '../dtos/save-user.dto';
import { UserEntity } from '../entities/user.entity';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { SearchUserDto } from '../dtos/search-user.dto';

export const IUserRepository = 'IUserRepository';

export interface IUserRepository {
  existBy(dto: ExistUserDto): Promise<boolean>;
  create(dto: SaveUserDto): Promise<UserEntity>;
  update(id: number, dto: UpdateUserDto): Promise<UserEntity>;
  existBy(dto: ExistUserDto): Promise<boolean>;
  confirmEmail(id: number): Promise<UserEntity>;
  getOneBy(dto: Partial<UserEntity>): Promise<UserEntity>;
  search(dto: SearchUserDto): Promise<[UserEntity[], number]>;
}
