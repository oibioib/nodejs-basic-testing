import { generateLinkedList } from './index';

describe('generateLinkedList', () => {
  test('should generate linked list from values 1', () => {
    const linkedListValues = [1, 10, 100, 1000];
    const expectedLinkedList = {
      value: 1,
      next: {
        value: 10,
        next: {
          value: 100,
          next: {
            value: 1000,
            next: {
              value: null,
              next: null,
            },
          },
        },
      },
    };

    const linkedList = generateLinkedList(linkedListValues);
    expect(linkedList).toStrictEqual(expectedLinkedList);
  });

  test('should generate linked list from values 2', () => {
    const linkedListValues = [2, 20, 200, 2000];
    const linkedList = generateLinkedList(linkedListValues);
    expect(linkedList).toMatchSnapshot();
  });
});
