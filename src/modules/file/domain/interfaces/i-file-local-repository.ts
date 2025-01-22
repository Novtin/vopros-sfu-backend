export const IFileLocalRepository = 'IFileLocalRepository';

export interface IFileLocalRepository {
  delete(fileName: string): void;
}
