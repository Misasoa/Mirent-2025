import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @IsEmail({}, { message: 'Veuillez fournir une adresse email valide.' })
  @IsNotEmpty({ message: "L'email est requis." })
  email: string;

  @IsNotEmpty({ message: 'Le mot de passe est requis.' })
  password: string;
}
