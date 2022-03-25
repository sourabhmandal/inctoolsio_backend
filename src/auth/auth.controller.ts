import {
  Controller,
  Get,
  UseGuards,
  Request,
  Post,
  Response,
} from '@nestjs/common';
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
  async googleAuthRedirect(@Request() req, @Response() res) {
    if (req.isAuthenticated()) {
      const data = await this.authService.googleCallback(req.user);
      res
        .status(301)
        .redirect(
          `http://localhost:3000/sessions?userType=${data.message}&accessToken=${data.accessToken}&refreshToken=${data.refreshToken}`,
        );
    } else {
      res
        .status(500)
        .redirect(
          `http://localhost:3000/sessions?error=cannot+authenticate+user`,
        );
    }
  }

  @Post('token/refresh')
  async refreshToken(@Request() req) {
    // validate Refresh Token
    const { accessTokenJWT, refreshTokenJWT } =
      await this.authService.refreshJWT(req.body.refreshToken);
    return { accessTokenJWT, refreshTokenJWT };
  }
}
