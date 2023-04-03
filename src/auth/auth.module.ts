import { Module } from '@nestjs/common';
import { AutController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  controllers: [AutController],
  providers: [AuthService],
})
export class AuthModule {}
