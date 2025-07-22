import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class GetInvoiceDto {
  @ApiProperty({ description: 'ID of the invoice to retrieve' })
  @IsUUID()
  id: string;
}
