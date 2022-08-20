import { CreateCurrencyDto } from './dto/create-currency.dto';
import { EditCurrencyDto } from './dto/edit-currency.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { PrismaService } from '../prisma/prisma.service';
import { CurrencyService } from './currency.service';
import { GetUser } from '../auth/decorator';
import {
  CreateExchangeRateDto,
  EditExchangeRateDto,
} from './dto';

@UseGuards(JwtGuard)
@Controller('currency')
export class CurrencyController {
  constructor(private currencyService: CurrencyService) {}

  @Post()
  async createCurrency(
    @Body() dto: CreateCurrencyDto,
    @GetUser('id') userId: number,
  ) {
    return this.currencyService.createCurrency(dto, userId);
  }

  @Post('rate/:currency')
  async addExchangeRate(
    @Body() dto: CreateExchangeRateDto,
    @GetUser() user: any,
    @Param('currency') nameCurrency: string,
  ) {
    return this.currencyService.addExchangeRate(
      dto,
      user,
      nameCurrency,
    );
  }

  @Get('/rate/:currency')
  async getExchangeRates(
    @GetUser() user: any,
    @Param('currency') nameCurrency: string,
  ) {
    return this.currencyService.getExchangeRates(
      user,
      nameCurrency,
    );
  }

  @Get('/rate/:from/:to/:amount')
  async convertCurrency(
    @GetUser() user: any,
    @Param('from') from: string,
    @Param('to') to: string,
    @Param('amount') amount: number,
  ) {
    return this.currencyService.convertCurrency(
      user,
      from,
      to,
      amount,
    );
  }

  @Patch(':currency')
  async updateCurrency(
    @GetUser() user: any,
    @Body() dto: EditCurrencyDto,
    @Param('currency') currency: string,
  ) {
    return this.currencyService.updateCurrency(
      user,
      dto,
      currency,
    );
  }

  @Patch(':currency/:exchangeRate')
  async updateExchangeRate(
    @GetUser() user: any,
    @Body() dto: EditExchangeRateDto,
    @Param('currency') currency: string,
    @Param('exchangeRate') exChangeRate: string,
  ) {
    return this.currencyService.updateExchangeRate(
      user,
      dto,
      currency,
      exChangeRate,
    );
  }

  // @HttpCode(HttpStatus.NO_CONTENT) // 204
  @Delete(':currency')
  async deleteCurrency(
    @Param('currency') currency: string,
  ) {
    return this.currencyService.deleteCurrency(currency);
  }

  // @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':currency/:exchangeRate')
  async deleteExchangeRate(
    @GetUser() user: any,
    @Param('currency') currency: string,
    @Param('exchangeRate') name: string,
  ) {
    return this.currencyService.deleteExchangeRate(
      user,
      currency,
      name,
    );
  }

  // @Get('/d_rate/:from/:to/:amount')
  // async convertCurrencyByDollarRate(
  //   @GetUser() user: any,
  //   @Param('from') from: string,
  //   @Param('to') to: string,
  //   @Param('amount') amount: number,
  // ) {
  //   return this.currencyService.convertCurrencyByDollarRate(
  //     user,
  //     from,
  //     to,
  //     amount,
  //   );
  // }
}
