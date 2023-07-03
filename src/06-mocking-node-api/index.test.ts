import {
  readFileAsynchronously,
  doStuffByTimeout,
  doStuffByInterval,
} from './index';
import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const setTimeoutSpy = jest.spyOn(global, 'setTimeout');
    const mockCallback = jest.fn();
    const mockTimeout = 5000;

    doStuffByTimeout(mockCallback, mockTimeout);
    expect(setTimeoutSpy).toHaveBeenCalledWith(mockCallback, mockTimeout);
    setTimeoutSpy.mockRestore();
  });

  test('should call callback only after timeout', () => {
    const mockCallback = jest.fn();
    const mockTimeout = 5000;

    doStuffByTimeout(mockCallback, mockTimeout);
    expect(mockCallback).not.toHaveBeenCalled();
    jest.advanceTimersByTime(mockTimeout);
    expect(mockCallback).toHaveBeenCalled();
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const setIntervalSpy = jest.spyOn(global, 'setInterval');
    const mockCallback = jest.fn();
    const mockTimeout = 5000;

    doStuffByInterval(mockCallback, mockTimeout);
    expect(setIntervalSpy).toHaveBeenCalledWith(mockCallback, mockTimeout);
    setIntervalSpy.mockRestore();
  });

  test('should call callback multiple times after multiple intervals', () => {
    const mockCallback = jest.fn();
    const mockTimeout = 5000;
    const mockTimesCall = 5;

    doStuffByInterval(mockCallback, mockTimeout);
    expect(mockCallback).not.toHaveBeenCalled();
    jest.advanceTimersByTime(mockTimeout * mockTimesCall);
    expect(mockCallback).toHaveBeenCalledTimes(mockTimesCall);
  });
});

describe('readFileAsynchronously', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should call join with pathToFile', async () => {
    const pathJoinSpy = jest.spyOn(path, 'join');
    const mockFilePath = 'mock.txt';

    await readFileAsynchronously(mockFilePath);
    expect(pathJoinSpy).toHaveBeenCalledWith(__dirname, mockFilePath);
  });

  test('should return null if file does not exist', async () => {
    const mockFilePath = 'mock.txt';

    jest.spyOn(fs, 'existsSync').mockReturnValue(false);

    const result = await readFileAsynchronously(mockFilePath);
    expect(result).toBeNull();
  });

  test('should return file content if file exists', async () => {
    const mockFilePath = 'mock.txt';
    const mockFileData = 'mock data';

    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fsPromises, 'readFile').mockResolvedValue(mockFileData);

    const result = await readFileAsynchronously(mockFilePath);
    expect(result).toBe(mockFileData);
  });
});
