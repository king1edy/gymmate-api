import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  IsOptional,
  IsDateString,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class InvoiceLineItemDto {
  @ApiProperty({ description: 'Description of the item' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Quantity of items' })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({ description: 'Price per unit' })
  @IsNumber()
  @IsNotEmpty()
  unitPrice: number;

  @ApiProperty({ description: 'Total price for this item' })
  @IsNumber()
  @IsNotEmpty()
  totalPrice: number;

  @ApiPropertyOptional({
    description: 'Type of item (e.g., membership, service)',
  })
  @IsString()
  @IsOptional()
  itemType?: string;

  @ApiPropertyOptional({ description: 'Reference ID of the item' })
  @IsString()
  @IsOptional()
  itemId?: string;
}

export class CreateInvoiceDto {
  @ApiProperty({ description: 'ID of the member this invoice is for' })
  @IsUUID()
  @IsNotEmpty()
  memberId: string;

  @ApiProperty({ description: 'ID of the gym this invoice belongs to' })
  @IsUUID()
  @IsNotEmpty()
  gymId: string;

  @ApiProperty({ description: 'Invoice number' })
  @IsString()
  @IsNotEmpty()
  invoiceNumber: string;

  @ApiProperty({ description: 'Subtotal amount before tax and discounts' })
  @IsNumber()
  @IsNotEmpty()
  subtotal: number;

  @ApiPropertyOptional({ description: 'Tax amount' })
  @IsNumber()
  @IsOptional()
  taxAmount?: number;

  @ApiPropertyOptional({ description: 'Discount amount' })
  @IsNumber()
  @IsOptional()
  discountAmount?: number;

  @ApiProperty({ description: 'Total amount including tax and discounts' })
  @IsNumber()
  @IsNotEmpty()
  totalAmount: number;

  @ApiProperty({ description: 'Date when the invoice was created' })
  @IsDateString()
  @IsNotEmpty()
  invoiceDate: Date;

  @ApiProperty({ description: 'Due date for the invoice' })
  @IsDateString()
  @IsNotEmpty()
  dueDate: Date;

  @ApiPropertyOptional({ description: 'Invoice description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Additional notes' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({
    type: [InvoiceLineItemDto],
    description: 'List of items in the invoice',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InvoiceLineItemDto)
  @IsNotEmpty()
  lineItems: InvoiceLineItemDto[];
}
