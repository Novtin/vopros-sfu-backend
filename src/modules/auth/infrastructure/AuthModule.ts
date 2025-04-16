import { forwardRef, Global, Module } from '@nestjs/common';
import { AuthJwtGuard } from './guards/AuthJwtGuard';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthTokenService } from '../domain/services/AuthTokenService';
import { AuthController } from './controllers/AuthController';
import { UserModule } from '../../user/infrastructure/UserModule';
import { HashService } from './services/HashService';
import { AuthService } from '../domain/services/AuthService';
import { AuthRolesGuard } from './guards/AuthRolesGuard';
import { IJwtService } from '../domain/interfaces/IJwtService';
import { IHashService } from '../domain/interfaces/IHashService';
import { PassportModule } from '@nestjs/passport';
import { AuthJwtStrategy } from './strategies/AuthJwtStrategy';
import { AuthCodeController } from './controllers/AuthCodeController';
import { AuthCodeService } from '../domain/services/AuthCodeService';
import { IAuthCodeRepository } from '../domain/interfaces/IAuthCodeRepository';
import { AuthCodeRepository } from './repositories/AuthCodeRepository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthCodeEntity } from './entities/AuthCodeEntity';
import { AuthLoginEntity } from './entities/AuthLoginEntity';
import { AuthLoginService } from '../domain/services/AuthLoginService';
import { IAuthLoginRepository } from '../domain/interfaces/IAuthLoginRepository';
import { AuthLoginRepository } from './repositories/AuthLoginRepository';
import { AuthOptionalJwtGuard } from './guards/AuthOptionalJwtGuard';

@Global()
@Module({
  imports: [
    forwardRef(() => UserModule),
    JwtModule,
    PassportModule,
    TypeOrmModule.forFeature([AuthCodeEntity, AuthLoginEntity]),
  ],
  controllers: [AuthController, AuthCodeController],
  providers: [
    {
      provide: IJwtService,
      useClass: JwtService,
    },
    {
      provide: IHashService,
      useClass: HashService,
    },
    {
      provide: IAuthCodeRepository,
      useClass: AuthCodeRepository,
    },
    {
      provide: IAuthLoginRepository,
      useClass: AuthLoginRepository,
    },
    AuthJwtGuard,
    AuthOptionalJwtGuard,
    AuthJwtStrategy,
    AuthTokenService,
    AuthService,
    AuthCodeService,
    AuthRolesGuard,
    AuthLoginService,
  ],
  exports: [
    AuthJwtGuard,
    AuthOptionalJwtGuard,
    AuthRolesGuard,
    AuthTokenService,
    IHashService,
  ],
})
export class AuthModule {}
