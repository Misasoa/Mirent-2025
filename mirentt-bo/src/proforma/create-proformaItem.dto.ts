import { Transform } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class VehicleCriteria {
  @IsOptional()
  @IsString()
  marque?: string;

  @IsOptional()
  @IsString()
  modele?: string;

  @IsOptional()
  @IsString()
  type?: string;
}

export class CreateProformaItemByCriteriaDto {
  @IsNotEmpty()
  vehicleCriteria: VehicleCriteria;

  @IsNotEmpty()
  @IsString()
  regionName: string;

  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  dateDepart: Date;

  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  dateRetour: Date;
}
