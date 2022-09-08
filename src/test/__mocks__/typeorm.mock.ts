export const findMock = jest.fn();

export const RepositoryMock = {
  save: jest.fn(),
  find: jest.fn(),
  findOneBy: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

export const DataSourceMock = jest.fn().mockImplementation((options) => {
  return {
    options,
    entityMetadatas: {
      find() {},
    },
    getRepository() {
      return RepositoryMock;
    },
  };
});
