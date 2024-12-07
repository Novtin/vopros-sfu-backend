import {
  BadRequestException,
  Controller,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from '../../domain/services/user.service';
import { TransformInterceptor } from '../../../../common/interceptors/transform.interceptor';
import { UserSchema } from '../schemas/user.schema';
import { ApiBody, ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserEntity } from '../../domain/entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerImageOptions } from '../../../../config/multer-image.config';
import { ContextDto } from '../../../auth/domain/dtos/context.dto';
import { Context } from '../../../auth/infrastructure/decorators/context.decorator';
import { Authorized } from '../../../auth/infrastructure/decorators/authorized.decorator';
import { RoleEnum } from '../../domain/enum/role.enum';
import { UserDetailSchema } from '../schemas/user-detail.schema';
import { SearchUserDto } from '../../domain/dtos/search-user.dto';

@Authorized()
@Controller('/user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOkResponse({ type: UserDetailSchema })
  @UseInterceptors(new TransformInterceptor(UserDetailSchema))
  search(@Query() dto: SearchUserDto) {
    return this.userService.search(dto);
  }

  @Get('/:id')
  @ApiOkResponse({ type: UserSchema })
  @UseInterceptors(new TransformInterceptor(UserSchema))
  getOneById(@Param('id', ParseIntPipe) id: number): Promise<UserEntity> {
    return this.userService.getOneBy({ id });
  }

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
