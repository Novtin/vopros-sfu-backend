import { Module } from '@nestjs/common';
import { QuestionService } from '../domain/services/question.service';
import { QuestionController } from './controllers/question.controller';
import { QuestionRepository } from './repositories/question.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionEntity } from '../domain/entities/question.entity';
import { UserModule } from '../../user/infrastructure/user.module';
import { FileModule } from '../../file/infrastructure/file.module';
import { TagModule } from '../../tag/infrastructure/tag.module';
import { QuestionViewEntity } from '../domain/entities/question-view.entity';
import { QuestionViewRepository } from './repositories/question-view.repository';
import { QuestionRatingEntity } from '../domain/entities/question-rating.entity';
import { QuestionRatingRepository } from './repositories/question-rating.repository';
import { QuestionFavoriteRepository } from './repositories/question-favorite.repository';
import { QuestionFavoriteEntity } from '../domain/entities/question-favorite.entity';
import { IQuestionRatingRepository } from '../domain/interfaces/i-question-rating-repository';
import { IQuestionViewRepository } from '../domain/interfaces/i-question-view-repository';
import { IQuestionFavoriteRepository } from '../domain/interfaces/i-question-favorite-repository';
import { IQuestionRepository } from '../domain/interfaces/i-question-repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      QuestionEntity,
      QuestionViewEntity,
      QuestionRatingEntity,
      QuestionFavoriteEntity,
    ]),
    UserModule,
    FileModule,
    TagModule,
  ],
  controllers: [QuestionController],
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
  ],
  exports: [QuestionService],
})
export class QuestionModule {}