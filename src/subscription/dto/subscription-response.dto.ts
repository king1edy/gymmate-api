import { ApiProperty } from '@nestjs/swagger';

export class SubscriptionResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  gymId: string;

  @ApiProperty()
  planName: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  currency: string;

  @ApiProperty()
  billingCycle: string;

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  endDate: Date;

  @ApiProperty()
  autoRenew: boolean;

  @ApiProperty()
  features: string[];

  @ApiProperty()
  maxMembers: number;

  @ApiProperty({ nullable: true })
  canceledAt: Date;

  @ApiProperty({ nullable: true })
  cancelReason: string;

  @ApiProperty()
  paymentHistory: any[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
