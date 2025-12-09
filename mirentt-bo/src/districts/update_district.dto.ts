import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateDistrictDto {
  @IsOptional()
  @IsString()
  nom_district?: string;

  @IsOptional()
  @IsNumber()
  region_id?: number;
}
