import { Test, TestingModule } from '@nestjs/testing';
import { Encrypter } from '../../helpers/encrypt.service';
import { UsersService } from '../../users/users.service';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { RepositoryMock } from '../__mocks__/typeorm.mock';
import { User } from '../../entities';

jest.mock('typeorm', () => {
  const { DataSourceMock } = jest.requireActual('../__mocks__/typeorm.mock.ts');
  const actual = jest.requireActual('typeorm');
  return {
    ...actual,
    DataSource: DataSourceMock,
  };
});

describe('UsersService', () => {
  let service: UsersService;
  let encrypter: Encrypter;
  let createUserDto: CreateUserDto = {
    email: '',
    password: '',
    fullName: '',
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        UsersService,
        Encrypter,
        {
          provide: 'UserRepository',
          useFactory: () => {
            return RepositoryMock;
          },
        },
      ],
    }).compile();

    service = moduleRef.get<UsersService>(UsersService);
    encrypter = moduleRef.get<Encrypter>(Encrypter);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Create function', () => {
    it('Should create a user', async () => {
      const encryptFn = jest.spyOn(encrypter, 'encrypt');
      RepositoryMock.save.mockResolvedValueOnce(new User());

      const user = await service.create(createUserDto);

      expect(encryptFn).toBeCalledTimes(1);
      expect(RepositoryMock.save).toBeCalledTimes(1);
      expect(user).toBeInstanceOf(User);
    });
  });
});
