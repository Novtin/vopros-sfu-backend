import { Module } from '@nestjs/common';
import { UserModule } from './user/infrastructure/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import jwtConfig from '../config/jwt.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeOrmConfig from '../config/typeorm.config';
import httpConfig from '../config/http.config';
import { AuthModule } from './auth/infrastructure/auth.module';
import { QuestionModule } from './question/infrastructure/question.module';
import { MailerModule } from '@nestjs-modules/mailer';
import mailerConfig from '../config/mailer.config';
import { AnswerModule } from './answer/infrastructure/answer.module';
import redisConfig from '../config/redis.config';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationModule } from './notification/infrastructure/notification.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeOrmConfig, jwtConfig, httpConfig, mailerConfig, redisConfig],
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get('typeorm'),
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => configService.get('mailer'),
    }),
    ScheduleModule.forRoot(),
    UserModule,
    AuthModule,
    QuestionModule,
    AnswerModule,
    NotificationModule,
  ],
})
export class AppModule {}
