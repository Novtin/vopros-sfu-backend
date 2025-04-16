import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './modules/AppModule';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { HttpAppExceptionFilter } from './modules/global/infrastructure/filters/HttpAppExceptionFilter';

let url: string;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api/v1');
  const config = app.get(ConfigService);
  url = `http://${config.get<string>('http.host')}:${config.get<string>('http.port')}`;
  const configSwagger = new DocumentBuilder()
    .setTitle(`ВопроСФУ`)
    .setDescription('API Documentation')
    .addServer(url)
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('/api/v1/docs', app, document);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new HttpAppExceptionFilter(httpAdapterHost.httpAdapter));
  app.enableCors({
    origin: config.get<string>('http.frontendUrl'),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Access-Control-Allow-Credentials',
    ],
    credentials: true,
  });

  await app.listen(config.get<string>('http.port'));
}
bootstrap()
  .then(() => console.log(`Server started on ${url}`))
  .catch((error) => console.error(`Failed start: ${error.message}`));
