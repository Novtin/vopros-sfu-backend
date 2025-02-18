import { Request } from 'express';

export function getIpAddress(request: Request) {
  const forwardedFor = request.headers['x-forwarded-for'];
  return forwardedFor ? (forwardedFor as string).split(',')[0] : request.ip;
}
