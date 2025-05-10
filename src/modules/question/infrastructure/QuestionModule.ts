import { Module } from '@nestjs/common';
import { QuestionService } from '../domain/services/QuestionService';
import { QuestionController } from './controllers/QuestionController';
import { QuestionRepository } from './repositories/QuestionRepository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileModule } from '../../file/infrastructure/FileModule';
import { TagModule } from '../../tag/infrastructure/TagModule';
import { QuestionViewRepository } from './repositories/QuestionViewRepository';
import { QuestionRatingRepository } from './repositories/QuestionRatingRepository';
import { QuestionFavoriteRepository } from './repositories/QuestionFavoriteRepository';
import { IQuestionRatingRepository } from '../domain/interfaces/IQuestionRatingRepository';
import { IQuestionViewRepository } from '../domain/interfaces/IQuestionViewRepository';
import { IQuestionFavoriteRepository } from '../domain/interfaces/IQuestionFavoriteRepository';
import { IQuestionRepository } from '../domain/interfaces/IQuestionRepository';
import { QuestionEntity } from './entities/QuestionEntity';
import { QuestionViewEntity } from './entities/QuestionViewEntity';
import { QuestionRatingEntity } from './entities/QuestionRatingEntity';
import { QuestionFavoriteEntity } from './entities/QuestionFavoriteEntity';
import { NotificationModule } from '../../notification/infrastructure/NotificationModule';
import { QuestionRatingService } from '../domain/services/QuestionRatingService';
import { QuestionFavoriteService } from '../domain/services/QuestionFavoriteService';
import { QuestionFavoriteController } from './controllers/QuestionFavoriteController';
import { QuestionRatingController } from './controllers/QuestionRatingController';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      QuestionEntity,
      QuestionViewEntity,
      QuestionRatingEntity,
      QuestionFavoriteEntity,
    ]),
    FileModule,
    TagModule,
    NotificationModule,
  ],
  controllers: [
    QuestionController,
    QuestionFavoriteController,
    QuestionRatingController,
  ],
  providers: [
    {
      provide: IQuestionRepository,
      useClass: QuestionRepository,
    },
    {
      provide: IQuestionFavoriteRepository,
      useClass: QuestionFavoriteRepository,
    },
    {
      provide: IQuestionViewRepository,
      useClass: QuestionViewRepository,
    },
    {
      provide: IQuestionRatingRepository,
      useClass: QuestionRatingRepository,
    },
    QuestionService,
    QuestionRatingService,
    QuestionFavoriteService,
  ],
  exports: [QuestionService],
})
export class QuestionModule {}
