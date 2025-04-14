import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import jwtConfig from '../config/jwt.config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import typeOrmConfig from '../config/typeorm.config';
import httpConfig from '../config/http.config';
import fileLocalConfig from '../config/file-local.config';
import authCodeConfig from '../config/auth-code.config';
import { GlobalModule } from '../modules/global/infrastructure/global.module';
import { UserModule } from '../modules/user/infrastructure/user.module';
import { AuthModule } from '../modules/auth/infrastructure/auth.module';
import { QuestionModule } from '../modules/question/infrastructure/question.module';
import { AnswerModule } from '../modules/answer/infrastructure/answer.module';
import { NotificationModule } from '../modules/notification/infrastructure/notification.module';

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
