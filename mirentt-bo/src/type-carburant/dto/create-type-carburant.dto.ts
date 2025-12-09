import { IsString, IsNotEmpty } from 'class-validator';

export class CreateTypeCarburantDto {
  @IsString()
  @IsNotEmpty()
  nom: string;
}
