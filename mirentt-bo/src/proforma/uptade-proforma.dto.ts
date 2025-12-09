import {
  IsDate,
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { VehicleCriteria } from './create-proformaItem.dto'; // Assurez-vous que c'est le bon chemin

export class UpdateProformaItemDto {
  @IsOptional()
  @IsInt()
  clientId?: number;

  @IsOptional()
  // @Type(() => VehicleCriteria) // Décommentez si VehicleCriteria est un objet complexe et doit être transformé
  vehicleCriteria?: VehicleCriteria; // La structure exacte de VehicleCriteria doit être définie

  @IsOptional()
  @IsString()
  regionName?: string; // Doit être le nom de la région, pas son ID

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  dateDepart?: Date;

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  dateRetour?: Date;

  // --- NOUVEAUX CHAMPS (si vous voulez les mettre à jour) ---
  @IsOptional()
  @IsInt()
  prixId?: number; // Ajoutez si nécessaire

  @IsOptional()
  @IsInt()
  proformaId?: number; // Ajoutez si nécessaire, mais souvent l'ID de la proforma parente n'est pas modifié via l'item

  @IsOptional()
  @IsInt()
  @IsPositive()
  nombreJours?: number; // Ajoutez si nécessaire

  @IsOptional()
  @IsNumber()
  @IsPositive()
  subTotal?: number; // Ajoutez si nécessaire
}
