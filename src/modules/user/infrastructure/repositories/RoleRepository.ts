import { RoleModel } from '../../domain/models/RoleModel';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleSearchDto } from '../../domain/dtos/RoleSearchDto';
import { RoleExistDto } from '../../domain/dtos/RoleExistDto';
import { IRoleRepository } from '../../domain/interfaces/IRoleRepository';
import { RoleEntity } from '../entities/RoleEntity';

@Injectable()
export class RoleRepository implements IRoleRepository {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly dbRepository: Repository<RoleModel>,
  ) {}

  getOneBy(dto: RoleSearchDto): Promise<RoleModel> {
    return this.dbRepository.createQueryBuilder().where(dto).take(1).getOne();
  }

  existBy(dto: RoleExistDto): Promise<boolean> {
    return this.dbRepository.existsBy({ ...dto });
  }
}
