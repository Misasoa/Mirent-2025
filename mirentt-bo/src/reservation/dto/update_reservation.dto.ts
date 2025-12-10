import { IsString, IsOptional, IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateReservationDto {
    @IsOptional()
    @IsString()
    pickup_date?: string;

    @IsOptional()
    @IsString()
    return_date?: string;

    // Aliases pour compatibility avec le frontend qui envoie parfois startDate/endDate
    @IsOptional()
    @IsString()
    startDate?: string;

    @IsOptional()
    @IsString()
    endDate?: string;

    @IsOptional()
    @IsString()
    fullName?: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsString()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsNumber()
    vehiculeId?: number;
}
