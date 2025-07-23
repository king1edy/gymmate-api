import { IsNotEmpty, IsString, IsObject, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTenantDto {
    @ApiProperty({ description: 'Tenant subdomain' })
    @IsString()
    @IsNotEmpty()
    subdomain: string;

    @ApiProperty({ description: 'Tenant name' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiPropertyOptional({ description: 'Tenant settings' })
    @IsObject()
    @IsOptional()
    settings?: Record<string, any>;

    @ApiPropertyOptional({ description: 'Billing information' })
    @IsObject()
    @IsOptional()
    billingInfo?: Record<string, any>;
}
