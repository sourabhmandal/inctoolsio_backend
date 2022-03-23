import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { GoogleUserDataResponse } from './types';

@Injectable()
export class GoogleStategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env['GOOGLE_CLIENT_ID'],
      clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
      callbackURL: process.env['GOOGLE_CALLBACK_URL'],
      scope: ['email', 'profile'],
    }); // config
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { displayName } = profile;
    const {
      name,
      email,
      given_name,
      family_name,
      picture,
      email_verified,
      locale,
    } = profile._json;
    const googleResp: GoogleUserDataResponse = {
      name,
      displayName,
      given_name,
      family_name,
      picture,
      email,
      email_verified,
      locale,
      accessToken,
    };
    done(null, googleResp);
  }
}
