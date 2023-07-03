import axios from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const baseURL = 'https://jsonplaceholder.typicode.com';
const mockUrl = '/todos/1';
const mockData = {
  userId: 1,
  id: 1,
  title: 'mock title',
  completed: false,
};

describe('throttledGetDataFromApi', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    mockedAxios.create.mockReturnThis();
    mockedAxios.get.mockResolvedValue({ data: mockData });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should create instance with provided base url', async () => {
    await throttledGetDataFromApi(mockUrl);
    expect(mockedAxios.create).toHaveBeenCalledWith({ baseURL });
  });

  test('should perform request to correct provided url', async () => {
    await throttledGetDataFromApi(mockUrl);
    jest.runAllTimers();
    expect(mockedAxios.get).toHaveBeenCalledWith(mockUrl);
  });

  test('should return response data', async () => {
    const result = await throttledGetDataFromApi(mockUrl);
    expect(result).toEqual(mockData);
  });
});
