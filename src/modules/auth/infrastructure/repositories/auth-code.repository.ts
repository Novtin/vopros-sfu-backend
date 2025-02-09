import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthCodeModel } from '../../domain/models/auth-code.model';
import { AuthCodeEntity } from '../entities/auth-code.entity';
import { IAuthCodeRepositories } from '../../domain/interfaces/i-auth-code-repositories';

@Injectable()
export class AuthCodeRepository implements IAuthCodeRepositories {
  constructor(
    @InjectRepository(AuthCodeEntity)
    private readonly dbRepository: Repository<AuthCodeModel>,
  ) {}

  getOneBy(dto: Partial<AuthCodeModel>) {
    return this.dbRepository.findOneBy(dto);
  }

  async save(dto: Partial<AuthCodeModel>) {
    const model = await this.dbRepository.save(dto);
    return this.dbRepository.findOne({
      where: { id: model.id },
      relations: ['user'],
    });
  }
}
