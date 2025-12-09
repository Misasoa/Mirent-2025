import { IsNotEmpty, IsOptional, IsString, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class FindAvailableVehiclesDto {
  @IsOptional()
  @IsString()
  marque?: string;

  @IsOptional()
  @IsString()
  modele?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  dateDepart: Date;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  dateRetour: Date;
}
