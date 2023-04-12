import {

    BadRequestException,
  Get,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
// import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private Jwt: JwtService,
    private config: ConfigService,
  ) {}

getHello():string{
  return 'hello '
}

  async signup(dto: AuthDto) {
    // generate the password hash
    const hash = await argon.hash(dto.password);
    //for the password hashing   -> argon2 isused(in bcrypt is ony possible to hash first 72byte so)
        // save the new user in the db
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
    // find the user by email
    const user =
      await this.prisma.user.findUnique({
        where: { 
          email: dto.email ,
          
        },
      });
       // if user does not exist throw exception
    if (!user) {
      throw new BadRequestException(
        'please signup first ...',
      );
    }
     // compare password
    const pwMatches = await argon.verify(
      user.hash,
      dto.password,
    );
     // if password incorrect throw exception
    if (!pwMatches) {
      throw new BadRequestException(
        'password incorrect ...',
      );
    }
    
  }
  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };
    const secret = this.config.get('JWT_SECRET');
        const token = await this.Jwt.signAsync(payload, {
      expiresIn: '15m',
     secret: secret,
    })
    return {
      access_token: token
    };
  }
}
