import { forwardRef, Global, Module } from '@nestjs/common';
import { UserService } from '../domain/services/user.service';
import { UserController } from './controllers/user.controller';
import { UserRepository } from './repositories/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleRepository } from './repositories/role.repository';
import { RoleService } from '../domain/services/role.service';
import { UniqueUserEmailValidator } from '../domain/validators/unique-user-email.validator';
import { AuthModule } from '../../auth/infrastructure/auth.module';
import { FileModule } from '../../file/infrastructure/file.module';
import { IUserRepository } from '../domain/interfaces/i-user-repository';
import { IRoleRepository } from '../domain/interfaces/i-role-repository';
import { UserEntity } from './entities/user.entity';
import { RoleEntity } from './entities/role.entity';
import { UniqueUserNicknameValidator } from '../domain/validators/unique-user-nickname';
import { UserEventService } from './services/user-event.service';

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
    UniqueUserEmailValidator,
    UniqueUserNicknameValidator,
    UserEventService,
  ],
  exports: [UserService, RoleService],
})
export class UserModule {}
