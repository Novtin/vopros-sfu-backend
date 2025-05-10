import { Module } from '@nestjs/common';
import { TagService } from '../domain/services/TagService';
import { TagRepository } from './repositories/TagRepository';
import { TagController } from './controllers/TagController';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ITagRepository } from '../domain/interfaces/ITagRepository';
import { TagEntity } from './entities/TagEntity';
import { ITagFavoriteRepository } from '../domain/interfaces/ITagFavoriteRepository';
import { TagFavoriteRepository } from './repositories/TagFavoriteRepository';
import { TagFavoriteService } from '../domain/services/TagFavoriteService';
import { TagFavoriteEntity } from './entities/TagFavoriteEntity';

@Module({
  imports: [TypeOrmModule.forFeature([TagEntity, TagFavoriteEntity])],
  controllers: [TagController],
  providers: [
    {
      provide: ITagRepository,
      useClass: TagRepository,
    },
    {
      provide: ITagFavoriteRepository,
      useClass: TagFavoriteRepository,
    },
    TagService,
    TagFavoriteService,
  ],
  exports: [TagService],
})
export class TagModule {}
