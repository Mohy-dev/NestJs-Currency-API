/*eslint-disable*/
import {
  IsString,
  IsNotEmpty,
  IsUppercase,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateCurrencyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsUppercase()
  code: string;

  @IsOptional()
  @IsNumber()
  euroRate: number;
}
