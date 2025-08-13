import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({ description: 'JWT access token' })
  accessToken: string;

  @ApiProperty({ example: 'Bearer' })
  tokenType: string;

  @ApiProperty({ description: 'User ID' })
  userId: string;

  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: ['member'] })
  roles: string[];

  @ApiProperty({ example: 86400 })
  expiresIn: number;
}
