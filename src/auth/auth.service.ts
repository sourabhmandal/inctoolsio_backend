import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Users } from 'src/users/user.model';
import { UsersService } from 'src/users/users.service';
import { UserLoggedInResponse } from './types';
import { JwtService } from '@nestjs/jwt';
import { TokenExpiredError } from 'jsonwebtoken';

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
      const savedUser: Users = await this.userService.createUser({
        email,
        name,
        locale,
      });
      userType = 'New';
      responseUser = savedUser;
    }

    const { accessTokenJWT, refreshTokenJWT } = this.genrateJWT(responseUser);

    return {
      status: HttpStatus.OK,
      message: userType,
      accessToken: accessTokenJWT,
      refreshToken: refreshTokenJWT,
    };
  }

  async refreshJWT(refresh: string): Promise<any> {
    // validate refresh token
    try {
      this.jwtService.verify(refresh);
      const decoded = this.jwtService.decode(refresh, { json: true });
      const user = await this.userService.getUserById(parseInt(decoded['sub']));
      const { accessTokenJWT, refreshTokenJWT } = this.genrateJWT(user);
      return {
        accessTokenJWT,
        refreshTokenJWT,
      };
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            message: 'Refresh token expired. Please login',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Cannot Process this request',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {};
  }

  genrateJWT(responseUser: Users) {
    // create tokens
    const accessTokenJWT: string = this.jwtService.sign({
      sub: responseUser.id,
      role: responseUser.role,
      'https://hasura.io/jwt/claims': {
        'x-hasura-allowed-roles': ['master', 'editor', 'commentor', 'viewer'],
        'x-hasura-default-role': 'viewer',
        'x-hasura-user-id': responseUser.id,
        'x-hasura-role': responseUser.role,
      },
      iat: Math.round(new Date().getTime() / 1000),
      exp: Math.round(new Date().getTime() / 1000 + 300), // 30s
    });

    const refreshTokenJWT: string = this.jwtService.sign({
      sub: responseUser.id,
      role: responseUser.role,
      'https://hasura.io/jwt/claims': {
        'x-hasura-allowed-roles': ['master', 'editor', 'commentor', 'viewer'],
        'x-hasura-default-role': 'viewer',
        'x-hasura-user-id': responseUser.id,
        'x-hasura-role': responseUser.role,
      },
      iat: Math.round(new Date().getTime() / 1000),
      exp: Math.round(new Date().getTime() / 1000 + 3600), // 1h
    });

    return {
      accessTokenJWT,
      refreshTokenJWT,
    };
  }
}
