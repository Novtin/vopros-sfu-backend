import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from '../../domain/services/user.service';
import { TransformInterceptor } from '../../../global/infrastructure/interceptors/transform.interceptor';
import { UserSchema } from '../schemas/user.schema';
import {
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserModel } from '../../domain/models/user.model';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerImageOptions } from '../../../../config/multer-image.config';
import { ContextDto } from '../../../auth/domain/dtos/context.dto';
import { Context } from '../../../auth/infrastructure/decorators/context.decorator';
import { Authorized } from '../../../auth/infrastructure/decorators/authorized.decorator';
import { UserDetailSchema } from '../schemas/user-detail.schema';
import { SearchUserDto } from '../../domain/dtos/search-user.dto';
import { UpdateUserDto } from '../../domain/dtos/update-user.dto';
import { Roles } from '../../../auth/infrastructure/decorators/roles.decorator';
import { RoleEnum } from '../../domain/enum/role.enum';
import { ApiOkPagination } from '../../../global/infrastructure/decorators/api-ok-pagination';

@Authorized()
@Controller('/user')
@ApiTags('Пользователь')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Получить пользователей' })
  @ApiOkPagination({ type: UserDetailSchema })
  @UseInterceptors(new TransformInterceptor(UserDetailSchema))
  search(@Query() dto: SearchUserDto) {
    return this.userService.search(dto);
  }

  @Get('/this')
  @ApiOperation({ summary: 'Получить текущего пользователя' })
  @ApiOkResponse({ type: UserSchema })
  @UseInterceptors(new TransformInterceptor(UserSchema))
  getThis(@Context() context: ContextDto): Promise<UserModel> {
    return this.userService.getOneBy({ id: context.userId });
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Получить пользователя' })
  @ApiOkResponse({ type: UserSchema })
  @UseInterceptors(new TransformInterceptor(UserSchema))
  getOneById(@Param('id', ParseIntPipe) id: number): Promise<UserModel> {
    return this.userService.getOneBy({ id });
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        imageFile: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Загрузить аватар пользователя' })
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
    this.userService.throwForbiddenExceptionIfNotThis(context.userId, id);
    return this.userService.uploadAvatar(context.userId, imageFile);
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Обновить пользователя' })
  @ApiOkResponse({ type: UserSchema })
  @UseInterceptors(new TransformInterceptor(UserSchema))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
  ): Promise<UserModel> {
    dto.avatarId = undefined;
    return this.userService.update(id, dto);
  }

  @ApiOkResponse()
  @ApiOperation({ summary: 'Удалить пользователя' })
  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @Context() context: ContextDto,
  ) {
    this.userService.throwForbiddenExceptionIfNotThisOrAdmin(context, id);
    await this.userService.delete(id);
  }

  @Roles(RoleEnum.ADMIN)
  @ApiOkResponse()
  @ApiOperation({ summary: 'Восстановить пользователя' })
  @Post('/:id/restore')
  @HttpCode(HttpStatus.NO_CONTENT)
  async restore(@Param('id', ParseIntPipe) id: number) {
    await this.userService.restore(id);
  }
}
