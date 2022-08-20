/*eslint-disable*/
import { IsOptional } from 'class-validator';
export class EditCurrencyDto {
  @IsOptional()
  name: string;

  @IsOptional()
  code: string;

  @IsOptional()
  dollarRate: number;
}
