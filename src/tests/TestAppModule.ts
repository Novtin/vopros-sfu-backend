import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import jwtConfig from '../config/JwtConfig';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import typeOrmConfig from '../config/TypeormConfig';
import fileLocalConfig from '../config/FileLocalConfig';
import authCodeConfig from '../config/AuthCodeConfig';
import { GlobalModule } from '../modules/global/infrastructure/GlobalModule';
import { UserModule } from '../modules/user/infrastructure/UserModule';
import { AuthModule } from '../modules/auth/infrastructure/AuthModule';
import { QuestionModule } from '../modules/question/infrastructure/QuestionModule';
import { AnswerModule } from '../modules/answer/infrastructure/AnswerModule';
import { NotificationModule } from '../modules/notification/infrastructure/NotificationModule';
import { Client } from 'pg';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeOrmConfig, jwtConfig, fileLocalConfig, authCodeConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService,
      ): Promise<TypeOrmModuleOptions> => {
        const dbConfig = configService.get('typeorm');

        const dbName = 'vopros-test';

        const client = new Client({
          user: dbConfig.username,
          password: dbConfig.password,
          host: dbConfig.host,
          port: dbConfig.port,
          database: 'postgres',
        });

        await client.connect();

        const result = await client.query(
          'SELECT 1 FROM pg_database WHERE datname = $1',
          [dbName],
        );

        if (result.rowCount === 0) {
          await client.query(`CREATE DATABASE "${dbName}"`);
        }

        await client.end();

        return {
          ...dbConfig,
          database: dbName,
          logging: false,
        };
      },
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
