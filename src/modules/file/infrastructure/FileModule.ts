import { forwardRef, Module } from '@nestjs/common';
import { FileService } from '../domain/services/FileService';
import { FileRepository } from './repositories/FileRepository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileController } from './controllers/FileController';
import { UserModule } from '../../user/infrastructure/UserModule';
import { IFileRepository } from '../domain/interfaces/IFileRepository';
import { FileEntity } from './entities/FileEntity';
import { IFileStorageRepository } from '../domain/interfaces/IFileStorageRepository';
import { FileLocalStorageRepository } from './repositories/FileLocalStorageRepository';

@Module({
  imports: [
    TypeOrmModule.forFeature([FileEntity]),
    forwardRef(() => UserModule),
  ],
  controllers: [FileController],
  providers: [
    {
      provide: IFileRepository,
      useClass: FileRepository,
    },
    {
      provide: IFileStorageRepository,
      useClass: FileLocalStorageRepository,
    },
    FileService,
  ],
  exports: [FileService],
})
export class FileModule {}
