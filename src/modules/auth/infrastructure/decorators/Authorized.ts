import { applyDecorators, UseGuards } from '@nestjs/common';
import { Roles } from './Roles';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthJwtGuard } from '../guards/AuthJwtGuard';
import { AuthRolesGuard } from '../guards/AuthRolesGuard';
import { RoleEnum } from '../../../user/domain/enums/RoleEnum';

export const Authorized = () =>
  applyDecorators(
    ApiBearerAuth(),
    Roles(...Object.values(RoleEnum)),
    UseGuards(AuthJwtGuard, AuthRolesGuard),
  );
