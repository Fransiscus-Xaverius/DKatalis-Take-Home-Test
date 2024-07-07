import User from "../entities/user";
import { userDetails } from "../utils/helperFunctions";

/**
 * Handles the user login command.
 * 
 * @param {Array} commands - A string array containing the command and its arguments split with a space.
 * @param {Map} users - The current state of the map of users.
 * @param {Function} setUsers - Function to update the state of the map of users.
 * @param {Function} setCurrentUser - Function to set the current logged-in user.
 * @param {Object} currentUser - The currently logged-in user object.
 * @returns {string} - The result message of the login attempt.
 */
const handleLogin = (commands, users, setUsers, setCurrentUser, currentUser) => {
  if (currentUser) {
    return `You're already logged in as ${currentUser.username}`;
  }

  if (!commands[1]) {
    return 'Please specify your username';
  }

  if (users.has(commands[1])) {
    const loggedInUser = users.get(commands[1]);
    setCurrentUser(loggedInUser);
    const messageEntry = `Welcome back, ${commands[1]}`;
    return userDetails(loggedInUser, messageEntry);
  }

  // User does not exist, create a new user
  const newUser = new User(commands[1], 0, [], new Map(), new Map());
  const newUsersMap = new Map(users); // Create a new Map
  newUsersMap.set(commands[1], newUser);
  setUsers(newUsersMap); // Update the state with the new Map
  setCurrentUser(newUser); // Set the newly created user as the current user
  return `Welcome, ${commands[1]}\nYour balance is $0`;
};

export default handleLogin;
