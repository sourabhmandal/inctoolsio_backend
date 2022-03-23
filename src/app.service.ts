import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getServicePing(): string {
    return 'Inc Tools dot IO is up and running';
  }
}
