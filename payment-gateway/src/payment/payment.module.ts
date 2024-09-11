import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { DatabaseModule } from '../config/database/database.module';
import { paymentProviders } from './payment.provider';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';

@Module({
  imports: [DatabaseModule, HttpModule],
  controllers: [PaymentController],
  providers: [PaymentService, ...paymentProviders],
})
export class PaymentModule {}
