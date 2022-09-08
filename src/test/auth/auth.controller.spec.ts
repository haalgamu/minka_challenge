import { Test } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from '../../auth/auth.controller';
import { AuthService } from '../../auth/auth.service';
import { Encrypter } from '../../helpers/encrypt.service';
import { UsersModule } from '../../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';

jest.mock('typeorm', () => {
  const { DataSourceMock } = jest.requireActual('../__mocks__/typeorm.mock.ts');
  const actual = jest.requireActual('typeorm');
  return {
    ...actual,
    DataSource: DataSourceMock,
  };
});

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let encrypter: Encrypter;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        UsersModule,
        JwtModule.register({
          secret: 'secret',
        }),
        TypeOrmModule.forRoot(),
      ],
      controllers: [AuthController],
      providers: [AuthService, Encrypter],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    encrypter = moduleRef.get<Encrypter>(Encrypter);
    authController = moduleRef.get<AuthController>(AuthController);
  });

  describe('login', () => {
    it('should return an object with a JWT token', async () => {
      const token = 'token';
      const req = {
        body: {
          username: '',
          password: '',
        },
        user: {
          id: 1,
        },
      };

      const result = { token };
      jest.spyOn(authService, 'login').mockImplementation((): any => result);

      expect(await authController.login(req, req.body)).toBe(result);
    });
  });
});
