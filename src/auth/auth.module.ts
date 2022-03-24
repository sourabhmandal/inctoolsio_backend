import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';
import { GoogleStategy } from './google.startegy';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env['JWT_SECRET'],
      signOptions: { algorithm: 'HS256', issuer: 'inctools.io' },
    }),
  ],
  providers: [AuthService, GoogleStategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
