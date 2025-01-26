export const IHashService = 'IHashService';

export interface IHashService {
  compareTextAndHash(plainText: string, hash: string): Promise<boolean>;
  makeHash(plainText: string): Promise<string>;
}
