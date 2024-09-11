import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { PaymentStatus } from '../enum/status.enum';

export type PaymentDocument = Payment & Document;

@Schema({
  versionKey: false,
  timestamps: true,
  _id: true,
  toJSON: {
    virtuals: true,
    transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    },
  },
})
export class Payment {
  @Prop()
  merchantId: string;

  @Prop()
  cardNumber: string;

  @Prop()
  expiryMonth: number;

  @Prop()
  expiryYear: number;

  @Prop()
  amount: number;

  @Prop()
  currency: string;

  @Prop()
  cvv: number;

  @Prop({ enum: PaymentStatus, default: PaymentStatus.PENDING })
  status: PaymentStatus;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
