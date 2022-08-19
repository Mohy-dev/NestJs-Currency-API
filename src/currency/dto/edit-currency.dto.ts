/*eslint-disable*/
import { IsNumber } from 'class-validator';

export class EditCurrencyDto {
  @IsNumber()
  euroRate: number;
}
