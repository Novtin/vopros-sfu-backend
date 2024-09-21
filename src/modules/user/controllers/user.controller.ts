import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { TransformInterceptor } from '../../../common/interceptors/transform.interceptor';
import { UserSchema } from '../schemas/user.schema';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserEntity } from '../entities/user.entity';

@Controller('/user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/:id')
  @ApiOkResponse({ type: UserSchema })
  @UseInterceptors(new TransformInterceptor(UserSchema))
  getById(@Param('id', ParseIntPipe) id: number): Promise<UserEntity> {
    return this.userService.getBy({ id });
  }
}
