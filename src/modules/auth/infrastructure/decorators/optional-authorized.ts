import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { OptionalJwtAuthGuard } from '../guards/optional-jwt-auth.guard';

export const OptionalAuthorized = () =>
  applyDecorators(ApiBearerAuth(), UseGuards(OptionalJwtAuthGuard));
