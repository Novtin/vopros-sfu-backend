import { Module } from '@nestjs/common';
import { AnswerService } from './services/answer.service';
import { AnswerRepository } from './repositories/answer.repository';
import { QuestionModule } from '../question/question.module';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { AnswerController } from './controllers/answer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnswerEntity } from './entities/answer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AnswerEntity]),
    QuestionModule,
    AuthModule,
    UserModule,
  ],
  providers: [AnswerService, AnswerRepository],
  controllers: [AnswerController],
  exports: [AnswerService],
})
export class AnswerModule {}
