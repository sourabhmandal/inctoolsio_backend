import {
  Controller,
  Get,
  UseGuards,
  Request,
  UnauthorizedException,
  Post,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google/login')
  @UseGuards(AuthGuard('google'))
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async googleLogin(@Request() req) {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Request() req) {
    if (req.isAuthenticated()) {
      return this.authService.googleCallback(req.user);
    } else {
      throw new UnauthorizedException('User not authenticated');
    }
  }

  @Post('token/refresh')
  async refreshToken(@Request() req) {
    // validate Refresh Token
    const resp = await this.authService.refreshJWT(req.body.refreshToken);
    return resp;
  }
}
