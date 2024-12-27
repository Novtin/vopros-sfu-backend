import { Inject, Injectable } from '@nestjs/common';
import { SearchRoleDto } from '../dtos/search-role.dto';
import { RoleModel } from '../models/role.model';
import { ExistRoleDto } from '../dtos/exist-role.dto';
import { IRoleRepository } from '../interfaces/i-role-repository';
import { NotFoundException } from '../../../global/domain/exceptions/not-found.exception';

@Injectable()
export class RoleService {
  constructor(
    @Inject(IRoleRepository)
    private readonly roleRepository: IRoleRepository,
  ) {}

  async getOneBy(dto: SearchRoleDto): Promise<RoleModel> {
    if (!(await this.existBy(dto))) {
      throw new NotFoundException();
    }
    return this.roleRepository.getOneBy(dto);
  }

  existBy(dto: ExistRoleDto): Promise<boolean> {
    return this.roleRepository.existBy(dto);
  }
}
