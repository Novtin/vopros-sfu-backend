import { Injectable, NotFoundException } from '@nestjs/common';
import { RoleRepository } from '../repositories/role.repository';
import { SearchRoleDto } from '../dtos/search-role.dto';
import { RoleEntity } from '../entities/role.entity';
import { ExistRoleDto } from '../dtos/exist-role.dto';

@Injectable()
export class RoleService {
  constructor(private readonly roleRepository: RoleRepository) {}

  async getBy(dto: SearchRoleDto): Promise<RoleEntity> {
    if (!(await this.existBy(dto))) {
      throw new NotFoundException();
    }
    return this.roleRepository.getBy(dto);
  }

  existBy(dto: ExistRoleDto): Promise<boolean> {
    return this.roleRepository.existBy(dto);
  }
}
