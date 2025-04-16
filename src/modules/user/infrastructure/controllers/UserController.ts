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
import { UserService } from '../../domain/services/UserService';
import { UserSchema } from '../schemas/UserSchema';
import {
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserModel } from '../../domain/models/UserModel';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerImageOptions } from '../../../../config/MulterImageConfig';
import { ContextDto } from '../../../auth/domain/dtos/ContextDto';
import { Context } from '../../../auth/infrastructure/decorators/Context';
import { Authorized } from '../../../auth/infrastructure/decorators/Authorized';
import { UserSearchDto } from '../../domain/dtos/UserSearchDto';
import { UserUpdateDto } from '../../domain/dtos/UserUpdateDto';
import { Roles } from '../../../auth/infrastructure/decorators/Roles';
import { RoleEnum } from '../../domain/enums/RoleEnum';
import { SchemaTransform } from '../../../global/infrastructure/decorators/SchemaTransform';

@Controller('/user')
@ApiTags('Пользователь')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Получить пользователей' })
  @SchemaTransform(UserSchema, { isPagination: true })
  search(@Query() dto: UserSearchDto) {
    return this.userService.search(dto);
  }

  @Authorized()
  @Get('/this')
  @ApiOperation({ summary: 'Получить текущего пользователя' })
  @SchemaTransform(UserSchema)
  getThis(@Context() context: ContextDto): Promise<UserModel> {
    return this.userService.getOneBy({ id: context.userId });
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Получить пользователя' })
  @SchemaTransform(UserSchema)
  getOneById(@Param('id', ParseIntPipe) id: number): Promise<UserModel> {
    return this.userService.getOneBy({ id });
  }

  @Authorized()
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
  @UseInterceptors(FileInterceptor('imageFile', multerImageOptions))
  @SchemaTransform(UserSchema)
  @Post('/:id/image')
  uploadAvatar(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() imageFile: Express.Multer.File,
    @Context() context: ContextDto,
  ) {
    this.userService.throwForbiddenExceptionIfNotThis(context.userId, id);
    return this.userService.uploadAvatar(context.userId, imageFile);
  }

  @Authorized()
  @Put('/:id')
  @ApiOperation({ summary: 'Обновить пользователя' })
  @SchemaTransform(UserSchema)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UserUpdateDto,
    @Context() context: ContextDto,
  ): Promise<UserModel> {
    dto.avatarId = undefined;
    return this.userService.updateThis(id, context.userId, dto);
  }

  @Authorized()
  @ApiOkResponse()
  @ApiOperation({ summary: 'Удалить пользователя' })
  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @Context() context: ContextDto,
  ) {
    await this.userService.delete(id, context);
  }

  @Roles(RoleEnum.ADMIN)
  @Authorized()
  @ApiOkResponse()
  @ApiOperation({ summary: 'Восстановить пользователя' })
  @Post('/:id/restore')
  @HttpCode(HttpStatus.NO_CONTENT)
  async restore(@Param('id', ParseIntPipe) id: number) {
    await this.userService.restore(id);
  }
}
