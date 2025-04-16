export const IConfigService = 'IConfigService';

export interface IConfigService {
  get<T = any>(propertyPath: string): T;
}
