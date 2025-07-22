import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentMethod } from './create-payment.dto';

export class PaymentResponseDto {
  @ApiProperty({ description: 'Payment ID' })
  id: string;

  @ApiProperty({ description: 'ID of the invoice being paid' })
  invoiceId: string;

  @ApiProperty({ description: 'Amount paid' })
  amount: number;

  @ApiProperty({ enum: PaymentMethod, description: 'Method of payment' })
  paymentMethod: PaymentMethod;

  @ApiProperty({ description: 'Transaction reference number' })
  transactionReference: string;

  @ApiPropertyOptional({ description: 'Additional notes about the payment' })
  notes?: string;

  @ApiProperty({ description: 'Date when the payment was processed' })
  processedAt: Date;

  @ApiProperty({ description: 'Status of the payment' })
  status: string;

  @ApiProperty({ description: 'Date when the payment record was created' })
  createdAt: Date;

  @ApiProperty({ description: 'Date when the payment record was last updated' })
  updatedAt: Date;
}
