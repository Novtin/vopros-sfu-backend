import {
  BadRequestException,
  Controller,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { TransformInterceptor } from '../../../common/interceptors/transform.interceptor';
import { UserSchema } from '../schemas/user.schema';
import { ApiBody, ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserEntity } from '../entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerImageOptions } from '../../../config/multer-image.config';
import { ContextDto } from '../../auth/dtos/context.dto';
import { Context } from '../../auth/decorators/context.decorator';
import { Authorized } from '../../auth/decorators/authorized.decorator';
import { RoleEnum } from '../enum/role.enum';

@Controller('/user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/:id')
  @ApiOkResponse({ type: UserSchema })
  @UseInterceptors(new TransformInterceptor(UserSchema))
  getById(@Param('id', ParseIntPipe) id: number): Promise<UserEntity> {
    return this.userService.getOneBy({ id });
  }

  @Authorized(...Object.values(RoleEnum))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      properties: {
        imageFile: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('imageFile', multerImageOptions),
    new TransformInterceptor(UserSchema),
  )
  @Post('/:id/image')
  uploadAvatar(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() imageFile: Express.Multer.File,
    @Context() context: ContextDto,
  ) {
    if (!imageFile) {
      throw new BadRequestException('Файл не найден');
    }
    if (!context.roles.includes(RoleEnum.ADMIN)) {
      if (context.userId !== id) {
        throw new ForbiddenException();
      }
    }
    return this.userService.uploadAvatar(id, imageFile);
  }
}
