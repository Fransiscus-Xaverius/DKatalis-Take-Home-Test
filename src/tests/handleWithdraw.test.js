import handleWithdraw from '../handlers/handleWithdraw';
import User from '../entities/user';
import { jest } from '@jest/globals';

describe('handleWithdraw', () => {
    let setCurrentUser, setUsers, users;

    beforeEach(() => {
        setCurrentUser = jest.fn();
        setUsers = jest.fn();
        users = new Map();
    });

    test('should return message when no user is logged in', () => {
        const result = handleWithdraw(['withdraw', '50'], null, users, setUsers, setCurrentUser);
        expect(result).toBe('No user is currently logged in. Please log in first.');
    });

    test('should return message when no amount is specified', () => {
        const currentUser = new User('testUser', 100);
        users.set('testUser', currentUser);
        const result = handleWithdraw(['withdraw'], currentUser, users, setUsers, setCurrentUser);
        expect(result).toBe('Please specify an amount to withdraw');
    });

    test('should return message when invalid amount is specified', () => {
        const currentUser = new User('testUser', 100);
        users.set('testUser', currentUser);
        const result = handleWithdraw(['withdraw', '-50'], currentUser, users, setUsers, setCurrentUser);
        expect(result).toBe('Please specify a valid amount to withdraw (positive round numbers only)');
    });

    test('should return message when insufficient funds', () => {
        const currentUser = new User('testUser', 100);
        users.set('testUser', currentUser);
        const result = handleWithdraw(['withdraw', '150'], currentUser, users, setUsers, setCurrentUser);
        expect(result).toBe('Insufficient funds. Your current balance is $100');
    });

    test('should update user balance and history on successful withdraw', () => {
        const currentUser = new User('testUser', 100);
        users.set('testUser', currentUser);
        const result = handleWithdraw(['withdraw', '50'], currentUser, users, setUsers, setCurrentUser);

        const expectedUser = {
            ...currentUser,
            balance: 50,
            history: expect.arrayContaining([expect.stringContaining('Withdrew $50. New balance: $50')])
        };

        expect(setCurrentUser).toHaveBeenCalledWith(expect.objectContaining(expectedUser));

        const updatedUsers = new Map(users);
        updatedUsers.set('testUser', expect.objectContaining(expectedUser));
        expect(setUsers).toHaveBeenCalledWith(updatedUsers);

        expect(result).toContain('Withdrew $50');
    });

    test('should handle non-numeric amount gracefully', () => {
        const currentUser = new User('testUser', 100);
        users.set('testUser', currentUser);
        const result = handleWithdraw(['withdraw', 'abc'], currentUser, users, setUsers, setCurrentUser);
        expect(result).toBe('Please specify a valid amount to withdraw (positive round numbers only)');
    });
});
