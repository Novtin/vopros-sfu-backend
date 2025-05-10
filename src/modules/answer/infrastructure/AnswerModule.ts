import { Module } from '@nestjs/common';
import { AnswerRepository } from './repositories/AnswerRepository';
import { QuestionModule } from '../../question/infrastructure/QuestionModule';
import { AnswerController } from './controllers/AnswerController';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnswerRatingRepository } from './repositories/AnswerRatingRepository';
import { AnswerEntity } from './entities/AnswerEntity';
import { AnswerRatingEntity } from './entities/AnswerRatingEntity';
import { IAnswerRepository } from '../domain/interfaces/IAnswerRepository';
import { AnswerService } from '../domain/services/AnswerService';
import { IAnswerRatingRepository } from '../domain/interfaces/IAnswerRatingRepository';
import { AnswerRatingService } from '../domain/services/AnswerRatingService';
import { AnswerRatingController } from './controllers/AnswerRatingController';

@Module({
  imports: [
    TypeOrmModule.forFeature([AnswerEntity, AnswerRatingEntity]),
    QuestionModule,
  ],
  providers: [
    AnswerService,
    AnswerRatingService,
    {
      provide: IAnswerRepository,
      useClass: AnswerRepository,
    },
    {
      provide: IAnswerRatingRepository,
      useClass: AnswerRatingRepository,
    },
  ],
  controllers: [AnswerController, AnswerRatingController],
  exports: [AnswerService],
})
export class AnswerModule {}
