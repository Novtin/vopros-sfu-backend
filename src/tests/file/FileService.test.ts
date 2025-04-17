import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from '@jest/globals';
import { FileService } from '../../modules/file/domain/services/FileService';
import { IFileRepository } from '../../modules/file/domain/interfaces/IFileRepository';
import { IFileStorageRepository } from '../../modules/file/domain/interfaces/IFileStorageRepository';
import { DataSource } from 'typeorm';
import { refreshDatabase, getTestModule } from '../utils';
import { NotFoundException } from '../../modules/global/domain/exceptions/NotFoundException';
import { IFile } from '../../modules/file/domain/interfaces/IFile';

describe('FileService', () => {
  let fileService: FileService;
  let fileRepository: IFileRepository;
  let fileStorageRepository: IFileStorageRepository;
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
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  beforeEach(async () => {
    await refreshDatabase(dataSource);
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

      expect(fileModel).toMatchObject({
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
      await expect(fileService.getOneBy({ id: 0 })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getReadStreamByFileId', () => {
    it('should return file stream', async () => {
      const fileModel = await createTestFile();
      const streamMock = Buffer.from('file-test');

      fileStorageRepository.getReadStream = jest.fn(() => streamMock);

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
      await expect(fileService.getOneBy({ id: fileModel.id })).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should not delete file if name starts with avatar', async () => {
      const fileModel = await createTestFile('avatar123.png');
      jest.spyOn(fileRepository, 'delete');

      await fileService.delete(fileModel.id);

      expect(fileStorageRepository.delete).not.toHaveBeenCalled();
      expect(fileRepository.delete).not.toHaveBeenCalled();
      await expect(
        fileRepository.getOneBy({ id: fileModel.id }),
      ).resolves.toEqual(fileModel);
    });
  });

  describe('getExampleIds', () => {
    it('should return examples file ids', async () => {
      const { fileIds } = await fileService.getExampleIds();

      expect(fileIds).toHaveLength(14);
    });
  });
});
