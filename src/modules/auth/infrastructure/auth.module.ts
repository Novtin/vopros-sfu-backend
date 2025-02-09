import { forwardRef, Global, Module } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TokenService } from '../domain/services/token.service';
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
import { IAuthCodeRepositories } from '../domain/interfaces/i-auth-code-repositories';
import { AuthCodeRepository } from './repositories/auth-code.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthCodeEntity } from './entities/auth-code.entity';

@Global()
@Module({
  imports: [
    forwardRef(() => UserModule),
    JwtModule,
    PassportModule,
    TypeOrmModule.forFeature([AuthCodeEntity]),
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
      provide: IAuthCodeRepositories,
      useClass: AuthCodeRepository,
    },
    JwtAuthGuard,
    JwtStrategy,
    TokenService,
    AuthService,
    AuthCodeService,
    RolesAuthGuard,
  ],
  exports: [JwtAuthGuard, RolesAuthGuard, TokenService, IHashService],
})
export class AuthModule {}
