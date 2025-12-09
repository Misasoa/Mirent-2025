import { IsString, IsBoolean, IsOptional, IsJSON } from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  type: string;

  @IsString()
  message: string;

  @IsBoolean()
  @IsOptional()
  isRead?: boolean;

  @IsOptional()
  payload?: any;
}
