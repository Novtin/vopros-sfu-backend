import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserService } from '../../../user/domain/services/user.service';
import { TokenService } from '../../domain/services/token.service';
import { IJwtPayload } from '../../domain/interfaces/jwt.payload.interface';
import { TokenEnum } from '../../domain/enums/token.enum';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    if (req.headers.authorization) {
      const payload: IJwtPayload = await this.tokenService.verify(
        // Токен приходит в виде 'Bearer <JWT>'
        req.headers.authorization.split(' ')[1],
        TokenEnum.ACCESS,
      );
      if (payload) {
        const isUserExistsByEmail: boolean = await this.userService.existBy({
          email: payload.email,
        });
        if (isUserExistsByEmail) {
          req.user = {
            userId: payload.userId,
            email: payload.email,
            roles: payload.roles,
          };
          return true;
        }
      }
    }
    return false;
  }
}
