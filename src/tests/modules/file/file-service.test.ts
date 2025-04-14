import {
  beforeAll,
  afterAll,
  beforeEach,
  describe,
  expect,
  it,
} from '@jest/globals';
import { FileService } from '../../../modules/file/domain/services/file.service';
import { IFileRepository } from '../../../modules/file/domain/interfaces/i-file-repository';
import { IFileStorageRepository } from '../../../modules/file/domain/interfaces/i-file-storage-repository';
import { DataSource } from 'typeorm';
import { clearDatabase, getTestModule } from '../../utils';
import { NotFoundException } from '../../../modules/global/domain/exceptions/not-found.exception';
import { IFile } from '../../../modules/file/domain/interfaces/i-file';

describe('FileService', () => {
  let fileService: FileService;
  let fileRepository: IFileRepository;
  let fileStorageRepository: jest.Mocked<IFileStorageRepository>;
  let dataSource: DataSource;

  const createTestFile = async (fileName?: string) =>
    fileService.create({
      filename: fileName ?? 'test.png',
      size: 100,
      mimetype: 'image/png',
    });

  beforeAll(async () => {
    const moduleRef = await getTestModule();

    fileService = moduleRef.get(FileService);
    fileRepository = moduleRef.get(IFileRepository);
    fileStorageRepository = moduleRef.get(IFileStorageRepository);
    dataSource = moduleRef.get(DataSource);

    await dataSource.runMigrations();
  });

  afterAll(async () => {
    await clearDatabase(dataSource);
    //await dataSource.destroy();
  });

  beforeEach(async () => {
    await clearDatabase(dataSource);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create FileModel', async () => {
      const file: IFile = {
        filename: 'test.png',
        size: 100,
        mimetype: 'image/png',
      };

      const fileModel = await fileService.create(file);

      expect(fileModel).toEqual({
        id: 1,
        name: file.filename,
        size: file.size,
        mimetype: file.mimetype,
      });
    });
  });

  describe('getOneBy', () => {
    it('should find FileModel', async () => {
      const fileModel = await createTestFile();
      const foundFileModel = await fileService.getOneBy({
        id: fileModel.id,
        name: fileModel.name,
      });

      expect(foundFileModel).toEqual(fileModel);
    });

    it('should throw NotFoundException if FileModel does not exist', async () => {
      await expect(fileService.getOneBy({ id: 1 })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getReadStreamByFileId', () => {
    it('should return file stream', async () => {
      const fileModel = await createTestFile();
      const streamMock = {};

      fileStorageRepository.getReadStream.mockReturnValue(streamMock);

      const fileStream = await fileService.getReadStreamByFileId(fileModel.id, {
        isExample: false,
        isMiniature: false,
      });

      expect(fileStream).toBe(streamMock);
    });
  });

  describe('delete', () => {
    it('should delete file if name does not start with avatar', async () => {
      const fileModel = await createTestFile();
      await fileService.delete(fileModel.id);
      expect(fileStorageRepository.delete).toHaveBeenCalledWith(fileModel.name);
      await expect(
        fileRepository.getOneBy({ id: fileModel.id }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should not delete file if name starts with avatar', async () => {
      const fileModel = await createTestFile('avatar123.png');

      await fileService.delete(fileModel.id);

      expect(fileStorageRepository.delete).not.toHaveBeenCalled();
      expect(fileRepository.delete).not.toHaveBeenCalled();
      await expect(
        fileRepository.getOneBy({ id: fileModel.id }),
      ).resolves.toEqual(fileModel);
    });
  });

  describe('getExampleIds', () => {
    it('should return file ids', async () => {
      const fileModels = await Promise.all(
        Array.from({ length: 2 }, (_, index) =>
          createTestFile(`avatar${index}.png`),
        ),
      );

      const result = await fileService.getExampleIds();

      expect(result).toEqual({
        fileIds: fileModels.map((fileModel) => fileModel.id),
      });
    });
  });
});
