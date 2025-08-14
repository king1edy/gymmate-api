import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { FinancialService } from './financial.service';
import { ApiTags } from '@nestjs/swagger';

// FinancialController handles financial operations such as invoices and payment methods
// swaggerTag: 'Financial Operations'
@ApiTags('Financial management endpoints')
@Controller('financial')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FinancialController {
  constructor(private readonly financialService: FinancialService) {}

  @Get('invoices')
  @Roles('admin', 'staff')
  async getInvoices(@Query() query: any) {
    return this.financialService.getInvoices(query);
  }

  @Get('invoices/:id')
  @Roles('admin', 'staff')
  async getInvoice(@Param('id') id: string) {
    return this.financialService.getInvoiceById(id);
  }

  @Post('invoices')
  @Roles('admin')
  async createInvoice(@Body() data: any) {
    return this.financialService.createInvoice(data);
  }

  @Put('invoices/:id')
  @Roles('admin')
  async updateInvoice(@Param('id') id: string, @Body() data: any) {
    return this.financialService.updateInvoice(id, data);
  }

  @Delete('invoices/:id')
  @Roles('admin')
  async deleteInvoice(@Param('id') id: string) {
    return this.financialService.deleteInvoice(id);
  }

  @Get('payment-methods')
  @Roles('admin', 'staff')
  async getPaymentMethods(@Query() query: any) {
    return this.financialService.getPaymentMethods(query);
  }

  @Post('payment-methods')
  @Roles('admin', 'staff')
  async createPaymentMethod(@Body() data: any) {
    return this.financialService.createPaymentMethod(data);
  }

  @Delete('payment-methods/:id')
  @Roles('admin')
  async deletePaymentMethod(@Param('id') id: string) {
    return this.financialService.deletePaymentMethod(id);
  }
}
