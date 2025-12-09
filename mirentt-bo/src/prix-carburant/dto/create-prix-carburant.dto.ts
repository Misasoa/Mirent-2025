import { IsNumber, IsNotEmpty, IsPositive } from 'class-validator';

export class CreatePrixCarburantDto {
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  prix_par_litre: number;
}
