import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IAuthLoginRepository } from '../../domain/interfaces/i-auth-login.repository';
import { AuthLoginEntity } from '../entities/auth-login.entity';
import { AuthLoginModel } from '../../domain/models/auth-login.model';

@Injectable()
export class AuthLoginRepository implements IAuthLoginRepository {
  constructor(
    @InjectRepository(AuthLoginEntity)
    private readonly dbRepository: Repository<AuthLoginModel>,
  ) {}

  getOneBy(dto: Partial<AuthLoginModel>) {
    return this.dbRepository.findOneBy(dto);
  }

  async save(dto: Partial<AuthLoginModel>) {
    const model = await this.dbRepository.save(dto);
    return this.dbRepository.findOne({
      where: { id: model.id },
      relations: ['user'],
    });
  }
}
