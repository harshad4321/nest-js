import { Module } from '@nestjs/common';
import { AutController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AutController],
  providers: [AuthService],
})
export class AuthModule {}
