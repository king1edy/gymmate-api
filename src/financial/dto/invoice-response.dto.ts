import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { InvoiceLineItemDto } from './create-invoice.dto';

export class InvoiceResponseDto {
  @ApiProperty({ description: 'Invoice ID' })
  id: string;

  @ApiProperty({ description: 'ID of the member this invoice is for' })
  memberId: string;

  @ApiProperty({ description: 'ID of the gym this invoice belongs to' })
  gymId: string;

  @ApiProperty({ description: 'Invoice number' })
  invoiceNumber: string;

  @ApiProperty({ description: 'Subtotal amount before tax and discounts' })
  subtotal: number;

  @ApiPropertyOptional({ description: 'Tax amount' })
  taxAmount?: number;

  @ApiPropertyOptional({ description: 'Discount amount' })
  discountAmount?: number;

  @ApiProperty({ description: 'Total amount including tax and discounts' })
  totalAmount: number;

  @ApiProperty({ description: 'Date when the invoice was created' })
  invoiceDate: Date;

  @ApiProperty({ description: 'Due date for the invoice' })
  dueDate: Date;

  @ApiPropertyOptional({ description: 'Invoice description' })
  description?: string;

  @ApiPropertyOptional({ description: 'Additional notes' })
  notes?: string;

  @ApiProperty({
    type: [InvoiceLineItemDto],
    description: 'List of items in the invoice',
  })
  lineItems: InvoiceLineItemDto[];

  @ApiProperty({
    description: 'Date when the invoice was created in the system',
  })
  createdAt: Date;

  @ApiProperty({ description: 'Date when the invoice was last updated' })
  updatedAt: Date;

  @ApiPropertyOptional({ description: 'Date when the invoice was paid' })
  paidAt?: Date;

  @ApiProperty({ description: 'Current status of the invoice' })
  status: string;
}
