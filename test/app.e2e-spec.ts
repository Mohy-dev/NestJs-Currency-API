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
});
