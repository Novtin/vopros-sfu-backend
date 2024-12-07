import { forwardRef, Module } from '@nestjs/common';
import { FileService } from '../domain/services/file.service';
import { FileRepository } from './repositories/file.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from '../domain/entities/file.entity';
import { FileController } from './controllers/file.controller';
import { UserModule } from '../../user/infrastructure/user.module';
import { IFileRepository } from '../domain/interfaces/i-file-repository';

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
    FileService,
  ],
  exports: [FileService],
})
export class FileModule {}
