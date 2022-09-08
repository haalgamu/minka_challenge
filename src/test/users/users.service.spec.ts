import { Test, TestingModule } from '@nestjs/testing';
import { Encrypter } from '../../helpers/encrypt.service';
import { UsersService } from '../../users/users.service';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { RepositoryMock } from '../__mocks__/typeorm.mock';
import { User } from '../../entities';
import { HttpException, HttpStatus } from '@nestjs/common';

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

    it('Throw a exception create a user', async () => {
      const encryptFn = jest.spyOn(encrypter, 'encrypt');
      RepositoryMock.save.mockClear();
      RepositoryMock.save.mockRejectedValueOnce({
        ...new Error(),
        detail: 'conlfict',
      });

      try {
        await service.create(createUserDto);
      } catch (e) {
        expect(encryptFn).toBeCalledTimes(1);
        expect(RepositoryMock.save).toBeCalledTimes(1);
        expect(e).toBeInstanceOf(HttpException);
      }
    });
  });

  describe('Update function', () => {
    it('Should update a user', async () => {
      const encryptFn = jest.spyOn(encrypter, 'encrypt');

      RepositoryMock.update.mockClear();
      RepositoryMock.findOneBy.mockClear();

      RepositoryMock.update.mockResolvedValueOnce({
        affected: 1,
      });
      RepositoryMock.findOneBy.mockResolvedValueOnce(new User());

      const user = await service.update(1, createUserDto);

      expect(encryptFn).toBeCalledTimes(1);
      expect(RepositoryMock.update).toBeCalledTimes(1);
      expect(RepositoryMock.findOneBy).toBeCalledTimes(1);
      expect(user).toBeInstanceOf(User);
    });

    it('Throw a exception (404) when the user doesnt exist', async () => {
      RepositoryMock.update.mockClear();
      RepositoryMock.findOneBy.mockClear();

      const encryptFn = jest.spyOn(encrypter, 'encrypt');

      RepositoryMock.update.mockResolvedValueOnce({
        affected: 0,
      });

      try {
        const user = await service.update(1, createUserDto);
      } catch (e) {
        expect(encryptFn).toBeCalledTimes(1);
        expect(RepositoryMock.update).toBeCalledTimes(1);
        expect(RepositoryMock.findOneBy).toBeCalledTimes(0);
        expect(e).toBeInstanceOf(HttpException);
        expect(e.status).toBe(HttpStatus.NOT_FOUND);
      }
    });

    it('Throw a exception (500) when the repository fails', async () => {
      RepositoryMock.update.mockClear();
      RepositoryMock.findOneBy.mockClear();

      const encryptFn = jest.spyOn(encrypter, 'encrypt');

      RepositoryMock.update.mockRejectedValueOnce({
        ...new Error(),
        detail: 'any error',
      });

      try {
        const user = await service.update(1, createUserDto);
      } catch (e) {
        expect(encryptFn).toBeCalledTimes(1);
        expect(RepositoryMock.update).toBeCalledTimes(1);
        expect(RepositoryMock.findOneBy).toBeCalledTimes(0);
        expect(e).toBeInstanceOf(HttpException);
        expect(e.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      }
    });
  });

  describe('findByEmail function', () => {
    it('Should get a user by email', async () => {
      RepositoryMock.findOneBy.mockClear();

      RepositoryMock.findOneBy.mockResolvedValueOnce(new User());

      const user = await service.findByEmail('email');

      expect(RepositoryMock.findOneBy).toBeCalledTimes(1);
      expect(user).toBeInstanceOf(User);
    });

    it('Throw a exception (404) when the user doesnt exist', async () => {
      RepositoryMock.findOneBy.mockClear();
      RepositoryMock.findOneBy.mockResolvedValueOnce(null);

      try {
        const user = await service.findByEmail('email');
      } catch (e) {
        expect(RepositoryMock.findOneBy).toBeCalledTimes(1);
        expect(e).toBeInstanceOf(HttpException);
        expect(e.status).toBe(HttpStatus.NOT_FOUND);
      }
    });

    it('Throw a exception (500) when the repository fails', async () => {
      RepositoryMock.findOneBy.mockClear();

      RepositoryMock.findOneBy.mockRejectedValueOnce({
        ...new Error(),
        detail: 'any error',
      });

      try {
        const user = await service.findByEmail('email');
      } catch (e) {
        expect(RepositoryMock.findOneBy).toBeCalledTimes(1);
        expect(e).toBeInstanceOf(HttpException);
        expect(e.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      }
    });
  });
});
