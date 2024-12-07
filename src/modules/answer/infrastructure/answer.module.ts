import { Module } from '@nestjs/common';
import { AnswerService } from '../domain/services/answer.service';
import { AnswerRepository } from './repositories/answer.repository';
import { QuestionModule } from '../../question/infrastructure/question.module';
import { UserModule } from '../../user/infrastructure/user.module';
import { AnswerController } from './controllers/answer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnswerEntity } from '../domain/entities/answer.entity';
import { AnswerRatingEntity } from '../domain/entities/answer-rating.entity';
import { AnswerRatingRepository } from './repositories/answer-rating.repository';
import { IAnswerRepository } from '../domain/interfaces/i-answer-repository';
import { IAnswerRatingRepository } from '../domain/interfaces/i-answer-rating-repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([AnswerEntity, AnswerRatingEntity]),
    QuestionModule,
    UserModule,
  ],
  providers: [
    AnswerService,
    {
      provide: IAnswerRepository,
      useClass: AnswerRepository,
    },
    {
      provide: IAnswerRatingRepository,
      useClass: AnswerRatingRepository,
    },
  ],
  controllers: [AnswerController],
  exports: [AnswerService],
})
export class AnswerModule {}
