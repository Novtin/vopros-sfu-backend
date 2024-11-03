import { Module } from '@nestjs/common';
import { QuestionService } from './services/question.service';
import { QuestionController } from './controllers/question.controller';
import { QuestionRepository } from './repositories/question.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionEntity } from './entities/question.entity';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { FileModule } from '../file/file.module';
import { TagModule } from '../tag/tag.module';
import { QuestionViewEntity } from './entities/question-view.entity';
import { QuestionViewRepository } from './repositories/question-view.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([QuestionEntity, QuestionViewEntity]),
    AuthModule,
    UserModule,
    FileModule,
    TagModule,
  ],
  controllers: [QuestionController],
  providers: [QuestionService, QuestionRepository, QuestionViewRepository],
  exports: [QuestionService],
})
export class QuestionModule {}
