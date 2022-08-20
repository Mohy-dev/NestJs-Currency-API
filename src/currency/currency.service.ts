import { CreateCurrencyDto } from './dto/create-currency.dto';
import {
  ForbiddenException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateExchangeRateDto,
  EditCurrencyDto,
  EditExchangeRateDto,
} from './dto';

@Injectable()
export class CurrencyService {
  constructor(private prisma: PrismaService) {}

  async createCurrency(
    dto: CreateCurrencyDto,
    userId: number,
  ) {
    codeCurrencyChecker(dto.code);

    // We can implement DRY to clean the repeated code
    const currencyExist =
      await this.prisma.currency.findFirst({
        where: {
          name: dto.name,
        },
      });

    if (currencyExist) {
      throw new NotAcceptableException(
        'Currency already exists',
      );
    }

    const name = dto.name.replace(/ /g, '_');
    const currency = await this.prisma.currency.create({
      data: {
        name: name,
        code: dto.code,
        dollarRate: dto.dollarRate,
        userId,
      },
    });
    return currency;
  }

  async addExchangeRate(
    dto: CreateExchangeRateDto,
    user: any,
    nameCurrency: string,
  ) {
    codeCurrencyChecker(dto.code);

    const currency = await this.prisma.currency.findFirst({
      where: {
        name: nameCurrency,
      },
    });

    if (!currency) {
      throw new NotFoundException(
        'Currency not found to add exchange rate to it',
      );
    }

    if (currency.userId !== user.id) {
      throw new ForbiddenException(
        'You are not allowed to perform this action',
      );
    }

    // We can use prisma upsert instead of find and create if it is not found and leave update body empty(some issues faced)
    const exchangeRateExist =
      await this.prisma.exchangeRate.findFirst({
        where: {
          name: dto.name,
          currencyId: currency.id,
        },
      });

    if (exchangeRateExist) {
      throw new NotAcceptableException(
        'Exchange rate already exists',
      );
    }

    const exchangeRate =
      await this.prisma.exchangeRate.create({
        data: {
          rate: dto.rate,
          code: dto.code,
          name: dto.name,
          currencyId: currency.id,
        },
      });

    return exchangeRate;
  }

  async getExchangeRates(user: any, nameCurrency: string) {
    const currency = await this.prisma.currency.findFirst({
      where: {
        name: nameCurrency,
      },
    });

    if (!currency) {
      throw new NotFoundException(
        'Currency not found to get exchange rate from it',
      );
    }

    if (currency.userId !== user.id) {
      throw new ForbiddenException(
        'You are not allowed to perform this action',
      );
    }

    const exchangeRates =
      await this.prisma.exchangeRate.findMany({
        where: {
          currencyId: currency.id,
        },
        select: {
          name: true,
          code: true,
          rate: true,
        },
      });

    if (!exchangeRates) {
      throw new NotFoundException(
        'Exchange rates not found',
      );
    }

    return exchangeRates;
  }

  async convertCurrency(
    user: any,
    fromCurrency: string,
    toCurrency: string,
    amount: number,
  ) {
    if (amount <= 0) {
      throw new NotAcceptableException(
        'Amount must be greater than 0',
      );
    }

    const from = await this.prisma.currency.findFirst({
      where: {
        name: fromCurrency,
      },
    });

    if (!from) {
      throw new NotFoundException(
        'From currency not found to convert from it',
      );
    }

    if (user.id !== from.userId) {
      throw new ForbiddenException(
        'You are not allowed to perform this action',
      );
    }

    const to = await this.prisma.exchangeRate.findFirst({
      where: {
        name: toCurrency,
        currencyId: from.id,
      },
    });

    if (!to) {
      throw new NotFoundException(
        'To currency not found to convert to it',
      );
    }

    const result = amount * to.rate;
    const data: { result: number } = {
      result: result,
    };

    return data;
  }

  async updateCurrency(
    user: any,
    dto: EditCurrencyDto,
    currency: string,
  ) {
    codeCurrencyChecker(dto.code);

    const currencyExist =
      await this.prisma.currency.findFirst({
        where: {
          name: currency,
        },
      });

    if (!currencyExist) {
      throw new NotFoundException(
        'Currency not found to update it',
      );
    }

    if (currencyExist.userId !== user.id) {
      throw new ForbiddenException(
        'You are not allowed to perform this action',
      );
    }

    await this.prisma.currency.updateMany({
      where: {
        name: currency,
      },
      data: {
        dollarRate: dto.dollarRate,
        code: dto.code,
        name: dto.name,
      },
    });

    const data: { message: string } = {
      message: 'Currency updated successfully',
    };

    return data;
  }

  async updateExchangeRate(
    user: any,
    dto: EditExchangeRateDto,
    currency: string,
    exchangeRate: string,
  ) {
    codeCurrencyChecker(dto.code);

    const currencyExist =
      await this.prisma.currency.findFirst({
        where: {
          name: currency,
        },
      });

    if (!currencyExist) {
      throw new NotFoundException(
        'Currency not found to update exchange rate from it',
      );
    }

    if (currencyExist.userId !== user.id) {
      throw new ForbiddenException(
        'You are not allowed to perform this action',
      );
    }

    const exchangeRateExist =
      await this.prisma.exchangeRate.findFirst({
        where: {
          name: exchangeRate,
          currencyId: currencyExist.id,
        },
      });

    if (!exchangeRateExist) {
      throw new NotFoundException(
        'Exchange rate not found to update it',
      );
    }

    await this.prisma.exchangeRate.updateMany({
      where: {
        name: exchangeRate,
        currencyId: currencyExist.id,
      },
      data: {
        rate: dto.rate,
        code: dto.code,
        name: dto.name,
      },
    });

    const data: { message: string } = {
      message: 'Exchange rate updated successfully',
    };

    return data;
  }

  async deleteCurrency(currency: string) {
    const currencyExist =
      await this.prisma.currency.findFirst({
        where: {
          name: currency,
        },
      });

    if (!currencyExist) {
      throw new NotFoundException(
        'Currency not found to delete it',
      );
    }

    await this.prisma.currency.deleteMany({
      where: {
        name: currency,
      },
    });

    const data: { message: string } = {
      message: 'Currency deleted successfully',
    };

    return data;
  }

  async deleteExchangeRate(
    user: any,
    nameCurrency: string,
    nameExchangeRate: string,
  ) {
    const currency = await this.prisma.currency.findFirst({
      where: {
        name: nameCurrency,
      },
    });

    if (!currency) {
      throw new NotFoundException(
        'Currency not found to delete exchange rate from it',
      );
    }

    if (currency.userId !== user.id) {
      throw new ForbiddenException(
        'You are not allowed to perform this action',
      );
    }

    const exchangeRate =
      await this.prisma.exchangeRate.findFirst({
        where: {
          name: nameExchangeRate,
          currencyId: currency.id,
        },
      });

    if (!exchangeRate) {
      throw new NotFoundException(
        'Exchange rate not found to delete it',
      );
    }

    await this.prisma.exchangeRate.deleteMany({
      where: {
        name: nameExchangeRate,
        currencyId: currency.id,
      },
    });

    const data: { message: string } = {
      message: 'Exchange rate deleted successfully',
    };

    return data;
  }

  // async convertCurrencyByDollarRate() { some logic }
}

const codeCurrencyChecker = (codeCurrency) => {
  const patternCode = /^[A-Z]{3}$/;
  patternCode.test(codeCurrency);

  if (!patternCode.test(codeCurrency)) {
    throw new NotAcceptableException(
      'Code must be 3 uppercase letters like USD, EUR, etc.',
    );
  }
};
