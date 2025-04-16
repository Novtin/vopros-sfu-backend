import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthOptionalJwtGuard } from '../guards/AuthOptionalJwtGuard';

export const OptionalAuthorized = () =>
  applyDecorators(ApiBearerAuth(), UseGuards(AuthOptionalJwtGuard));
