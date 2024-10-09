import { RoleEntity } from '../entities/role.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SearchRoleDto } from '../dtos/search-role.dto';
import { ExistRoleDto } from '../dtos/exist-role.dto';

@Injectable()
export class RoleRepository {
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
