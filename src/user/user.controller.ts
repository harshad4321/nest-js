import { Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { jwtGuard } from 'src/auth/dto/guard';
import { Request } from 'express';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';
 
interface AuthRequest extends Request {
  user: any;
}

@Controller('users')
export class UserController {
  @UseGuards(jwtGuard)
  @Get('me')
  getMe(@GetUser()user:User,

  ) {
   
    return user;
  }
  @Patch()
  editUser(){}
}
