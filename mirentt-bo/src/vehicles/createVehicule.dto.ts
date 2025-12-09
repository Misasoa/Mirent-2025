import { Type } from 'class-transformer';
import { IsDate, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';


export class CreateVehiculeDto {
  @IsNotEmpty()
  @IsString()
  nom: string;

  @IsNotEmpty()
  @IsString()
  marque: string;

  @IsNotEmpty()
  @IsString()
  modele: string;

  @IsNotEmpty()
  @IsString()
  immatriculation: string;

  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  nombrePlace: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  distance_moyenne?: number;


  @IsOptional()
  @IsDate()
  @Type(() => Date)
  derniere_visite?: Date;

  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  typeId: number;

  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  statusId: number;

  @IsOptional()
  @IsString()
  imageUrl?: string;

}