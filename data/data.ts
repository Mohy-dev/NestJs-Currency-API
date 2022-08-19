/*eslint-disable*/
import * as argon from 'argon2';

const password = argon.hash('password');
export const data: any = [
  {
    firstName: 'Alice',
    email: 'just@email.com',
    password: 'password',
    lastName: 'Smith',
  },
  {
    firstName: 'Bob',
    email: 'email@example.com',
    password: 'password',
    lastName: 'Smith',
  },
];
