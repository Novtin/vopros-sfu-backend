import { forwardRef, Module } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './services/token.service';
import { AuthController } from './controllers/auth.controller';
import { UserModule } from '../user/user.module';
import { HashService } from './services/hash.service';
import { AuthService } from './services/auth.service';

@Module({
  imports: [forwardRef(() => UserModule), JwtModule],
  controllers: [AuthController],
  providers: [JwtAuthGuard, TokenService, HashService, AuthService],
  exports: [JwtAuthGuard],
})
export class AuthModule {}