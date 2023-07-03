import lodash from 'lodash';

import { BankAccount, InsufficientFundsError, getBankAccount } from './index';

const mockAmount = 1000;
let bankAccount: BankAccount;

describe('BankAccount', () => {
  beforeEach(() => {
    bankAccount = getBankAccount(mockAmount);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should create account with initial balance', () => {
    expect(bankAccount.getBalance()).toBe(mockAmount);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    expect(() => {
      bankAccount.withdraw(mockAmount + 1);
    }).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring more than balance', () => {
    const anotherBankAccount = getBankAccount(mockAmount);

    expect(() => {
      bankAccount.transfer(mockAmount + 1, anotherBankAccount);
    }).toThrow();
  });

  test('should throw error when transferring to the same account', () => {
    expect(() => {
      bankAccount.transfer(mockAmount - 1, bankAccount);
    }).toThrow();
  });

  test('should deposit money', () => {
    const mockDeposit = 10;
    const result = bankAccount.deposit(mockDeposit).getBalance();
    expect(result).toBe(mockAmount + mockDeposit);
  });

  test('should withdraw money', () => {
    const mockWithdrawAmount = 100;
    const result = bankAccount.withdraw(mockWithdrawAmount).getBalance();
    expect(result).toBe(mockAmount - mockWithdrawAmount);
  });

  test('should transfer money', () => {
    const mockAnotherBankAccountAmount = 500;
    const anotherBankAccount = getBankAccount(mockAnotherBankAccountAmount);
    const mockTransferAmount = 100;

    const resultBankAccountAmount = bankAccount
      .transfer(mockTransferAmount, anotherBankAccount)
      .getBalance();

    const resultAnotherAccountAmount = anotherBankAccount.getBalance();

    expect(resultBankAccountAmount).toBe(mockAmount - mockTransferAmount);
    expect(resultAnotherAccountAmount).toBe(
      mockAnotherBankAccountAmount + mockTransferAmount,
    );
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const mockBalanceRandom = 10;
    const mockRequestFailedRandom = 1;

    jest
      .spyOn(lodash, 'random')
      .mockReturnValueOnce(mockBalanceRandom)
      .mockReturnValueOnce(mockRequestFailedRandom);

    const result = await bankAccount.fetchBalance();
    expect(typeof result).toBe('number');
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const mockNewBalance = 10;

    jest.spyOn(bankAccount, 'fetchBalance').mockResolvedValue(mockNewBalance);

    await bankAccount.synchronizeBalance();
    const result = bankAccount.getBalance();
    expect(result).toBe(mockNewBalance);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const mockBalanceRandom = 10;
    const mockRequestFailedRandom = 0;

    jest
      .spyOn(lodash, 'random')
      .mockReturnValueOnce(mockBalanceRandom)
      .mockReturnValueOnce(mockRequestFailedRandom);

    const result = await bankAccount.fetchBalance();
    expect(result).toBeNull();
  });
});
