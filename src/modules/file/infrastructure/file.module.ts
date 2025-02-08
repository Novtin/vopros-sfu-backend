import { forwardRef, Module } from '@nestjs/common';
import { FileService } from '../domain/services/file.service';
import { FileRepository } from './repositories/file.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileController } from './controllers/file.controller';
import { UserModule } from '../../user/infrastructure/user.module';
import { IFileRepository } from '../domain/interfaces/i-file-repository';
import { FileEntity } from './entities/file.entity';
import { IFileStorageRepository } from '../domain/interfaces/i-file-storage-repository';
import { FileLocalStorageRepository } from './repositories/file-local-storage.repository';

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
