import { Module } from '@nestjs/common';
import { TagService } from '../domain/services/tag.service';
import { TagRepository } from './repositories/tag.repository';
import { TagController } from './controllers/tag.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagEntity } from '../domain/entities/tag.entity';
import { UserModule } from '../../user/infrastructure/user.module';
import { ITagRepository } from '../domain/interfaces/i-tag-repository';

@Module({
  imports: [TypeOrmModule.forFeature([TagEntity]), UserModule],
  controllers: [TagController],
  providers: [
    {
      provide: ITagRepository,
      useClass: TagRepository,
    },
    TagService,
  ],
  exports: [TagService],
})
export class TagModule {}