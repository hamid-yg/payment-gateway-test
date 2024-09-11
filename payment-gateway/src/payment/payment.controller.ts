import { Controller, Get, Post, Body, Query, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@ApiTags('payment')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @ApiOperation({ summary: 'Process payment' })
  @ApiResponse({ status: 201, description: 'Payment processed successfully' })
  @ApiResponse({ status: 400, description: 'Payment processing failed' })
  @Post()
  processPayment(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.processPayment(createPaymentDto);
  }

  @ApiOperation({ summary: 'Get payment by ID' })
  @ApiResponse({ status: 200, description: 'Payment found' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  @Get(':id')
  async getPayment(@Param('id') id: string) {
    return this.paymentService.getPaymentById(id);
  }

  @ApiOperation({ summary: 'Get payments by merchant ID' })
  @ApiResponse({ status: 200, description: 'Payments found' })
  @ApiResponse({ status: 404, description: 'Payments not found' })
  @Get('merchant/:merchantId')
  async getPayments(@Param('merchantId') merchantId: string) {
    return this.paymentService.getPaymentsByMerchantId(merchantId);
  }

  @ApiOperation({ summary: 'Get last payment by merchant ID' })
  @ApiResponse({ status: 200, description: 'Last payment found' })
  @ApiResponse({ status: 404, description: 'Last payment not found' })
  @Get('last/:merchantId')
  async getLastPayment(@Param('merchantId') merchantId: string) {
    return this.paymentService.getLastPayment(merchantId);
  }

  @ApiOperation({ summary: 'Get payments in range' })
  @ApiResponse({
    status: 200,
    description: 'Payments found',
    type: [CreatePaymentDto],
  })
  @ApiResponse({ status: 404, description: 'Payments not found' })
  @Get('range/:merchantId')
  async getPaymentsInRange(
    @Param('merchantId') merchantId: string,
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
  ) {
    return this.paymentService.getPaymentsInRange(
      merchantId,
      startDate,
      endDate,
    );
  }

  @ApiOperation({ summary: 'Download payment report' })
  @ApiResponse({ status: 200, description: 'Payment report downloaded' })
  @ApiResponse({ status: 404, description: 'Payment report not found' })
  @Get('download-report/:merchantId')
  async downloadPaymentReport(
    @Param('merchantId') merchantId: string,
    @Res() res: Response,
    @Query('startDate') startDate?: Date,
    @Query('endDate') endDate?: Date,
  ) {
    const pdfBuffer = await this.paymentService.generatePaymentReport(
      merchantId,
      startDate,
      endDate,
    );

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=payment-report-${merchantId}-${startDate}-${endDate}.pdf`,
    );

    res.send(pdfBuffer);
  }
}
