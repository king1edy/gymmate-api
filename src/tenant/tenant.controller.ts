import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TenantService } from './tenant.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../user/dto/UserRole';

@ApiTags('tenants')
@Controller('tenants')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TenantController {
    constructor(private readonly tenantService: TenantService) {}

    @Post()
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Create a new tenant' })
    @ApiResponse({ status: 201, description: 'Tenant successfully created.' })
    create(@Body() createTenantDto: CreateTenantDto) {
        return this.tenantService.create(createTenantDto);
    }

    @Get()
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Get all tenants' })
    findAll() {
        return this.tenantService.findAll();
    }

    @Get(':id')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Get tenant by ID' })
    findOne(@Param('id') id: string) {
        return this.tenantService.findOne(id);
    }

    @Patch(':id')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Update tenant' })
    update(@Param('id') id: string, @Body() updateTenantDto: UpdateTenantDto) {
        return this.tenantService.update(id, updateTenantDto);
    }

    @Delete(':id')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Delete tenant' })
    remove(@Param('id') id: string) {
        return this.tenantService.remove(id);
    }
}
