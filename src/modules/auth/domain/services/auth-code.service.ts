import { Inject, Injectable } from '@nestjs/common';
import { CreateOrUpdateAuthCodeDto } from '../dtos/create-or-update-auth-code.dto';
import { IAuthCodeRepository } from '../interfaces/i-auth-code-repository';
import { random as _random } from 'lodash';
import { IConfigService } from '../../../global/domain/interfaces/i-config-service';
import { ConfirmAuthCodeDto } from '../dtos/confirm-auth-code.dto';
import { NotFoundException } from '../../../global/domain/exceptions/not-found.exception';
import { ConflictException } from '../../../global/domain/exceptions/conflict.exception';
import { IEventEmitterService } from '../../../global/domain/interfaces/i-event-emitter-service';
import { EventEnum } from '../../../global/domain/enums/event.enum';
import { isBefore, setHours } from 'date-fns';
import { AuthCodeTypeEnumHelper } from '../enums/auth-code-type.enum';
import { UserService } from '../../../user/domain/services/user.service';

@Injectable()
export class AuthCodeService {
  constructor(
    @Inject(IAuthCodeRepository)
    private readonly authCodeRepository: IAuthCodeRepository,
    @Inject(IConfigService)
    private readonly configService: IConfigService,
    @Inject(IEventEmitterService)
    private readonly eventEmitterService: IEventEmitterService,
    private readonly userService: UserService,
  ) {}

  async createOrUpdate(dto: CreateOrUpdateAuthCodeDto) {
    const user = await this.userService.getOneBy({ email: dto.email });
    let model = await this.authCodeRepository.getOneBy({
      userId: user.id,
      type: dto.type,
    });
    const today = new Date(new Date().toISOString());
    model = model
      ? await this.authCodeRepository.save({
          ...model,
          code: this.generateCode(),
          isUsed: false,
          availableAttempts: +this.configService.get('authCode.attempts'),
          isActiveAt: setHours(
            today,
            today.getHours() +
              +this.configService.get('authCode.activeInterval'),
          ),
        })
      : await this.authCodeRepository.save({
          ...dto,
          code: this.generateCode(),
        });

    this.eventEmitterService.emit(EventEnum.CREATE_AUTH_CODE, {
      code: model.code,
      email: model.user.email,
    });

    return model;
  }

  async confirm(dto: ConfirmAuthCodeDto): Promise<{
    isConfirmed: boolean;
    availableAttempts: number;
  }> {
    const user = await this.userService.getOneBy({ email: dto.email });
    const model = await this.authCodeRepository.getOneBy({
      userId: user.id,
      type: dto.type,
    });

    if (!model) {
      throw new NotFoundException('Код не найден');
    }

    if (
      model.availableAttempts <= 0 ||
      isBefore(model.isActiveAt, new Date()) ||
      model.isUsed
    ) {
      throw new ConflictException('Код недействителен');
    }

    if (model.code !== dto.code) {
      const updatedModel = await this.authCodeRepository.save({
        ...model,
        availableAttempts: model.availableAttempts - 1,
      });
      return {
        isConfirmed: false,
        availableAttempts: updatedModel.availableAttempts,
      };
    }

    await this.authCodeRepository.save({
      ...model,
      isUsed: true,
    });
    this.eventEmitterService.emit(
      AuthCodeTypeEnumHelper.toEventEnum(dto.type),
      {
        ...dto.payload,
        userId: user.id,
      },
    );
    return {
      isConfirmed: true,
      availableAttempts: null,
    };
  }

  private generateCode() {
    const codeLength = +this.configService.get('authCode.length');
    let code = '';
    for (let i = 0; i < codeLength; i++) {
      code += _random(0, 9);
    }
    return code;
  }
}
