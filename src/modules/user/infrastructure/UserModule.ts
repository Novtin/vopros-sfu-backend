import { forwardRef, Global, Module } from '@nestjs/common';
import { UserService } from '../domain/services/UserService';
import { UserController } from './controllers/UserController';
import { UserRepository } from './repositories/UserRepository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleRepository } from './repositories/RoleRepository';
import { RoleService } from '../domain/services/RoleService';
import { UserEmailUniqueValidator } from '../domain/validators/UserEmailUniqueValidator';
import { AuthModule } from '../../auth/infrastructure/AuthModule';
import { FileModule } from '../../file/infrastructure/FileModule';
import { IUserRepository } from '../domain/interfaces/IUserRepository';
import { IRoleRepository } from '../domain/interfaces/IRoleRepository';
import { UserEntity } from './entities/UserEntity';
import { RoleEntity } from './entities/RoleEntity';
import { UniqueUserNicknameValidator } from '../domain/validators/UserNicknameUniqueValidator';
import { UserEventService } from './services/UserEventService';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, RoleEntity]),
    forwardRef(() => AuthModule),
    FileModule,
  ],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: IUserRepository,
      useClass: UserRepository,
    },
    {
      provide: IRoleRepository,
      useClass: RoleRepository,
    },
    RoleService,
    UserEmailUniqueValidator,
    UniqueUserNicknameValidator,
    UserEventService,
  ],
  exports: [UserService, RoleService],
})
export class UserModule {}
