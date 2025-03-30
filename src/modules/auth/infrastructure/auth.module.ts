import { forwardRef, Global, Module } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthTokenService } from '../domain/services/auth-token.service';
import { AuthController } from './controllers/auth.controller';
import { UserModule } from '../../user/infrastructure/user.module';
import { HashService } from './services/hash.service';
import { AuthService } from '../domain/services/auth.service';
import { RolesAuthGuard } from './guards/roles-auth.guard';
import { IJwtService } from '../domain/interfaces/i-jwt-service';
import { IHashService } from '../domain/interfaces/i-hash-service';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthCodeController } from './controllers/auth-code.controller';
import { AuthCodeService } from '../domain/services/auth-code.service';
import { IAuthCodeRepository } from '../domain/interfaces/i-auth-code-repository';
import { AuthCodeRepository } from './repositories/auth-code.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthCodeEntity } from './entities/auth-code.entity';
import { AuthLoginEntity } from './entities/auth-login.entity';
import { AuthLoginService } from '../domain/services/auth-login.service';
import { IAuthLoginRepository } from '../domain/interfaces/i-auth-login.repository';
import { AuthLoginRepository } from './repositories/auth-login.repository';
import { OptionalJwtAuthGuard } from './guards/optional-jwt-auth.guard';

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
    JwtAuthGuard,
    OptionalJwtAuthGuard,
    JwtStrategy,
    AuthTokenService,
    AuthService,
    AuthCodeService,
    RolesAuthGuard,
    AuthLoginService,
  ],
  exports: [
    JwtAuthGuard,
    OptionalJwtAuthGuard,
    RolesAuthGuard,
    AuthTokenService,
    IHashService,
  ],
})
export class AuthModule {}
