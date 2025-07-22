import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentMethod } from './payment-method.entity';
import { Invoice } from './invoice.entity';
import { InvoiceLineItem } from './invoice-line-item.entity';

@Injectable()
export class FinancialService {
  constructor(
    @InjectRepository(PaymentMethod)
    private paymentMethodRepository: Repository<PaymentMethod>,
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
    @InjectRepository(InvoiceLineItem)
    private invoiceLineItemRepository: Repository<InvoiceLineItem>,
  ) {}

  async getInvoices(query: any) {
    return this.invoiceRepository.find({
      relations: ['member', 'gym'],
      where: query,
    });
  }

  async getInvoiceById(id: string) {
    return this.invoiceRepository.findOne({
      where: { id },
      relations: ['member', 'gym'],
    });
  }

  async createInvoice(data: any) {
    const invoice = this.invoiceRepository.create(data);
    const savedInvoice = await this.invoiceRepository.save(invoice) as Invoice | Invoice[];

    if (data.lineItems) {
      for (const item of data.lineItems) {
        const lineItem = this.invoiceLineItemRepository.create({
          ...item,
          invoice: Array.isArray(savedInvoice) ? savedInvoice[0] : savedInvoice,
        });
        await this.invoiceLineItemRepository.save(lineItem);
      }
    }

    const savedInvoiceId = Array.isArray(savedInvoice) ? savedInvoice[0].id : savedInvoice.id;
    return this.getInvoiceById(savedInvoiceId);
  }

  async updateInvoice(id: string, data: any) {
    await this.invoiceRepository.update(id, data);
    return this.getInvoiceById(id);
  }

  async deleteInvoice(id: string) {
    return this.invoiceRepository.delete(id);
  }

  async getPaymentMethods(query: any) {
    return this.paymentMethodRepository.find({
      relations: ['member'],
      where: query,
    });
  }

  async createPaymentMethod(data: any) {
    const paymentMethod = this.paymentMethodRepository.create(data);
    return this.paymentMethodRepository.save(paymentMethod);
  }

  async deletePaymentMethod(id: string) {
    return this.paymentMethodRepository.delete(id);
  }
}
