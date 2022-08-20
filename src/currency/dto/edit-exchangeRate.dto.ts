/*eslint-disable*/
import { IsOptional } from 'class-validator';

export class EditExchangeRateDto {
  @IsOptional()
  name: string;

  @IsOptional()
  rate: number;

  @IsOptional()
  code: string;
}
