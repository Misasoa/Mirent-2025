import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDate,
  ValidateNested,
  ArrayNotEmpty,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { CreateProformaItemByCriteriaDto } from './create-proformaItem.dto';

export class CreateProformaByCriteriaDto {
  @IsNotEmpty()
  @IsString()
  clientLastName: string;

  @IsOptional()
  @IsString()
  clientEmail?: string;

  @IsOptional()
  @IsString()
  clientPhone?: string;

  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  date: Date;

  @IsOptional()
  @IsString()
  contractReference?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsNotEmpty()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateProformaItemByCriteriaDto)
  items: CreateProformaItemByCriteriaDto[];
}
