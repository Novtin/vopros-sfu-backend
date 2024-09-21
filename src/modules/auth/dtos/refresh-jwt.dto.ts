import { PickType } from '@nestjs/swagger';
import { JwtDto } from './jwt.dto';

export class RefreshJwtDto extends PickType(JwtDto, ['refreshToken']) {}
