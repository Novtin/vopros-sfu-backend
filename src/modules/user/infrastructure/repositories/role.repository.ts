import { RoleModel } from '../../domain/models/role.model';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SearchRoleDto } from '../../domain/dtos/search-role.dto';
import { ExistRoleDto } from '../../domain/dtos/exist-role.dto';
import { IRoleRepository } from '../../domain/interfaces/i-role-repository';
import { RoleEntity } from '../entities/role.entity';

@Injectable()
export class RoleRepository implements IRoleRepository {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly dbRepository: Repository<RoleModel>,
  ) {}

  getOneBy(dto: SearchRoleDto): Promise<RoleModel> {
    return this.dbRepository.createQueryBuilder().where(dto).take(1).getOne();
  }

  existBy(dto: ExistRoleDto): Promise<boolean> {
    return this.dbRepository.existsBy({ ...dto });
  }
}
