import {
  IsString,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class CreatePrixDto {
  @IsNumber()
  prix: number;
}

export class CreateRegionDto {
  @IsString()
  nom_region: string;

  @IsOptional()
  @IsString()
  nom_district?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreatePrixDto)
  prix: CreatePrixDto;
}
