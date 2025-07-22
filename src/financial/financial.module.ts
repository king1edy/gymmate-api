import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentMethod } from './payment-method.entity';
import { Invoice } from './invoice.entity';
import { InvoiceLineItem } from './invoice-line-item.entity';
import { FinancialController } from './financial.controller';
import { FinancialService } from './financial.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PaymentMethod,
      Invoice,
      InvoiceLineItem,
    ]),
  ],
  controllers: [FinancialController],
  providers: [FinancialService],
  exports: [TypeOrmModule, FinancialService],
})
export class FinancialModule {}
