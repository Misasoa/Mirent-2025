import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateDistrictDto {
  @IsString()
  nom_district: string;

  @IsOptional()
  @IsNumber()
  region_id?: number;
}
