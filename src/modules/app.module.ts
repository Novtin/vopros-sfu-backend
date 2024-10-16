import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import jwtConfig from '../config/jwt.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeOrmConfig from '../config/typeorm.config';
import httpConfig from '../config/http.config';
import { AuthModule } from './auth/auth.module';
import { QuestionModule } from './question/question.module';
import { MailerModule } from '@nestjs-modules/mailer';
import mailerConfig from '../config/mailer.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeOrmConfig, jwtConfig, httpConfig, mailerConfig],
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
      useFactory: (configService: ConfigService) =>
          configService.get('mailer'),
    }),
    UserModule,
    AuthModule,
    QuestionModule,
  ],
})
export class AppModule {}
