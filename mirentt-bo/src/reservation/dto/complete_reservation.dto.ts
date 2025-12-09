import { IsNumber, IsNotEmpty } from 'class-validator';

export class CompleteReservationDto {
  @IsNumber()
  @IsNotEmpty()
  carburant_retour: number;
}
