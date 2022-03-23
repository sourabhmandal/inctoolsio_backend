import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserResolver } from './user.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './user.model';

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  providers: [UsersService, UserResolver],
  exports: [UsersService],
})
export class UsersModule {}
