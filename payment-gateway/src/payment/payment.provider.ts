import { Mongoose } from 'mongoose';
import { PaymentSchema } from './schemas/payment.schema';

export const paymentProviders = [
  {
    provide: 'PAYMENT_MODEL',
    useFactory: (mongoose: Mongoose) =>
      mongoose.model('Payment', PaymentSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
