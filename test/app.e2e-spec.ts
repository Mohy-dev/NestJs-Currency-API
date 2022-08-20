import { AuthDto } from './../src/auth/dto/auth.dto';
import { PrismaService } from '../src/prisma/prisma.service';
import { AppModule } from './../src/app.module';
import { Test } from '@nestjs/testing';
import {
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import * as pactum from 'pactum';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true }),
    );

    await app.init();
    await app.listen(3333);

    prisma = app.get(PrismaService);
    await prisma.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3333');
  });
  afterAll(async () => {
    await app.close();
  });

  const dto: AuthDto = {
    email: 'test@test.com',
    password: 'test',
  };

  describe('Auth', () => {
    const emptyFieldsTest = (opt) => {
      it('should throw if email is empty', () => {
        pactum
          .spec()
          .post(`/auth/${opt}`)
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });

      it('should throw if password is empty', () => {
        pactum
          .spec()
          .post(`/auth/${opt}`)
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });

      it('should throw if body is empty', () => {
        pactum
          .spec()
          .post(`/auth/${opt}`)
          .expectStatus(400);
      });
    };

    describe('signUp', () => {
      it('should signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201)
          .stores('userId', 'id');
      });
    });

    emptyFieldsTest('signup'); // Empty fields test

    describe('signIn', () => {
      it('should sigin', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('token', 'access_token');
      });

      emptyFieldsTest('signin'); // Empty fields test
    });
  });

  describe('Create Currency', () => {
    it('should create currency', () => {
      return pactum
        .spec()
        .post('/currency')
        .withHeaders({
          Authorization: 'Bearer $S{token}',
        })
        .withBody({
          name: 'dollar',
          code: 'USD',
          dollarRate: 1,
          userId: '$S{userId}',
        })
        .expectStatus(201);
    });
    it('should throw if currency already exists', () => {
      return pactum
        .spec()
        .post('/currency')
        .withHeaders({
          Authorization: 'Bearer $S{token}',
        })
        .withBody({
          name: 'dollar',
          code: 'USD',
          dollarRate: 1,
          userId: '$S{userId}',
        })
        .expectStatus(406);
    });
    it('should throw if code is not valid', () => {
      return pactum
        .spec()
        .post('/currency')
        .withHeaders({
          Authorization: 'Bearer $S{token}',
        })
        .withBody({
          name: 'dollar',
          code: 'US',
          dollarRate: 1,
          userId: '$S{userId}',
        })
        .expectStatus(406);
    });
    it('should throw if code is not capitalized', () => {
      return pactum
        .spec()
        .post('/currency')
        .withHeaders({
          Authorization: 'Bearer $S{token}',
        })
        .withBody({
          name: 'dollar',
          code: 'usd',
          dollarRate: 1,
          userId: '$S{userId}',
        })
        .expectStatus(400);
    });
    it('should throw if dollarRate is not valid', () => {
      return pactum
        .spec()
        .post('/currency')
        .withHeaders({
          Authorization: 'Bearer $S{token}',
        })
        .withBody({
          name: 'dollar',
          code: 'USD',
          dollarRate: -1,
          userId: '$S{userId}',
        })
        .expectStatus(406);
    });
    it('should throw if not authorized', () => {
      return pactum
        .spec()
        .post('/currency')
        .withBody({
          name: 'dollar',
          code: 'USD',
          dollarRate: 1,
          userId: '$S{userId}',
        })
        .expectStatus(401);
    });
  });

  describe('Add ExchangeRates', () => {
    it('should add exchange rate', () => {
      return pactum
        .spec()
        .post('/currency/rate/dollar')
        .withHeaders({
          Authorization: 'Bearer $S{token}',
        })
        .withBody({
          rate: 1,
          code: 'USD',
          name: 'dollar',
          userId: '$S{userId}',
        })
        .expectStatus(201);
    });
    it('should throw if rate is not valid', () => {
      return pactum
        .spec()
        .post('/currency/rate/dollar')
        .withHeaders({
          Authorization: 'Bearer $S{token}',
        })
        .withBody({
          rate: -1,
          code: 'USD',
          name: 'dollar',
          userId: '$S{userId}',
        })
        .expectStatus(406);
    });
    it('should throw if code is not valid', () => {
      return pactum
        .spec()
        .post('/currency/rate/dollar')
        .withHeaders({
          Authorization: 'Bearer $S{token}',
        })
        .withBody({
          rate: 1,
          code: 'US',
          name: 'dollar',
          userId: '$S{userId}',
        })
        .expectStatus(406);
    });
    it('should throw if code is not capitalized', () => {
      return pactum
        .spec()
        .post('/currency/rate/dollar')
        .withHeaders({
          Authorization: 'Bearer $S{token}',
        })
        .withBody({
          rate: 1,
          code: 'usd',
          name: 'dollar',
          userId: '$S{userId}',
        })
        .expectStatus(400);
    });
    it('should throw if currency not exist', () => {
      return pactum
        .spec()
        .post('/currency/rate/dollars')
        .withHeaders({
          Authorization: 'Bearer $S{token}',
        })
        .withBody({
          rate: 1,
          code: 'USD',
          name: 'dollar',
          userId: '$S{userId}',
        })
        .expectStatus(404);
    });
    it('should throw if exchange rate exist', () => {
      return pactum
        .spec()
        .post('/currency/rate/dollar')
        .withHeaders({
          Authorization: 'Bearer $S{token}',
        })
        .withBody({
          rate: 1,
          code: 'USD',
          name: 'dollar',
          userId: '$S{userId}',
        })
        .expectStatus(406);
    });
    it('should throw if not authorized', () => {
      return pactum
        .spec()
        .post('/currency/rate/dollar')
        .withBody({
          rate: 1,
          code: 'USD',
          name: 'dollar',
          userId: '$S{userId}',
        })
        .expectStatus(401);
    });
  });

  describe('Get ExchangeRates', () => {
    it('should get exchange rate', () => {
      return pactum
        .spec()
        .get('/currency/rate/dollar')
        .withHeaders({
          Authorization: 'Bearer $S{token}',
        })
        .expectStatus(200);
    });
    it('should throw if currency not exist', () => {
      return pactum
        .spec()
        .get('/currency/rate/dollars')
        .withHeaders({
          Authorization: 'Bearer $S{token}',
        })
        .expectStatus(404);
    });
    it('should throw if not authorized', () => {
      return pactum
        .spec()
        .get('/currency/rate/dollar')
        .expectStatus(401);
    });
  });

  describe('Convert Currency', () => {
    it('should convert currency', () => {
      return pactum
        .spec()
        .get('/currency/rate/dollar/dollar/10')
        .withHeaders({
          Authorization: 'Bearer $S{token}',
        })
        .expectStatus(200);
    });
    it('should throw if currency not exist', () => {
      return pactum
        .spec()
        .get('/currency/rate/dollars/dollar/10')
        .withHeaders({
          Authorization: 'Bearer $S{token}',
        })
        .expectStatus(404);
    });
    it('should throw if amount is not valid', () => {
      return pactum
        .spec()
        .get('/currency/rate/dollar/dollar/-10')
        .withHeaders({
          Authorization: 'Bearer $S{token}',
        })
        .expectStatus(406);
    });
    it('should throw if not authorized', () => {
      return pactum
        .spec()
        .get('/currency/rate/dollar/dollar/10')
        .expectStatus(401);
    });
  });

  describe('Update Currency', () => {
    it('should update currency', () => {
      return pactum
        .spec()
        .patch('/currency/dollar')
        .withHeaders({
          Authorization: 'Bearer $S{token}',
        })
        .withBody({
          name: 'dollar',
          code: 'USD',
          dollarRate: 1,
          userId: '$S{userId}',
        })
        .expectStatus(200);
    });
    it('should throw if currency not exist', () => {
      return pactum
        .spec()
        .patch('/currency/dollars')
        .withHeaders({
          Authorization: 'Bearer $S{token}',
        })
        .withBody({
          name: 'dollar',
          code: 'USD',
          dollarRate: 1,
          userId: '$S{userId}',
        })
        .expectStatus(404);
    });
    it('should throw if the code is not valid', () => {
      return pactum
        .spec()
        .patch('/currency/dollar')
        .withHeaders({
          Authorization: 'Bearer $S{token}',
        })
        .withBody({
          name: 'dollar',
          code: 'US',
          dollarRate: 1,
          userId: '$S{userId}',
        })
        .expectStatus(406);
    });
    it('should throw if not authorized', () => {
      return pactum
        .spec()
        .patch('/currency/dollar')
        .withBody({
          name: 'dollar',
          code: 'USD',
          dollarRate: 1,
          userId: '$S{userId}',
        })
        .expectStatus(401);
    });
  });

  describe('Delete exchange rate', () => {
    it('should delete exchange rate', () => {
      return pactum
        .spec()
        .delete('/currency/dollar/dollar')
        .withHeaders({
          Authorization: 'Bearer $S{token}',
        })
        .expectStatus(200);
    });
    it('should throw if currency not exist', () => {
      return pactum
        .spec()
        .delete('/currency/rate/dollars')
        .withHeaders({
          Authorization: 'Bearer $S{token}',
        })
        .expectStatus(404);
    });
    it('should throw if not authorized', () => {
      return pactum
        .spec()
        .delete('/currency/rate/dollar')
        .expectStatus(401);
    });
  });

  describe('Delete Currency', () => {
    it('should delete currency', () => {
      return pactum
        .spec()
        .delete('/currency/dollar')
        .withHeaders({
          Authorization: 'Bearer $S{token}',
        })
        .expectStatus(200);
    });
    it('should throw if currency not exist', () => {
      return pactum
        .spec()
        .delete('/currency/dollars')
        .withHeaders({
          Authorization: 'Bearer $S{token}',
        })
        .expectStatus(404);
    });
    it('should throw if not authorized', () => {
      return pactum
        .spec()
        .delete('/currency/dollar')
        .expectStatus(401);
    });
  });
});
