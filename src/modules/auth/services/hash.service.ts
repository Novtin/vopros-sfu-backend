import * as argon from 'argon2';
import { randomBytes } from 'node:crypto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HashService {
  async compareTextAndHash(plainText: string, hash: string): Promise<boolean> {
    return argon.verify(hash, plainText);
  }

  async makeHash(plainText: string): Promise<string> {
    const salt = randomBytes(32);
    return argon.hash(plainText, { salt });
  }
}
