import { forwardRef, Global, Module } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from '../domain/services/token.service';
import { AuthController } from './controllers/auth.controller';
import { UserModule } from '../../user/infrastructure/user.module';
import { HashService } from '../domain/services/hash.service';
import { AuthService } from '../domain/services/auth.service';
import { RolesAuthGuard } from './guards/roles-auth.guard';

@Global()
@Module({
  imports: [forwardRef(() => UserModule), JwtModule],
  controllers: [AuthController],
  providers: [
    JwtAuthGuard,
    TokenService,
    HashService,
    AuthService,
    RolesAuthGuard,
  ],
  exports: [JwtAuthGuard, RolesAuthGuard, TokenService],
})
export class AuthModule {}
