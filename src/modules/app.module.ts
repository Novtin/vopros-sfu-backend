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
import { GlobalModule } from './global/infrastructure/global.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import fileLocalConfig from '../config/file-local.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        typeOrmConfig,
        jwtConfig,
        httpConfig,
        mailerConfig,
        redisConfig,
        fileLocalConfig,
      ],
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
    EventEmitterModule.forRoot(),
    GlobalModule,
    UserModule,
    AuthModule,
    QuestionModule,
    AnswerModule,
    NotificationModule,
  ],
})
export class AppModule {}
