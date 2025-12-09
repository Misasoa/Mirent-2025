import {
  IsInt,
  IsDateString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { CarburantPolicy } from 'src/entities/reservation.entity';

export class CreateReservationDto {
  @IsInt()
  @IsNotEmpty()
  clientId: number;

  @IsInt()
  @IsNotEmpty()
  vehiculeId: number;

  @IsDateString()
  @IsNotEmpty()
  pickup_date: string;

  @IsDateString()
  @IsNotEmpty()
  return_date: string;

  @IsInt()
  @IsNotEmpty()
  region_id: number;

  @IsEnum(CarburantPolicy)
  @IsNotEmpty()
  carburant_policy: CarburantPolicy;

  // si "Pay as you use"
  @IsOptional()
  carburant_depart?: number;

  @IsOptional()
  carburant_retour?: number;

  @IsOptional()
  kilometrage_depart?: number;

  @IsOptional()
  kilometrage_retour?: number;

  @IsOptional()
  @IsNumber()
  prix_par_litre?: number;
}
