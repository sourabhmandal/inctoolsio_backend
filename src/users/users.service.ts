import {
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { GetUserByEmailArgs } from './dto/args/get-user.args';
import { CreateUserInput } from './dto/input/create-user.input';
import { Users } from './user.model';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(Users) private userRepo: Repository<Users>) {}

  async createUser(user: CreateUserInput): Promise<Users> {
    if (!user.role) {
      user.role = 'master';
    }
    const newuser: Users = this.userRepo.create(user);
    try {
      const respuser = await this.userRepo.save(newuser);
      return respuser;
    } catch (err) {
      if (err instanceof QueryFailedError) {
        const respuser = await this.getUserByEmail({ email: newuser.email });
        return respuser;
      } else {
        // catchall
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: err,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async getUserByEmail(email: GetUserByEmailArgs): Promise<Users> {
    const newuser: Users = this.userRepo.create(email);
    return this.userRepo.findOne({ where: { email: newuser.email } });
  }

  async getUserById(id: number): Promise<Users> {
    return this.userRepo.findOne(id);
  }

  async getAllUsers(): Promise<Users[]> {
    return this.userRepo.find();
  }
}
