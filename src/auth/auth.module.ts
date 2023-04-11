import { JwtStrategy } from './strategy/jwt.strategy';
import { Module } from '@nestjs/common';
import { AutController } from './auth.controller';
import { AuthService } from './auth.service';
// import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AutController],
  providers: [AuthService,JwtStrategy],
})
export class AuthModule {}
