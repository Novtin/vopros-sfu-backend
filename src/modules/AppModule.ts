import { Module } from '@nestjs/common';
import { UserModule } from './user/infrastructure/UserModule';
import { ConfigModule, ConfigService } from '@nestjs/config';
import jwtConfig from '../config/JwtConfig';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeOrmConfig from '../config/TypeormConfig';
import httpConfig from '../config/HttpConfig';
import { AuthModule } from './auth/infrastructure/AuthModule';
import { QuestionModule } from './question/infrastructure/QuestionModule';
import { MailerModule } from '@nestjs-modules/mailer';
import mailerConfig from '../config/MailerConfig';
import { AnswerModule } from './answer/infrastructure/AnswerModule';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationModule } from './notification/infrastructure/NotificationModule';
import { GlobalModule } from './global/infrastructure/GlobalModule';
import { EventEmitterModule } from '@nestjs/event-emitter';
import fileLocalConfig from '../config/FileLocalConfig';
import authCodeConfig from '../config/AuthCodeConfig';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        typeOrmConfig,
        jwtConfig,
        httpConfig,
        mailerConfig,
        fileLocalConfig,
        authCodeConfig,
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
