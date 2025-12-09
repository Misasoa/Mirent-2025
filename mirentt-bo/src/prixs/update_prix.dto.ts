import { IsNumber, IsOptional } from 'class-validator';

export class UpdatePrixDto {
  @IsOptional()
  @IsNumber()
  region_id?: number;

  @IsOptional()
  @IsNumber()
  district_id?: number;

  @IsOptional()
  @IsNumber()
  prix_location?: number;
}
