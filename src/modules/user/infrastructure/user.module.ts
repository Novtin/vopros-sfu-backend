import { forwardRef, Module } from '@nestjs/common';
import { UserService } from '../domain/services/user.service';
import { UserController } from './controllers/user.controller';
import { UserRepository } from './repositories/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../domain/entities/user.entity';
import { RoleEntity } from '../domain/entities/role.entity';
import { RoleRepository } from './repositories/role.repository';
import { RoleService } from '../domain/services/role.service';
import { UniqueUserEmailValidator } from './validators/unique-user-email.validator';
import { AuthModule } from '../../auth/infrastructure/auth.module';
import { FileModule } from '../../file/infrastructure/file.module';
import { IUserRepository } from '../domain/interfaces/i-user-repository';
import { IRoleRepository } from '../domain/interfaces/i-role-repository';

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
  ],
  exports: [UserService, RoleService],
})
export class UserModule {}
