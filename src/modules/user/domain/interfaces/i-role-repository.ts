import { SearchRoleDto } from '../dtos/search-role.dto';
import { RoleEntity } from '../entities/role.entity';
import { ExistRoleDto } from '../dtos/exist-role.dto';

export const IRoleRepository = 'IRoleRepository';

export interface IRoleRepository {
  getOneBy(dto: SearchRoleDto): Promise<RoleEntity>;
  existBy(dto: ExistRoleDto): Promise<boolean>;
}
