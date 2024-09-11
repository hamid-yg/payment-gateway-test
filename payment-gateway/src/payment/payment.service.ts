import {
  Injectable,
  Inject,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, map } from 'rxjs/operators';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { Payment, PaymentDocument } from './schemas/payment.schema';
import { PaymentStatus } from './enum/status.enum';
import * as PDFDocument from 'pdfkit';
import { throwError } from 'rxjs';

@Injectable()
export class PaymentService {
  constructor(
    @Inject('PAYMENT_MODEL')
    private readonly paymentModel: Model<PaymentDocument>,
    @Inject(HttpService) private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  processPayment(paymentDto: CreatePaymentDto): any {
    const paymentApiUrl = this.configService.get<string>('PAYMENT_API_URL');

    const cardInfos = {
      cardNumber: paymentDto.cardNumber,
      cvv: paymentDto.cvv,
      expiryMonth: paymentDto.expiryMonth,
      expiryYear: paymentDto.expiryYear,
    };

    return this.httpService
      .post(`${paymentApiUrl}/process-payment`, cardInfos)
      .pipe(
        map((response) => {
          if (response.data.status === 'success') {
            const payment = new this.paymentModel(paymentDto);

            payment.status = PaymentStatus.SUCCESS;

            payment.save();

            return {
              statusCode: HttpStatus.CREATED,
              message: 'Payment processed successfully',
            };
          }
        }),
        catchError((error) => {
          if (error.response && error.response.status === 400) {
            const failedPayment = new this.paymentModel({
              ...paymentDto,
              status: PaymentStatus.FAILED,
            });

            failedPayment.save();

            return throwError(
              () =>
                new HttpException(
                  'Payment processing failed',
                  HttpStatus.BAD_REQUEST,
                ),
            );
          } else {
            return throwError(
              () =>
                new HttpException(
                  'Internal server error',
                  HttpStatus.INTERNAL_SERVER_ERROR,
                ),
            );
          }
        }),
      );
  }

  async getPaymentById(id: string): Promise<Payment> {
    const payment = await this.paymentModel.findById(id);

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    const paymentObject = payment.toObject();
    paymentObject.cardNumber =
      '**** **** **** ' + paymentObject.cardNumber.toString().slice(-4);

    return paymentObject;
  }

  async getPaymentsByMerchantId(merchantId: string): Promise<Payment[]> {
    const payments = await this.paymentModel.find({ merchantId: merchantId });

    if (!payments) {
      throw new NotFoundException('Payments not found');
    }

    const paymentsObject = payments.map((payment) => {
      const paymentObject = payment.toObject();
      paymentObject.cardNumber =
        '**** **** **** ' + paymentObject.cardNumber.toString().slice(-4);
      return paymentObject;
    });

    return paymentsObject;
  }

  async getLastPayment(merchantId: string): Promise<Payment> {
    const payment = await this.paymentModel
      .findOne({ merchantId: merchantId })
      .sort({ createdAt: -1 });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    const paymentObject = payment.toObject();
    paymentObject.cardNumber =
      '**** **** **** ' + paymentObject.cardNumber.toString().slice(-4);

    return payment;
  }

  async getPaymentsInRange(
    merchantId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Payment[]> {
    const payments = await this.paymentModel.find({
      merchantId: merchantId,
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    });

    if (!payments) {
      throw new NotFoundException('Payments not found');
    }

    return payments;
  }

  async generatePaymentReport(
    merchantId: string,
    startDate: Date,
    endDate: Date,
  ) {
    let payments;

    if (startDate && endDate) {
      payments = await this.getPaymentsInRange(merchantId, startDate, endDate);
    } else {
      payments = await this.getPaymentsByMerchantId(merchantId);
    }

    const doc = new PDFDocument();
    const buffers: Buffer[] = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfData = Buffer.concat(buffers);
      return pdfData;
    });

    const columnPositions = {
      number: 50,
      paymentId: 100,
      amount: 250,
      status: 320,
      createdAt: 410,
    };

    doc
      .fontSize(20)
      .text(`Payment Report for Merchant ID: ${merchantId}`, 50, 50);

    if (startDate && endDate) {
      doc.fontSize(15).text(`Period of: ${startDate} to ${endDate}`, 50, 80);
    }

    doc
      .fontSize(12)
      .text('No.', columnPositions.number, 120)
      .text('Payment ID', columnPositions.paymentId, 120)
      .text('Amount', columnPositions.amount, 120)
      .text('Status', columnPositions.status, 120)
      .text('Date', columnPositions.createdAt, 120);

    let currentLinePosition = 135;

    payments.forEach((payment, index) => {
      doc
        .fontSize(10)
        .text(`${index + 1}`, columnPositions.number, currentLinePosition)
        .text(payment._id, columnPositions.paymentId, currentLinePosition)
        .text(`$${payment.amount}`, columnPositions.amount, currentLinePosition)
        .text(payment.status, columnPositions.status, currentLinePosition)
        .text(
          payment.createdAt.toISOString(),
          columnPositions.createdAt,
          currentLinePosition,
        );

      currentLinePosition += 20;
    });

    doc.end();

    return new Promise((resolve, reject) => {
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });
      doc.on('error', reject);
    });
  }
}
