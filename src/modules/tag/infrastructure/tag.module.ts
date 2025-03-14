import { Module } from '@nestjs/common';
import { TagService } from '../domain/services/tag.service';
import { TagRepository } from './repositories/tag.repository';
import { TagController } from './controllers/tag.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ITagRepository } from '../domain/interfaces/i-tag-repository';
import { TagEntity } from './entities/tag.entity';

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
