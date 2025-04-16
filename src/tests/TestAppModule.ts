import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import jwtConfig from '../config/JwtConfig';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import typeOrmConfig from '../config/TypeormConfig';
import httpConfig from '../config/HttpConfig';
import fileLocalConfig from '../config/FileLocalConfig';
import authCodeConfig from '../config/AuthCodeConfig';
import { GlobalModule } from '../modules/global/infrastructure/GlobalModule';
import { UserModule } from '../modules/user/infrastructure/UserModule';
import { AuthModule } from '../modules/auth/infrastructure/AuthModule';
import { QuestionModule } from '../modules/question/infrastructure/QuestionModule';
import { AnswerModule } from '../modules/answer/infrastructure/AnswerModule';
import { NotificationModule } from '../modules/notification/infrastructure/NotificationModule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        typeOrmConfig,
        jwtConfig,
        httpConfig,
        fileLocalConfig,
        authCodeConfig,
      ],
      envFilePath: 'test.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService,
      ): Promise<TypeOrmModuleOptions> => ({
        ...(await configService.get('typeorm')),
        logging: false,
      }),
    }),
    GlobalModule,
    UserModule,
    AuthModule,
    QuestionModule,
    AnswerModule,
    NotificationModule,
  ],
})
export class TestAppModule {}
