import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JWT_STRATEGY } from '../strategies/AuthJwtStrategy';

@Injectable()
export class AuthJwtGuard extends AuthGuard(JWT_STRATEGY) {
  handleRequest<T>(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
  ): T {
    if (err || !user) {
      throw new UnauthorizedException('JWT недействителен или истёк');
    }
    return user;
  }
}
