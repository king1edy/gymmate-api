import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class AssignPermissionDto {
  @ApiProperty({ description: 'Permission ID' })
  @IsUUID()
  @IsNotEmpty()
  permissionId: string;
}
