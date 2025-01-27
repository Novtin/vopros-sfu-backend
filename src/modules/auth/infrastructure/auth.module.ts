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

@Global()
@Module({
  imports: [forwardRef(() => UserModule), JwtModule, PassportModule],
  controllers: [AuthController],
  providers: [
    {
      provide: IJwtService,
      useClass: JwtService,
    },
    {
      provide: IHashService,
      useClass: HashService,
    },
    JwtAuthGuard,
    JwtStrategy,
    TokenService,
    AuthService,
    RolesAuthGuard,
  ],
  exports: [JwtAuthGuard, RolesAuthGuard, TokenService, IHashService],
})
export class AuthModule {}
