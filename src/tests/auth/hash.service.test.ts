import { Test, TestingModule } from '@nestjs/testing';
import { describe, expect, it, beforeAll } from '@jest/globals';
import { HashService } from '../../modules/auth/domain/services/hash.service';

describe('HashService', () => {
  let hashService: HashService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HashService],
    }).compile();

    hashService = module.get<HashService>(HashService);
  });

  describe('makeHash', () => {
    it('should return a hashed password', async () => {
      const plainText = 'test';
      const hash = await hashService.makeHash(plainText);
      expect(hash).not.toBe(plainText);
      expect(hash.startsWith('$argon2')).toBeTruthy();
    });

    it('should generate a different hash for the same input', async () => {
      const plainText = 'test123';
      const hash1 = await hashService.makeHash(plainText);
      const hash2 = await hashService.makeHash(plainText);
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('compareTextAndHash', () => {
    it('should return true for correct password', async () => {
      const plainText = 'testing';
      const hash = await hashService.makeHash(plainText);
      const result = await hashService.compareTextAndHash(plainText, hash);
      expect(result).toBeTruthy();
    });

    it('should return false for incorrect password', async () => {
      const plainText = 'testPassword123';
      const wrongPassword = 'wrongPassword';
      const hash = await hashService.makeHash(plainText);
      const result = await hashService.compareTextAndHash(wrongPassword, hash);
      expect(result).toBeFalsy();
    });
  });
});
