import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';

export class jwtStrategy extends PassportStrategy(
  Strategy,
) {
  constructor() {
    super({});
  }
}
