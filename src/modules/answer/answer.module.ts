import { Module } from '@nestjs/common';
import { AnswerService } from './services/answer.service';
import { AnswerRepository } from './repositories/answer.repository';
import { QuestionModule } from '../question/question.module';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { AnswerController } from './controllers/answer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnswerEntity } from './entities/answer.entity';
import { AnswerRatingEntity } from './entities/answer-rating.entity';
import { AnswerRatingRepository } from './repositories/answer-rating.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([AnswerEntity, AnswerRatingEntity]),
    QuestionModule,
    AuthModule,
    UserModule,
  ],
  providers: [AnswerService, AnswerRepository, AnswerRatingRepository],
  controllers: [AnswerController],
  exports: [AnswerService],
})
export class AnswerModule {}
