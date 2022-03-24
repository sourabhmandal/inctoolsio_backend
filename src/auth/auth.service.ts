import { HttpStatus, Injectable } from '@nestjs/common';
import { Users } from 'src/users/user.model';
import { UsersService } from 'src/users/users.service';
import { UserLoggedInResponse } from './types';
import { JwtService } from '@nestjs/jwt';
import { EntityNotFoundError } from 'typeorm';

function isBlank(str: string) {
  return !str || /^\s*$/.test(str);
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  async validateUser(email: string): Promise<any> {
    // const user: User = await this.usersService.createUser(new User());
    // if (!user) {
    //   return {};
    // }
    // const { created_at, updated_at, ...rest } = user;
    return email;
  }

  async googleCallback(user: any): Promise<UserLoggedInResponse> {
    if (!user) {
      return {
        status: HttpStatus.FORBIDDEN,
        message: 'User info not recieved in callback',
        accessToken: '',
        refreshToken: '',
      };
    }

    const {
      name,
      displayName,
      given_name,
      family_name,
      picture,
      email,
      email_verified,
      locale,
      accessToken,
    } = user;
    if (
      isBlank(email) ||
      isBlank(displayName) ||
      isBlank(given_name) ||
      isBlank(accessToken) ||
      isBlank(family_name)
    ) {
      return {
        status: HttpStatus.FORBIDDEN,
        message: 'All required data was not recieved from google',
        accessToken: '',
        refreshToken: '',
      };
    }

    // check if user exist
    let responseUser = new Users();
    let userType = 'Registered';
    const existingUser = await this.userService.getUserByEmail({
      email: email,
    });
    responseUser = existingUser;
    if (!responseUser) {
      console.log('resgiter new user');
      const savedUser: Users = await this.userService.createUser({
        email,
        name,
        locale,
      });
      userType = 'New';
      responseUser = savedUser;
    }

    console.log(responseUser);

    // create tokens
    const accessTokenJWT: string = this.jwtService.sign({
      iss: 'inctools.io',
      sub: responseUser.id,
      role: responseUser.role,
    });

    const refreshTokenJWT: string = this.jwtService.sign({
      iss: 'inctools.io',
      sub: responseUser.id,
      role: responseUser.role,
    });

    return {
      status: HttpStatus.OK,
      message: userType,
      accessToken: accessTokenJWT,
      refreshToken: refreshTokenJWT,
    };
  }
}
