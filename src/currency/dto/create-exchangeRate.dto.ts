/*eslint-disable*/
import {
  IsString,
  IsNotEmpty,
  IsUppercase,
  IsNumber,
} from 'class-validator';

export class CreateExchangeRateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsUppercase()
  code: string;

  @IsNotEmpty()
  rate: number;
}
