import { applyDecorators, UseGuards } from '@nestjs/common';
import { Roles } from './roles.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesAuthGuard } from '../guards/roles-auth.guard';
import { RoleEnum } from '../../user/enum/role.enum';

export const Authorized = () =>
  applyDecorators(
    ApiBearerAuth(),
    Roles(...Object.values(RoleEnum)),
    UseGuards(JwtAuthGuard, RolesAuthGuard),
  );
