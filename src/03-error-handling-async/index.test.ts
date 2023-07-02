import {
  throwError,
  throwCustomError,
  resolveValue,
  MyAwesomeError,
  rejectCustomError,
} from './index';

describe('resolveValue', () => {
  test('should resolve provided value', async () => {
    const result = await resolveValue(2);
    expect(result).toBe(2);
  });
});

describe('throwError', () => {
  test('should throw error with provided message', () => {
    const mockErrorMessage = 'Error message';
    expect(() => {
      throwError(mockErrorMessage);
    }).toThrow(mockErrorMessage);
  });

  test('should throw error with default message if message is not provided', () => {
    expect(throwError).toThrow('Oops!');
  });
});

describe('throwCustomError', () => {
  test('should throw custom error', () => {
    expect(throwCustomError).toThrow(MyAwesomeError);
  });
});

describe('rejectCustomError', () => {
  test('should reject custom error', async () => {
    expect.assertions(1);
    await expect(rejectCustomError()).rejects.toEqual(new MyAwesomeError());
  });
});
