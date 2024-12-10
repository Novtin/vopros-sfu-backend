import { SearchRoleDto } from '../dtos/search-role.dto';
import { RoleModel } from '../models/role.model';
import { ExistRoleDto } from '../dtos/exist-role.dto';

export const IRoleRepository = 'IRoleRepository';

export interface IRoleRepository {
  getOneBy(dto: SearchRoleDto): Promise<RoleModel>;
  existBy(dto: ExistRoleDto): Promise<boolean>;
}
