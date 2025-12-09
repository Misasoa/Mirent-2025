// src/devis/dto/create-devis.dto.ts
import {
  IsString,
  IsArray,
  ArrayMinSize,
  ValidateNested,
  IsNumber,
  IsPositive,
  IsInt,
  IsOptional,
  IsDateString,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDevisItemDto {
  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsNumber()
  @IsPositive()
  @IsInt()
  regionId: number;

  @IsNumber()
  @IsPositive()
  @IsInt()
  vehiculeId: number;
}

export class CreateDevisDto {
  @IsNumber()
  @IsPositive()
  @IsInt()
  clientId: number;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateDevisItemDto)
  items: CreateDevisItemDto[];

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsBoolean()
  includesFuel: boolean;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  fuelCostPerDay?: number;
}
