import { Module } from '@nestjs/common';
import { TagService } from '../domain/services/TagService';
import { TagRepository } from './repositories/TagRepository';
import { TagController } from './controllers/TagController';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ITagRepository } from '../domain/interfaces/ITagRepository';
import { TagEntity } from './entities/TagEntity';

@Module({
  imports: [TypeOrmModule.forFeature([TagEntity])],
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
