import { Global, Module } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IEventEmitterService } from '../domain/interfaces/i-event-emitter-service';
import { IConfigService } from '../domain/interfaces/i-config-service';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  providers: [
    {
      provide: IEventEmitterService,
      useExisting: EventEmitter2,
    },
    {
      provide: IConfigService,
      useExisting: ConfigService,
    },
  ],
  exports: [IEventEmitterService, IConfigService],
})
export class GlobalModule {}
