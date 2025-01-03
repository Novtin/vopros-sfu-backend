import { forwardRef, Global, Module } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TokenService } from '../domain/services/token.service';
import { AuthController } from './controllers/auth.controller';
import { UserModule } from '../../user/infrastructure/user.module';
import { HashService } from '../domain/services/hash.service';
import { AuthService } from '../domain/services/auth.service';
import { RolesAuthGuard } from './guards/roles-auth.guard';
import { IJwtService } from '../domain/interfaces/i-jwt-service';

@Global()
@Module({
  imports: [forwardRef(() => UserModule), JwtModule],
  controllers: [AuthController],
  providers: [
    {
      provide: IJwtService,
      useClass: JwtService,
    },
    JwtAuthGuard,
    TokenService,
    HashService,
    AuthService,
    RolesAuthGuard,
  ],
  exports: [JwtAuthGuard, RolesAuthGuard, TokenService],
})
export class AuthModule {}
