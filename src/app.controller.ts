import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getServicePing(): string {
    return this.appService.getServicePing();
  }
}
