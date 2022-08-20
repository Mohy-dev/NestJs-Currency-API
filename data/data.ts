/*eslint-disable*/
import * as argon from 'argon2';

const password = (password) => {
  argon.hash(password);
};

export const users: any = [
  {
    id: 1,
    firstName: 'Alice',
    email: 'just@email.com',
    password: 'password',
    lastName: 'Smith',
  },
  {
    id: 2,
    firstName: 'Bob',
    email: 'email@example.com',
    password: 'password',
    lastName: 'Smith',
  },
];

export const currencies: any = [
  {
    userId: 1,
    id: 1,
    name: 'dollar',
    code: 'USD',
    dollarRate: 1,
  },
  {
    userId: 1,
    id: 2,
    name: 'euro',
    code: 'EUR',
    dollarRate: 0.9956,
  },
  {
    userId: 1,
    id: 3,
    name: 'pound',
    code: 'GBP',
    dollarRate: 1.285,
  },
  {
    userId: 1,
    id: 4,
    name: 'yen',
    code: 'JPY',
    dollarRate: 0.0091,
  },
  {
    userId: 2,
    id: 5,
    name: 'franc',
    code: 'CHF',
    dollarRate: 0.999,
  },
  {
    userId: 2,
    id: 6,
    name: 'yuan',
    code: 'CNY',
    dollarRate: 0.145,
  },
];

export const exchangeRates: any = [
  {
    currencyId: 1, // USD
    rate: 1,
    code: 'USD',
    name: 'dollar',
  },
  {
    currencyId: 1,
    rate: 0.9956,
    code: 'EUR',
    name: 'euro',
  },
  {
    currencyId: 1,
    rate: 1.285,
    code: 'GBP',
    name: 'pound',
  },
  {
    currencyId: 2, // EUR
    rate: 1.0044,
    code: 'USD',
    name: 'dollar',
  },
  {
    currencyId: 2,
    rate: 1,
    code: 'EUR',
    name: 'euro',
  },
  {
    currencyId: 2,
    rate: 1.291,
    code: 'GBP',
    name: 'pound',
  },
  {
    currencyId: 3, // GBP
    rate: 0.777,
    code: 'USD',
    name: 'dollar',
  },
  {
    currencyId: 3,
    rate: 0.772,
    code: 'EUR',
    name: 'euro',
  },
  {
    currencyId: 3,
    rate: 1,
    code: 'GBP',
    name: 'pound',
  },
];
