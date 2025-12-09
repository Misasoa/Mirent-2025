// src/devis/dto/update-devis.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateDevisDto, CreateDevisItemDto } from './create-devis.dto';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsInt,
  IsPositive,
  ValidateNested,
  IsArray,
  IsDateString,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateDevisItemDto extends PartialType(CreateDevisItemDto) {}

export class UpdateDevisDto extends PartialType(CreateDevisDto) {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @IsInt()
  clientId?: number;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsBoolean()
  includesFuel?: boolean;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  fuelCostPerDay?: number;
}
