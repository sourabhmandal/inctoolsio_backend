import { HttpStatus } from '@nestjs/common';

type UserLoggedInResponse = {
  status: number;
  message: string;
  accessToken: string;
  refreshToken: string;
};

type GoogleUserDataResponse = {
  name: string;
  displayName: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: string;
  locale: string;
  accessToken: string;
};
