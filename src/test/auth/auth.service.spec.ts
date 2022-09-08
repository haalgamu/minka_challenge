import { Test, TestingModule } from '@nestjs/testing';
import { Encrypter } from '../../helpers/encrypt.service';
import { AuthService } from '../../auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from '../../users/users.service';
import { User } from '../../entities';

jest.mock('typeorm', () => {
  const { DataSourceMock } = jest.requireActual('../__mocks__/typeorm.mock.ts');
  const actual = jest.requireActual('typeorm');
  return {
    ...actual,
    DataSource: DataSourceMock,
  };
});

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  const credentials: any = {
    email: 'a@a.com',
    password: 'pass',
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        UsersModule,
        JwtModule.register({
          secret: 'secret',
        }),
        TypeOrmModule.forRoot(),
      ],
      providers: [AuthService, Encrypter],
    }).compile();

    service = moduleRef.get<AuthService>(AuthService);
    usersService = moduleRef.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateCredentials function', () => {
    it('validateCredentials should return a User if credentials are ok', async () => {
      const userRes = new User();
      userRes.password = await new Encrypter().encrypt(credentials.password);
      jest.spyOn(usersService, 'findByEmail').mockResolvedValueOnce(userRes);

      const user = await service.validateCredentials(
        credentials.email,
        credentials.password,
      );

      expect(user).toBeInstanceOf(User);
    });

    it('validateCredentials should return null if credentials are wrong', async () => {
      const userRes = new User();
      userRes.password = await new Encrypter().encrypt(
        credentials.password + '1',
      );
      jest.spyOn(usersService, 'findByEmail').mockResolvedValueOnce(userRes);

      const user = await service.validateCredentials(
        credentials.email,
        credentials.password,
      );

      expect(user).toBeNull();
    });
  });

  describe('createToken function', () => {
    it('createToken should return a bearer token', async () => {
      const userRes = new User();
      const token = await service.createToken(userRes);

      expect(token).toBeDefined();
    });
  });

  describe('login function', () => {
    it('login should return a response include the bearer token', async () => {
      const userRes = new User();
      const token = await service.login(userRes);
      expect(token).toBeDefined();
    });
  });
});
