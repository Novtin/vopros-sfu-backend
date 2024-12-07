import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { SearchRoleDto } from '../dtos/search-role.dto';
import { RoleEntity } from '../entities/role.entity';
import { ExistRoleDto } from '../dtos/exist-role.dto';
import { IRoleRepository } from '../interfaces/i-role-repository';

@Injectable()
export class RoleService {
  constructor(
    @Inject(IRoleRepository)
    private readonly roleRepository: IRoleRepository,
  ) {}

  async getOneBy(dto: SearchRoleDto): Promise<RoleEntity> {
    if (!(await this.existBy(dto))) {
      throw new NotFoundException();
    }
    return this.roleRepository.getOneBy(dto);
  }

  existBy(dto: ExistRoleDto): Promise<boolean> {
    return this.roleRepository.existBy(dto);
  }
}
