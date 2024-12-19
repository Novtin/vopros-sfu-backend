export const IConfigService = 'IConfigService';

export interface IConfigService {
  get(propertyPath: string): any;
}
