import { RoleEntity } from '../../domain/entities/role.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SearchRoleDto } from '../../domain/dtos/search-role.dto';
import { ExistRoleDto } from '../../domain/dtos/exist-role.dto';
import { IRoleRepository } from '../../domain/interfaces/i-role-repository';

@Injectable()
export class RoleRepository implements IRoleRepository {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly dbRepository: Repository<RoleEntity>,
  ) {}

  getOneBy(dto: SearchRoleDto): Promise<RoleEntity> {
    return this.dbRepository.createQueryBuilder().where(dto).limit(1).getOne();
  }

  existBy(dto: ExistRoleDto): Promise<boolean> {
    return this.dbRepository.existsBy({ ...dto });
  }
}
