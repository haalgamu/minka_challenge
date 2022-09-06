import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class Encrypter {
  private saltOrRounds = 10;

  constructor() {}

  encrypt(str: string): Promise<string> {
    return bcrypt.hash(str, this.saltOrRounds);
  }

  compare(str, hash): Promise<boolean> {
    return this.compare(str, hash);
  }
}
