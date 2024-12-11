import { Redis } from 'ioredis';

export const IRedisRepository = 'IRedisRepository';

export interface IRedisRepository extends Redis {}
