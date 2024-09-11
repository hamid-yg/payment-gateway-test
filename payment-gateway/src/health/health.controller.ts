import { Controller, Get, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Controller('health')
@ApiTags('health')
export class HealthController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
  ) {}

  @ApiOperation({ summary: 'Check health status' })
  @ApiResponse({ status: 200, description: 'Health status' })
  @Get()
  getHealthStatus(): { status: string } {
    this.logger.info('Checking health status');

    return { status: 'OK' };
  }
}
