import { IsString, IsNotEmpty, Length, IsNumberString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreatePaymentDto {
  @ApiProperty({
    type: String,
    description: 'Merchant ID',
    example: 'Merchand12',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  readonly merchantId: string;

  @ApiProperty({
    type: String,
    description: 'Card number',
    required: true,
  })
  @IsNumberString()
  @IsNotEmpty()
  @Length(16, 16)
  @Transform(({ value }) => value.replace(/\s/g, ''))
  readonly cardNumber: string;

  @ApiProperty({
    type: String,
    description: 'Expiry month',
    example: '12',
    required: true,
  })
  @IsNumberString()
  @IsNotEmpty()
  @Length(2, 2)
  @Transform(({ value }) => value.replace(/\s/g, ''))
  readonly expiryMonth: string;

  @ApiProperty({
    type: String,
    description: 'Expiry year',
    example: '2023',
    required: true,
  })
  @IsNumberString()
  @IsNotEmpty()
  @Length(4, 4)
  @Transform(({ value }) => value.replace(/\s/g, ''))
  readonly expiryYear: string;

  @ApiProperty({
    type: String,
    description: 'Amount',
    example: '100',
    required: true,
  })
  @IsNumberString()
  @IsNotEmpty()
  @Transform(({ value }) => value.replace(/\s/g, ''))
  readonly amount: string;

  @ApiProperty({
    type: String,
    description: 'Currency',
    example: 'USD',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  readonly currency: string;

  @ApiProperty({
    type: String,
    description: 'CVV',
    example: '123',
    required: true,
  })
  @IsNumberString()
  @IsNotEmpty()
  @Transform(({ value }) => value.replace(/\s/g, ''))
  readonly cvv: string;
}
