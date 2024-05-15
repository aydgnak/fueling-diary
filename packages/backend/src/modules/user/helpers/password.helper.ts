import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

export async function hashHelper(plainPassword: string): Promise<string> {
  if (!plainPassword) {
    throw new BadRequestException('Password is required');
  }

  return bcrypt.hash(plainPassword, 10);
}

export async function comporeHelper(
  plainPassword: string,
  hashedPassword: string,
): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}
