import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IAuthLoginRepository } from '../../domain/interfaces/IAuthLoginRepository';
import { AuthLoginEntity } from '../entities/AuthLoginEntity';
import { AuthLoginModel } from '../../domain/models/AuthLoginModel';

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

  getLastBy(dto: Partial<AuthLoginModel>) {
    return this.dbRepository.findOne({
      where: dto,
      order: { createdAt: 'DESC' },
    });
  }
}
