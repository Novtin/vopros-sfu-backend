export const IEventEmitterService = 'IEventEmitterService';

export interface IEventEmitterService {
  emit(event: string | (symbol | string)[], ...values: any[]): boolean;
}
