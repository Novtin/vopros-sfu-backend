import { RoleSearchDto } from '../dtos/RoleSearchDto';
import { RoleModel } from '../models/RoleModel';
import { RoleExistDto } from '../dtos/RoleExistDto';

export const IRoleRepository = 'IRoleRepository';

export interface IRoleRepository {
  getOneBy(dto: RoleSearchDto): Promise<RoleModel>;
  existBy(dto: RoleExistDto): Promise<boolean>;
}
