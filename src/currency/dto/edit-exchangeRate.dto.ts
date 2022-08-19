/*eslint-disable*/
import { IsNumber } from 'class-validator';

export class EditExchangeRateDto {
  @IsNumber()
  rate: number;
}
