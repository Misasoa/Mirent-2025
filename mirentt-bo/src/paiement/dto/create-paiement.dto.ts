import {
  IsInt,
  IsNumber,
  IsEnum,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';
import { PaymentMethod } from '../../entities/paiement.entity';

export class CreatePaiementDto {
  @IsInt()
  @IsNotEmpty()
  bdcId: number;

  @IsInt()
  @IsOptional()
  factureId?: number;

  @IsNumber()
  @IsNotEmpty()
  montant: number;

  @IsEnum(PaymentMethod)
  @IsNotEmpty()
  methode: PaymentMethod;

  @IsOptional()
  reference_transaction?: string;
}
