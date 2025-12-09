import { IsString, IsEmail, IsOptional } from 'class-validator';

export class UpdateClientDto {
  @IsString()
  @IsOptional()
  lastName?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  logo?: string;
}
