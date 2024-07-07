import handleLogin from '../handlers/handleLogin';
import User from '../entities/user';
import { jest } from '@jest/globals';

describe('handleLogin', () => {
    let setCurrentUser;
    let setUsers;
    let users;
  
    beforeEach(() => {
        setCurrentUser = jest.fn();
        setUsers = jest.fn();
        users = new Map();
    });
  
    //Test case for case where user is not registered and should be registered.
    test('should create a new user and log in when user does not exist', () => {
      const commands = ['login', 'newUser'];
      const result = handleLogin(commands, users, setUsers, setCurrentUser, null);
  
      // Ensure setUsers and setCurrentUser function was called
      expect(setUsers).toHaveBeenCalledTimes(1); 
      expect(setCurrentUser).toHaveBeenCalledTimes(1);
  
      // Check if a new user is created and logged in
      expect(result).toContain('Welcome, newUser');
      expect(result).toContain('Your balance is $0');
  
      const newUser = setUsers.mock.calls[0][0].get('newUser');
      expect(newUser).toBeInstanceOf(User);
      expect(newUser.username).toBe('newUser');
      expect(newUser.balance).toBe(0);
    });

    //Test case for case where user is already registere.
    test('should log in existing user', () => {
        const existingUser = new User('existingUser', 100);
        users.set('existingUser', existingUser);

        const commands = ['login', 'existingUser'];
        const result = handleLogin(commands, users, setUsers, setCurrentUser, null);

        expect(setUsers).not.toHaveBeenCalled(); // Ensure setUsers function was not called again
        expect(setCurrentUser).toHaveBeenCalledTimes(1); // Ensure setCurrentUser function was called
        expect(result).toContain('Welcome back, existingUser');

        const loggedInUser = setCurrentUser.mock.calls[0][0];
        expect(loggedInUser).toBe(existingUser);
    });

    //Test case for case where username is not specified
    test('should handle case where username is not specified', () => {
        const commands = ['login'];
        const result = handleLogin(commands, users, setUsers, setCurrentUser, null);

        expect(setUsers).not.toHaveBeenCalled(); // Ensure setUsers function was not called
        expect(setCurrentUser).not.toHaveBeenCalled(); // Ensure setCurrentUser function was not called
        expect(result).toBe('Please specify your username');
    });

    //Test case for case where use is already logged in
    test('should handle case where user is already logged in', () => {
        const currentUser = new User('current', 100);
        const commands = ['login', 'newUser'];
        const result = handleLogin(commands, users, setUsers, setCurrentUser, currentUser);

        expect(setUsers).not.toHaveBeenCalled(); // Ensure setUsers function was not called
        expect(setCurrentUser).not.toHaveBeenCalled(); // Ensure setCurrentUser function was not called
        expect(result).toContain(`You're already logged in as ${currentUser.username}`);
    });
});
