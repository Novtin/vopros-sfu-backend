import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { UserRepository } from './repositories/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { RoleEntity } from './entities/role.entity';
import { RoleRepository } from './repositories/role.repository';
import { RoleService } from './services/role.service';
import { UniqueUserEmailValidator } from './validators/unique-user-email.validator';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, RoleEntity])],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    RoleRepository,
    RoleService,
    UniqueUserEmailValidator,
  ],
  exports: [UserService, RoleService],
})
export class UserModule {}
