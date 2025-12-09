import { IsEmail, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Le prénom est requis.' })
  firstName: string;

  @IsNotEmpty({ message: 'Le nom est requis.' })
  lastName: string;

  @IsEmail({}, { message: 'Veuillez fournir une adresse email valide.' })
  @IsNotEmpty({ message: "L'email est requis." })
  email: string;

  @IsNotEmpty({ message: 'Le mot de passe est requis.' })
  @MinLength(6, {
    message: 'Le mot de passe doit contenir au moins 6 caractères.',
  })
  password: string;

  @IsNotEmpty({ message: 'La confirmation du mot de passe est requise.' })
  confirmPassword: string;
}
