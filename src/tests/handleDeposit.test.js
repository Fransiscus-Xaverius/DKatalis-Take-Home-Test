import handleDeposit from '../handlers/handleDeposit';
import User from '../entities/user';
import { jest} from '@jest/globals';

describe('handleDeposit', () => {
    let setCurrentUser;
    let setUsers;
    let users;

    beforeEach(() => {
        setCurrentUser = jest.fn();
        setUsers = jest.fn();
        users = new Map();
    });

    test('should return message when no user is logged in', () => {
        const result = handleDeposit(['deposit', '50'], null, users, setUsers, setCurrentUser);
        expect(result).toBe('No user is currently logged in. Please log in first.');
        expect(setUsers).not.toHaveBeenCalled(); // Ensure setUsers function was not called
        expect(setCurrentUser).not.toHaveBeenCalled(); // Ensure setCurrentUser function was not called
    });

    test('should return message when no amount is specified', () => {
        const currentUser = new User('testUser', 100);
        const result = handleDeposit(['deposit'], currentUser, users, setUsers, setCurrentUser);
        expect(result).toBe('Please specify an amount to deposit');
        expect(setUsers).not.toHaveBeenCalled(); // Ensure setUsers function was not called
        expect(setCurrentUser).not.toHaveBeenCalled(); // Ensure setCurrentUser function was not called
    });

    test('should return message when invalid amount is specified', () => {
        const currentUser = new User('testUser', 100);
        const result = handleDeposit(['deposit', '-50'], currentUser, users, setUsers, setCurrentUser);
        expect(result).toBe('Please specify a valid amount to deposit (positive round numbers only)');
        expect(setUsers).not.toHaveBeenCalled(); // Ensure setUsers function was not called
        expect(setCurrentUser).not.toHaveBeenCalled(); // Ensure setCurrentUser function was not called
    });

    test('should update user balance and history on successful deposit', () => {
        const currentUser = new User('testUser', 100);
        const result = handleDeposit(['deposit', '50'], currentUser, users, setUsers, setCurrentUser);

        expect(setUsers).toHaveBeenCalledTimes(1); // Ensure setUsers function was called once
        expect(setCurrentUser).toHaveBeenCalledTimes(1); // Ensure setCurrentUser function was called once

        expect(result).toContain('Your balance is $150');

        const updatedUser = setUsers.mock.calls[0][0].get('testUser');
        expect(updatedUser.balance).toBe(150);
        expect(updatedUser.history).toEqual(expect.arrayContaining(['Deposited $50. New balance: $150']));
    });

});
