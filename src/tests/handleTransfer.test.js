import handleTransfer from '../handlers/handleTransfer';
import User from '../entities/user';
import { jest } from '@jest/globals';

describe('handleTransfer', () => {
    let setCurrentUser;
    let users;

    beforeEach(() => {
        setCurrentUser = jest.fn();
        users = new Map();
    });

    test('should return message when no user is logged in', () => {
        const result = handleTransfer(['transfer', 'user2', '50'], null, users, jest.fn(), setCurrentUser);
        expect(result).toBe('No user is currently logged in. Please log in first.');
    });

    test('should return message when no target username is specified', () => {
        const currentUser = new User('user1', 100);
        const result = handleTransfer(['transfer'], currentUser, users, jest.fn(), setCurrentUser);
        expect(result).toBe('Please specify a valid username and amount to transfer.');
    });

    test('should return message when invalid amount is specified', () => {
        const currentUser = new User('user1', 100);
        const result = handleTransfer(['transfer', 'user2', '-50'], currentUser, users, jest.fn(), setCurrentUser);
        expect(result).toBe('Please specify a positive amount to transfer.');
    });

    test('should return message when target user does not exist', () => {
        const currentUser = new User('user1', 100);
        const result = handleTransfer(['transfer', 'user2', '50'], currentUser, users, jest.fn(), setCurrentUser);
        expect(result).toBe('User user2 does not exist.');
    });

    test('should return message when trying to transfer to self', () => {
        const currentUser = new User('user1', 100);
        users.set('user1', currentUser);
        const result = handleTransfer(['transfer', 'user1', '50'], currentUser, users, jest.fn(), setCurrentUser);
        expect(result).toBe('You cannot transfer money to yourself.');
    });

    test('should update users\' balances and histories on successful transfer', () => {
        const user1 = new User('user1', 100);
        const user2 = new User('user2', 50);
        users.set('user1', user1);
        users.set('user2', user2);

        const result = handleTransfer(['transfer', 'user2', '50'], user1, users, jest.fn(), setCurrentUser);

        expect(result).toContain('You transferred $50 to user2.');

        const updatedUser1 = users.get('user1');
        const updatedUser2 = users.get('user2');

        expect(updatedUser1.balance).toBe(50);
        expect(updatedUser1.history).toEqual(expect.arrayContaining(['You transferred $50 to user2.']));
        expect(updatedUser2.balance).toBe(100); // Assuming the initial balance of user2 was 50 and $50 was transferred

        // Additional assertions can be added based on your application's logic
    });
});
