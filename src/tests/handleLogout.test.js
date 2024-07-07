import handleLogout from '../handlers/handleLogout';
import User from '../entities/user';
import { jest } from '@jest/globals';

describe('handleLogout', () => {
    let setCurrentUser;

    beforeEach(() => {
        setCurrentUser = jest.fn();
    });

    test('should return message when no user is logged in', () => {
        const result = handleLogout(null, setCurrentUser);
        expect(result).toBe('No user is currently logged in');
        expect(setCurrentUser).not.toHaveBeenCalled();
    });

    test('should return goodbye message and clear current user', () => {
        const currentUser = new User('testUser', 100);
        const result = handleLogout(currentUser, setCurrentUser);
        expect(result).toBe('Goodbye, testUser');
        expect(setCurrentUser).toHaveBeenCalledWith(null);
    });
});
