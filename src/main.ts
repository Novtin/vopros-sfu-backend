import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';

let url: string;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api/v1');
  const config = app.get(ConfigService);
  url = `http://${config.get<string>('http.host')}:${config.get<string>('http.port')}/api/v1`;
  const configSwagger = new DocumentBuilder()
    .setTitle(`ВопроСФУ`)
    .setDescription('API Documentation')
    .addServer(url)
    .build();
  const document = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup(`/api/v1/docs`, app, document);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  await app.listen(config.get<string>('http.port'));
}
bootstrap()
  .then(() => console.log(`Server started on ${url}`))
  .catch((error) => console.error(`Failed start: ${error.message}`));
