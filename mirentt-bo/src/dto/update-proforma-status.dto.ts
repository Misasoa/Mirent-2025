import { IsNotEmpty, IsEnum } from 'class-validator';
import { ProformaStatus } from 'src/entities/proforma.entity';

export class UpdateProformaStatusDto {
  @IsNotEmpty()
  @IsEnum(ProformaStatus)
  status: ProformaStatus;
}
