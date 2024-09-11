import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { HealthModule } from './health/health.module';
import { PaymentModule } from './payment/payment.module';
import { DatabaseModule } from './config/database/database.module';
import {
  getLoggerConfiguration,
  getPinoConfiguration,
} from './config/logger/logger.module';
import config from './config/env/env.module';

@Module({
  imports: [
    WinstonModule.forRoot(getLoggerConfiguration()),
    LoggerModule.forRoot(getPinoConfiguration()),
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
    }),
    DatabaseModule,
    HealthModule,
    PaymentModule,
  ],
})
export class AppModule {}
