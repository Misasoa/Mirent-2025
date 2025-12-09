import { Transform, TransformFnParams, Type } from 'class-transformer';
import { IsString, IsOptional, IsInt, IsNotEmpty, IsNumber, IsDate } from 'class-validator';

export class UpdateVehiculeDto {
  @IsOptional()
  @IsString()
  nom?: string;

  @IsOptional()
  @IsString()
  marque?: string;

  @IsOptional()
  @IsString()
  modele?: string;

  @IsOptional()
  @IsString()
  immatriculation?: string;

  @IsOptional()
  @IsInt()
  @Transform(({ value }: TransformFnParams) => parseInt(value))
  nombrePlace?: number;
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  distance_moyenne?: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  derniere_visite?: Date;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsInt()
  @Transform(({ value }: TransformFnParams) => parseInt(value))
  typeId?: number;

  @IsOptional()
  @IsInt()
  @Transform(({ value }: TransformFnParams) => parseInt(value))
  statusId?: number;
}
export default UpdateVehiculeDto;
