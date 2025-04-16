import { Inject, Injectable } from '@nestjs/common';
import { RoleSearchDto } from '../dtos/RoleSearchDto';
import { RoleModel } from '../models/RoleModel';
import { RoleExistDto } from '../dtos/RoleExistDto';
import { IRoleRepository } from '../interfaces/IRoleRepository';
import { NotFoundException } from '../../../global/domain/exceptions/NotFoundException';

@Injectable()
export class RoleService {
  constructor(
    @Inject(IRoleRepository)
    private readonly roleRepository: IRoleRepository,
  ) {}

  async getOneBy(dto: RoleSearchDto): Promise<RoleModel> {
    if (!(await this.existBy(dto))) {
      throw new NotFoundException();
    }
    return this.roleRepository.getOneBy(dto);
  }

  existBy(dto: RoleExistDto): Promise<boolean> {
    return this.roleRepository.existBy(dto);
  }
}
