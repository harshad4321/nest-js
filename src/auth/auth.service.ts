import { IsString } from 'class-validator';
import { JwtService } from '@nestjs/jwt';
import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { Config } from 'prettier';
import { ConfigService } from '@nestjs/config';
import { promises } from 'dns';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private Jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: AuthDto) {
    const hash = await argon.hash(dto.password);
    //for the password hashing   -> argon2 isused(in bcrypt is ony possible to hash first 72byte so)
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });

      return this.signToken(user.id, user.email);
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException(
          'Email address is already in use',
        );
      }
      throw error;
    }
  }

  async signin(dto: AuthDto) {
    const user =
      await this.prisma.user.findUnique({
        where: { email: dto.email },
      });
    if (!user) {
      throw new BadRequestException(
        'Incorrect credentials',
      );
    }
    const pwMatches = await argon.verify(
      user.hash,
      dto.password,
    );
    if (!pwMatches) {
      throw new BadRequestException(
        'Incorrect credentials',
      );
    }
    return this.signToken(user.id, user.email);
  }
  signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };
    const secret = this.config.get('JWT_SECRET');
    return this.Jwt.signAsync(payload, {
      expiresIn: '15m',
      secret,
    }).then(async (token) => ({
      access_token: token,
    }));
  }
}
