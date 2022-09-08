import { Test } from '@nestjs/testing';
import { Encrypter } from '../../helpers/encrypt.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from '../../users/users.controller';
import { UsersService } from '../../users/users.service';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { User } from '../../entities';

jest.mock('typeorm', () => {
  const { DataSourceMock } = jest.requireActual('../__mocks__/typeorm.mock.ts');
  const actual = jest.requireActual('typeorm');
  return {
    ...actual,
    DataSource: DataSourceMock,
  };
});

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;
  let encrypter: Encrypter;
  let createUserDto: CreateUserDto = {
    email: '',
    password: '',
    fullName: '',
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [],
      controllers: [UsersController],
      providers: [
        UsersService,
        Encrypter,
        {
          provide: 'UserRepository',
          useFactory: () => {
            return {};
          },
        },
      ],
    }).compile();

    encrypter = moduleRef.get<Encrypter>(Encrypter);
    usersService = moduleRef.get<UsersService>(UsersService);
    usersController = moduleRef.get<UsersController>(UsersController);
  });

  describe('create', () => {
    it('should create a User', async () => {
      const userCreateFun = jest
        .spyOn(usersService, 'create')
        .mockResolvedValueOnce(new User());

      const user = await usersController.create(createUserDto);

      expect(userCreateFun).toBeCalledTimes(1);
      expect(user).toBeInstanceOf(User);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const userUpdateFun = jest
        .spyOn(usersService, 'update')
        .mockResolvedValueOnce(new User());

      const user = await usersController.update('1', createUserDto);

      expect(userUpdateFun).toBeCalledTimes(1);
      expect(user).toBeInstanceOf(User);
    });
  });

  describe('remove', () => {
    it('should update a user', async () => {
      const userRemoveFun = jest
        .spyOn(usersService, 'remove')
        .mockResolvedValueOnce(new User());

      const user = await usersController.remove('1');

      expect(userRemoveFun).toBeCalledTimes(1);
      expect(user).toBeDefined();
    });
  });

  describe('findOne', () => {
    it('should get a user by id', async () => {
      const userFindOneFun = jest
        .spyOn(usersService, 'findOne')
        .mockResolvedValueOnce(new User());

      const user = await usersController.findOne('1');

      expect(userFindOneFun).toBeCalledTimes(1);
      expect(user).toBeDefined();
    });
  });

  describe('findAll', () => {
    it('should get a list of users', async () => {
      const userFindAllFun = jest
        .spyOn(usersService, 'findAll')
        .mockResolvedValueOnce([new User()]);

      const users = await usersController.findAll();

      expect(userFindAllFun).toBeCalledTimes(1);
      expect(users.length).toBe(1);
    });
  });
});
